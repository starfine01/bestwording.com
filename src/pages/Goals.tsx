import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getCurrentUser } from "@/lib/auth";
import { getGoals, saveGoal, updateGoal, deleteGoal, Goal } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";
import { Plus, Target, Edit, Trash2, Save, X } from "lucide-react";
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

const GoalsPage = () => {
  const user = getCurrentUser();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [progress, setProgress] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    const userGoals = getGoals(user?.id || null);
    setGoals(userGoals);
  };

  const handleNew = () => {
    setIsEditing(true);
    setEditingId(null);
    setTitle("");
    setDescription("");
    setTargetDate("");
    setProgress(0);
  };

  const handleEdit = (goal: Goal) => {
    setIsEditing(true);
    setEditingId(goal.id);
    setTitle(goal.title);
    setDescription(goal.description);
    setTargetDate(goal.targetDate);
    setProgress(goal.progress);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle("");
    setDescription("");
    setTargetDate("");
    setProgress(0);
  };

  const handleSave = () => {
    if (!title.trim() || !targetDate) {
      toast({
        title: "오류",
        description: "목표와 목표일을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      updateGoal(editingId, { title, description, targetDate, progress });
      toast({
        title: "수정 완료",
        description: "목표가 수정되었습니다.",
      });
    } else {
      saveGoal({
        userId: user?.id || null,
        title,
        description,
        targetDate,
        progress,
      });
      toast({
        title: "저장 완료",
        description: "목표가 저장되었습니다.",
      });
    }

    loadGoals();
    handleCancel();
  };

  const handleProgressUpdate = (id: string, newProgress: number) => {
    updateGoal(id, { progress: newProgress });
    loadGoals();
  };

  const handleDelete = (id: string) => {
    deleteGoal(id);
    toast({
      title: "삭제 완료",
      description: "목표가 삭제되었습니다.",
    });
    loadGoals();
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">진척관리</h1>
          <p className="text-muted-foreground mt-2">
            글쓰기 목표를 설정하고 진척 상황을 관리하세요
          </p>
        </div>
        {!isEditing && (
          <Button onClick={handleNew}>
            <Plus className="mr-2 h-4 w-4" />
            새 목표 설정
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "목표 수정" : "새 목표 설정"}</CardTitle>
            <CardDescription>목표를 설정하고 목표일을 지정하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">목표</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 한 달에 10편의 글 작성"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="목표에 대한 자세한 설명"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetDate">목표일</Label>
              <Input
                id="targetDate"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>
            {editingId && (
              <div className="space-y-2">
                <Label htmlFor="progress">진척도: {progress}%</Label>
                <Input
                  id="progress"
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
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
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">설정한 목표가 없습니다.</p>
                <Button onClick={handleNew}>
                  <Plus className="mr-2 h-4 w-4" />
                  첫 목표 설정하기
                </Button>
              </CardContent>
            </Card>
          ) : (
            goals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <CardDescription className="mt-1">
                        목표일: {new Date(goal.targetDate).toLocaleDateString("ko-KR")}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {goal.description && (
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  )}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>진척도</span>
                      <span className="font-semibold">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleProgressUpdate(goal.id, Math.min(goal.progress + 10, 100))}
                    >
                      +10%
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(goal)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(goal.id)}
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
            <AlertDialogTitle>목표 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 목표를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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

export default GoalsPage;






