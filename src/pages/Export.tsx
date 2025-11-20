import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCurrentUser } from "@/lib/auth";
import { getWritings, getTranscriptions, getDiaries, Writing, Transcription, Diary } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";
import { Download, FileText, BookOpen, Calendar } from "lucide-react";

const ExportPage = () => {
  const user = getCurrentUser();
  const [exportType, setExportType] = useState<"writings" | "transcriptions" | "diaries" | "all">("all");
  const [writings, setWritings] = useState<Writing[]>([]);
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [diaries, setDiaries] = useState<Diary[]>([]);

  useEffect(() => {
    if (user) {
      setWritings(getWritings(user.id));
      setTranscriptions(getTranscriptions(user.id));
      setDiaries(getDiaries(user.id));
    }
  }, [user]);

  const exportToText = () => {
    let content = `Best Wording - 내보내기\n`;
    content += `생성일: ${new Date().toLocaleString("ko-KR")}\n`;
    content += `사용자: ${user?.name || "비회원"}\n`;
    content += `\n${"=".repeat(50)}\n\n`;

    if (exportType === "writings" || exportType === "all") {
      content += `# 작성한 글\n\n`;
      writings.forEach((writing, index) => {
        content += `## ${index + 1}. ${writing.title}\n`;
        content += `장르: ${writing.genre}\n`;
        content += `작성일: ${new Date(writing.createdAt).toLocaleDateString("ko-KR")}\n\n`;
        content += `${writing.content}\n\n`;
        content += `\n${"-".repeat(50)}\n\n`;
      });
    }

    if (exportType === "transcriptions" || exportType === "all") {
      content += `# 필사\n\n`;
      transcriptions.forEach((transcription, index) => {
        content += `## ${index + 1}. 필사\n`;
        content += `작성일: ${new Date(transcription.createdAt).toLocaleDateString("ko-KR")}\n\n`;
        content += `### 원문\n${transcription.originalText}\n\n`;
        content += `### 필사 내용\n${transcription.transcribedText}\n\n`;
        if (transcription.reflection) {
          content += `### 감상\n${transcription.reflection}\n\n`;
        }
        content += `\n${"-".repeat(50)}\n\n`;
      });
    }

    if (exportType === "diaries" || exportType === "all") {
      content += `# 일기\n\n`;
      diaries.forEach((diary, index) => {
        content += `## ${index + 1}. ${new Date(diary.date).toLocaleDateString("ko-KR")}\n`;
        if (diary.mood) {
          content += `기분: ${diary.mood}\n\n`;
        }
        content += `${diary.content}\n\n`;
        content += `\n${"-".repeat(50)}\n\n`;
      });
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bestwording-export-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "내보내기 완료",
      description: "파일이 다운로드되었습니다.",
    });
  };

  const exportToPDF = () => {
    toast({
      title: "준비 중",
      description: "PDF 내보내기 기능은 곧 제공될 예정입니다.",
    });
  };

  const getTotalCount = () => {
    if (exportType === "writings") return writings.length;
    if (exportType === "transcriptions") return transcriptions.length;
    if (exportType === "diaries") return diaries.length;
    return writings.length + transcriptions.length + diaries.length;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">출력기능</h1>
        <p className="text-muted-foreground mt-2">
          작성한 글, 필사, 일기를 파일로 내보내세요
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <FileText className="h-8 w-8 text-primary mb-2" />
            <CardTitle>작성한 글</CardTitle>
            <CardDescription>{writings.length}개</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <BookOpen className="h-8 w-8 text-primary mb-2" />
            <CardTitle>필사</CardTitle>
            <CardDescription>{transcriptions.length}개</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Calendar className="h-8 w-8 text-primary mb-2" />
            <CardTitle>일기</CardTitle>
            <CardDescription>{diaries.length}개</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>내보내기 설정</CardTitle>
          <CardDescription>내보낼 항목과 형식을 선택하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">내보낼 항목</label>
            <Select value={exportType} onValueChange={(value: any) => setExportType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="writings">작성한 글만</SelectItem>
                <SelectItem value="transcriptions">필사만</SelectItem>
                <SelectItem value="diaries">일기만</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              선택한 항목: <span className="font-semibold">{getTotalCount()}개</span>
            </p>
          </div>

          <div className="flex space-x-2">
            <Button onClick={exportToText} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              텍스트 파일로 내보내기
            </Button>
            <Button onClick={exportToPDF} variant="outline" className="flex-1" disabled>
              <Download className="mr-2 h-4 w-4" />
              PDF로 내보내기 (준비 중)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportPage;





