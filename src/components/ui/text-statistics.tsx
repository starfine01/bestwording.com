import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Timer, Target, TrendingUp } from "lucide-react";

interface TextStatisticsProps {
  text: string;
}

const TextStatistics = ({ text }: TextStatisticsProps) => {
  // 단어 수 계산
  const wordCount = text.trim() ? text.trim().split(/\s+/).filter(word => word.length > 0).length : 0;
  
  // 문자 수 계산
  const charCount = text.length;
  
  // 문장 수 계산
  const sentenceCount = text.trim() 
    ? text.trim()
        .split(/[.!?]+/)
        .filter(sentence => sentence.trim().length > 0).length 
    : 0;
  
  // 추정 읽기 시간 (분)
  const estimatedReadingTime = Math.ceil(wordCount / 200); // 분당 200단어 기준
  
  // 추정 글쓰기 시간 (분)
  const estimatedWritingTime = Math.ceil(wordCount / 40); // 분당 40단어 기준

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          <CardTitle>텍스트 통계</CardTitle>
        </div>
        <CardDescription>
          현재 작성 중인 텍스트의 통계 정보
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">단어 수</span>
            </div>
            <Badge variant="secondary" className="text-lg w-fit">
              {wordCount.toLocaleString()}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">문자 수</span>
            </div>
            <Badge variant="secondary" className="text-lg w-fit">
              {charCount.toLocaleString()}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">읽기 시간</span>
            </div>
            <Badge variant="secondary" className="text-lg w-fit">
              {estimatedReadingTime}분
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">작성 시간</span>
            </div>
            <Badge variant="secondary" className="text-lg w-fit">
              {estimatedWritingTime}분
            </Badge>
          </div>
        </div>
        {sentenceCount > 0 && (
          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">문장 수</span>
            </div>
            <Badge variant="outline" className="text-base w-fit">
              {sentenceCount}문장
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TextStatistics;