import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCurrentUser } from "@/lib/auth";
import { getWritings, saveWriting, updateWriting, deleteWriting, Writing } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
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

const GENRES = [
  "소설",
  "시",
  "에세이",
  "일기",
  "기술문서",
  "비즈니스",
  "학술논문",
  "자유롭게 글쓰기",
];

const WritingPage = () => {
  const user = getCurrentUser();
  const [writings, setWritings] = useState<Writing[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [genre, setGenre] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadWritings();
  }, []);

  const loadWritings = () => {
    const userWritings = getWritings(user?.id || null);
    setWritings(userWritings);
  };

  const handleNew = () => {
    setIsEditing(true);
    setEditingId(null);
    setTitle("");
    setContent("");
    setGenre("");
  };

  const handleEdit = (writing: Writing) => {
    setIsEditing(true);
    setEditingId(writing.id);
    setTitle(writing.title);
    setContent(writing.content);
    setGenre(writing.genre);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle("");
    setContent("");
    setGenre("");
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim() || !genre) {
      toast({
        title: "오류",
        description: "제목, 내용, 장르를 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      updateWriting(editingId, { title, content, genre });
      toast({
        title: "수정 완료",
        description: "글이 수정되었습니다.",
      });
    } else {
      saveWriting({
        userId: user?.id || null,
        title,
        content,
        genre,
      });
      toast({
        title: "저장 완료",
        description: "글이 저장되었습니다.",
      });
    }

    loadWritings();
    handleCancel();
  };

  const handleDelete = (id: string) => {
    deleteWriting(id);
    toast({
      title: "삭제 완료",
      description: "글이 삭제되었습니다.",
    });
    loadWritings();
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">글쓰기</h1>
          <p className="text-muted-foreground mt-2">
            {user ? "회원" : "비회원"} 모드로 글을 작성하고 저장하세요
          </p>
        </div>
        {!isEditing && (
          <Button onClick={handleNew}>
            <Plus className="mr-2 h-4 w-4" />
            새 글 작성
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "글 수정" : "새 글 작성"}</CardTitle>
            <CardDescription>제목, 내용, 장르를 입력하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="글 제목을 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">장르</Label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="장르를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {GENRES.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="글 내용을 입력하세요"
                rows={15}
                className="font-sans"
              />
            </div>
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
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {writings.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">작성한 글이 없습니다.</p>
                <Button onClick={handleNew}>
                  <Plus className="mr-2 h-4 w-4" />
                  첫 글 작성하기
                </Button>
              </CardContent>
            </Card>
          ) : (
            writings.map((writing) => (
              <Card key={writing.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{writing.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {writing.genre} • {new Date(writing.createdAt).toLocaleDateString("ko-KR")}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {writing.content}
                  </p>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(writing)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(writing.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>글 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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

export default WritingPage;


