import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCurrentUser } from "@/lib/auth";
import { getDiaries, saveDiary, updateDiary, deleteDiary, Diary } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";
import { Plus, BookOpen, Edit, Trash2, Save, X } from "lucide-react";
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

const MOODS = [
  "😊 기쁨",
  "😢 슬픔",
  "😠 화남",
  "😌 평온",
  "🤔 고민",
  "💪 의욕",
  "😴 피곤",
  "🎉 설렘",
];

const DiaryPage = () => {
  const user = getCurrentUser();
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadDiaries();
  }, []);

  const loadDiaries = () => {
    const userDiaries = getDiaries(user?.id || null);
    setDiaries(userDiaries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const handleNew = () => {
    setIsEditing(true);
    setEditingId(null);
    setDate(new Date().toISOString().split("T")[0]);
    setContent("");
    setMood("");
  };

  const handleEdit = (diary: Diary) => {
    setIsEditing(true);
    setEditingId(diary.id);
    setDate(diary.date);
    setContent(diary.content);
    setMood(diary.mood || "");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setDate(new Date().toISOString().split("T")[0]);
    setContent("");
    setMood("");
  };

  const handleSave = () => {
    if (!content.trim()) {
      toast({
        title: "오류",
        description: "일기 내용을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      updateDiary(editingId, { date, content, mood: mood || undefined });
      toast({
        title: "수정 완료",
        description: "일기가 수정되었습니다.",
      });
    } else {
      saveDiary({
        userId: user?.id || null,
        date,
        content,
        mood: mood || undefined,
      });
      toast({
        title: "저장 완료",
        description: "일기가 저장되었습니다.",
      });
    }

    loadDiaries();
    handleCancel();
  };

  const handleDelete = (id: string) => {
    deleteDiary(id);
    toast({
      title: "삭제 완료",
      description: "일기가 삭제되었습니다.",
    });
    loadDiaries();
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">일기</h1>
          <p className="text-muted-foreground mt-2">
            하루하루를 기록하고 되돌아보세요
          </p>
        </div>
        {!isEditing && (
          <Button onClick={handleNew}>
            <Plus className="mr-2 h-4 w-4" />
            새 일기 작성
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "일기 수정" : "새 일기 작성"}</CardTitle>
            <CardDescription>오늘 하루를 기록하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">날짜</Label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mood">기분</Label>
                <Select value={mood} onValueChange={setMood}>
                  <SelectTrigger>
                    <SelectValue placeholder="기분을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOODS.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="오늘 하루를 자유롭게 기록하세요..."
                rows={12}
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
        <div className="grid gap-4 md:grid-cols-2">
          {diaries.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">작성한 일기가 없습니다.</p>
                <Button onClick={handleNew}>
                  <Plus className="mr-2 h-4 w-4" />
                  첫 일기 작성하기
                </Button>
              </CardContent>
            </Card>
          ) : (
            diaries.map((diary) => (
              <Card key={diary.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {new Date(diary.date).toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          weekday: "long",
                        })}
                      </CardTitle>
                      {diary.mood && (
                        <CardDescription className="mt-1 text-lg">
                          {diary.mood}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(diary)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(diary.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {diary.content}
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
            <AlertDialogTitle>일기 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 일기를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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

export default DiaryPage;


