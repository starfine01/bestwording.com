import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { AdminMessage } from "@/lib/storage";
import { getAdminMessagesAsync, saveAdminMessageAsync, updateAdminMessageAsync, deleteAdminMessageAsync } from "@/lib/storageHybrid";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X, Mail, User, Calendar, MessageSquare } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const AdminMessagePage = () => {
  const user = getCurrentUser();
  const isUserAdmin = isAdmin(user);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [adminReply, setAdminReply] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    void loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMessages = async () => {
    try {
      const loaded = await getAdminMessagesAsync(user?.id || null, isUserAdmin);
      setMessages(loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err: any) {
      toast({
        title: "불러오기 실패",
        description: err?.message ?? "메시지를 불러오지 못했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleNew = () => {
    setIsEditing(true);
    setEditingId(null);
    setTitle("");
    setContent("");
  };

  const handleEdit = (message: AdminMessage) => {
    if (!isUserAdmin && message.userId !== user?.id) return;
    
    setIsEditing(true);
    setEditingId(message.id);
    setTitle(message.title);
    setContent(message.content);
    setAdminReply(message.adminReply || "");
  };

  const handleView = async (message: AdminMessage) => {
    setViewingId(message.id);
    // NOTE: admin read-state update via Supabase는 다음 단계(서비스 롤/API)에서 처리.
    if (isUserAdmin && !message.isRead) {
      // keep legacy behavior for now
      await updateAdminMessageAsync(message.id, user?.id || null, isUserAdmin, { isRead: true } as any);
      await loadMessages();
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setViewingId(null);
    setTitle("");
    setContent("");
    setAdminReply("");
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "오류",
        description: "제목과 내용을 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingId) {
        // 수정
        await updateAdminMessageAsync(editingId, user?.id || null, isUserAdmin, {
          title,
          content,
          adminReply: adminReply || undefined,
        } as any);
        toast({
          title: "수정 완료",
          description: "메시지가 수정되었습니다.",
        });
      } else {
        // 새 메시지 작성
        const created = await saveAdminMessageAsync({
          userId: user?.id || null,
          userName: user?.name || null,
          userEmail: user?.email || null,
          title,
          content,
        });

        // 메일 알림(best-effort)
        try {
          await fetch("/api/notify-admin-message", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              title: created.title,
              content: created.content,
              userEmail: created.userEmail,
              userName: created.userName,
            }),
          });
        } catch {
          // ignore
        }

        toast({
          title: "전송 완료",
          description: "운영진에게 메시지가 전송되었습니다.",
        });
      }

      await loadMessages();
      handleCancel();
    } catch (err: any) {
      toast({
        title: "저장 실패",
        description: err?.message ?? "처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAdminMessageAsync(id, user?.id || null, isUserAdmin);
      toast({
        title: "삭제 완료",
        description: "메시지가 삭제되었습니다.",
      });
      await loadMessages();
      setDeleteId(null);
    } catch (err: any) {
      toast({
        title: "삭제 실패",
        description: err?.message ?? "삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleReply = async (messageId: string) => {
    if (!adminReply.trim()) {
      toast({
        title: "오류",
        description: "답변 내용을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateAdminMessageAsync(messageId, user?.id || null, isUserAdmin, {
        adminReply,
        adminReplyAt: new Date().toISOString(),
        isRead: true,
      } as any);

      toast({
        title: "답변 완료",
        description: "답변이 저장되었습니다.",
      });

      await loadMessages();
      setAdminReply("");
      setViewingId(null);
    } catch (err: any) {
      toast({
        title: "답변 실패",
        description: err?.message ?? "답변 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const viewingMessage = messages.find(m => m.id === viewingId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">운영진에게 쓰기</h1>
          <p className="text-muted-foreground mt-2">
            {isUserAdmin ? "사용자들의 메시지를 확인하고 답변할 수 있습니다" : "운영진에게 문의사항이나 의견을 보내주세요"}
          </p>
        </div>
        {!isEditing && !isUserAdmin && (
          <Button onClick={handleNew}>
            <Plus className="mr-2 h-4 w-4" />
            새 메시지 작성
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "메시지 수정" : "새 메시지 작성"}</CardTitle>
            <CardDescription>
              {isUserAdmin && editingId ? "메시지와 답변을 수정할 수 있습니다" : "운영진에게 전달할 메시지를 작성하세요"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="메시지 제목을 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="메시지 내용을 입력하세요"
                rows={10}
                className="font-sans"
              />
            </div>
            {isUserAdmin && editingId && (
              <div className="space-y-2">
                <Label htmlFor="adminReply">운영진 답변</Label>
                <Textarea
                  id="adminReply"
                  value={adminReply}
                  onChange={(e) => setAdminReply(e.target.value)}
                  placeholder="답변 내용을 입력하세요"
                  rows={6}
                  className="font-sans"
                />
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                취소
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                저장
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : viewingMessage ? (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle>{viewingMessage.title}</CardTitle>
                <CardDescription className="mt-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{viewingMessage.userName || "비회원"} {viewingMessage.userEmail && `(${viewingMessage.userEmail})`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(viewingMessage.createdAt).toLocaleString("ko-KR")}</span>
                  </div>
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {(isUserAdmin || viewingMessage.userId === user?.id) && (
                  <Button variant="outline" size="sm" onClick={() => handleEdit(viewingMessage)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                {(isUserAdmin || viewingMessage.userId === user?.id) && (
                  <Button variant="outline" size="sm" onClick={() => setDeleteId(viewingMessage.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => setViewingId(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm font-semibold mb-2 block">메시지 내용</Label>
              <ScrollArea className="h-48 border rounded-md p-4">
                <p className="text-sm whitespace-pre-wrap">{viewingMessage.content}</p>
              </ScrollArea>
            </div>
            {viewingMessage.adminReply && (
              <div>
                <Label className="text-sm font-semibold mb-2 block text-primary">운영진 답변</Label>
                <ScrollArea className="h-32 border rounded-md p-4 bg-primary/5">
                  <p className="text-sm whitespace-pre-wrap">{viewingMessage.adminReply}</p>
                  {viewingMessage.adminReplyAt && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(viewingMessage.adminReplyAt).toLocaleString("ko-KR")}
                    </p>
                  )}
                </ScrollArea>
              </div>
            )}
            {isUserAdmin && !viewingMessage.adminReply && (
              <div className="space-y-2">
                <Label htmlFor="reply">답변 작성</Label>
                <Textarea
                  id="reply"
                  value={adminReply}
                  onChange={(e) => setAdminReply(e.target.value)}
                  placeholder="답변 내용을 입력하세요"
                  rows={6}
                  className="font-sans"
                />
                <Button onClick={() => handleReply(viewingMessage.id)}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  답변 저장
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {messages.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  {isUserAdmin ? "받은 메시지가 없습니다." : "작성한 메시지가 없습니다."}
                </p>
                {!isUserAdmin && (
                  <Button onClick={handleNew}>
                    <Plus className="mr-2 h-4 w-4" />
                    첫 메시지 작성하기
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            messages.map((message) => (
              <Card key={message.id} className="flex flex-col cursor-pointer hover:shadow-lg transition-all" onClick={() => handleView(message)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {message.title}
                        {!message.isRead && isUserAdmin && (
                          <span className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1 space-y-1">
                        {isUserAdmin && (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{message.userName || "비회원"}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(message.createdAt).toLocaleDateString("ko-KR")}</span>
                        </div>
                        {message.adminReply && (
                          <div className="flex items-center gap-1 text-primary">
                            <MessageSquare className="w-3 h-3" />
                            <span>답변 완료</span>
                          </div>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {message.content}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>메시지 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 메시지를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminMessagePage;

