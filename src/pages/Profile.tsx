import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser, deleteAccount } from "@/lib/auth";
import { getWritings, getTranscriptions, getGoals, getDiaries } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";
import { User, LogOut, Trash2, FileText, BookOpen, Target, Calendar } from "lucide-react";
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

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [stats, setStats] = useState({
    writings: 0,
    transcriptions: 0,
    goals: 0,
    diaries: 0,
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadStats();
  }, [user, navigate]);

  const loadStats = () => {
    if (!user) return;
    setStats({
      writings: getWritings(user.id).length,
      transcriptions: getTranscriptions(user.id).length,
      goals: getGoals(user.id).length,
      diaries: getDiaries(user.id).length,
    });
  };

  const handleDeleteAccount = () => {
    if (!user) return;
    deleteAccount(user.id);
    toast({
      title: "회원탈퇴 완료",
      description: "계정이 삭제되었습니다.",
    });
    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">프로필</h1>
        <p className="text-muted-foreground mt-2">계정 정보 및 활동 통계</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>계정 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-lg">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  가입일: {new Date(user.createdAt).toLocaleDateString("ko-KR")}
                </p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">회원 상태</p>
              <Badge variant={user.isMember ? "default" : "secondary"}>
                {user.isMember ? "회원" : "비회원"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>활동 통계</CardTitle>
            <CardDescription>지금까지의 활동 내역</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.writings}</p>
                  <p className="text-xs text-muted-foreground">작성한 글</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <BookOpen className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.transcriptions}</p>
                  <p className="text-xs text-muted-foreground">필사</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Target className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.goals}</p>
                  <p className="text-xs text-muted-foreground">목표</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.diaries}</p>
                  <p className="text-xs text-muted-foreground">일기</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">위험 구역</CardTitle>
          <CardDescription>이 작업은 되돌릴 수 없습니다</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            회원탈퇴
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말로 탈퇴하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              회원탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
              정말로 탈퇴하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              탈퇴하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfilePage;

