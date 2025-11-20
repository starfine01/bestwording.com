import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Lightbulb, Sparkles, BookOpen, PenTool } from "lucide-react";

const SupportPage = () => {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = () => {
    if (!text.trim()) {
      toast({
        title: "오류",
        description: "분석할 텍스트를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // 실제로는 AI API를 호출하지만, 여기서는 시뮬레이션
    setTimeout(() => {
      const mockSuggestions = [
        "이 문장을 더 간결하게 표현할 수 있습니다.",
        "'좋다' 대신 '훌륭하다', '탁월하다' 등의 표현을 사용해보세요.",
        "문단 구조를 개선하면 가독성이 향상됩니다.",
        "이 부분에 구체적인 예시를 추가하면 더 명확해집니다.",
      ];
      setSuggestions(mockSuggestions);
      setIsLoading(false);
      toast({
        title: "분석 완료",
        description: "글쓰기 개선 제안을 확인하세요.",
      });
    }, 1000);
  };

  const tools = [
    {
      icon: Sparkles,
      title: "문장 개선",
      description: "작성한 문장을 더 자연스럽고 효과적으로 개선하는 제안을 받으세요.",
    },
    {
      icon: BookOpen,
      title: "어휘 제안",
      description: "더 적절한 단어나 표현을 찾아드립니다.",
    },
    {
      icon: PenTool,
      title: "문체 분석",
      description: "글의 문체를 분석하고 일관성을 유지하도록 도와드립니다.",
    },
    {
      icon: Lightbulb,
      title: "아이디어 제안",
      description: "글의 주제와 관련된 아이디어와 예시를 제안합니다.",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">글쓰기지원</h1>
        <p className="text-muted-foreground mt-2">
          AI 기반 글쓰기 도구로 더 나은 글을 작성하세요
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <tool.icon className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">{tool.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{tool.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>텍스트 분석 및 개선 제안</CardTitle>
          <CardDescription>
            작성한 텍스트를 입력하면 개선 제안을 받을 수 있습니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text">분석할 텍스트</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="개선하고 싶은 텍스트를 입력하세요..."
              rows={10}
              className="font-mono"
            />
          </div>
          <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
            {isLoading ? "분석 중..." : "분석하기"}
          </Button>

          {suggestions.length > 0 && (
            <div className="space-y-2 mt-6">
              <Label>개선 제안</Label>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <Card key={index} className="bg-primary/5">
                    <CardContent className="pt-4">
                      <p className="text-sm">{suggestion}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>글쓰기 팁</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• 명확하고 간결한 문장을 사용하세요.</li>
            <li>• 독자의 관점에서 글을 검토하세요.</li>
            <li>• 구체적인 예시와 설명을 추가하세요.</li>
            <li>• 문단 간 논리적 흐름을 유지하세요.</li>
            <li>• 적절한 어휘 선택으로 글의 품격을 높이세요.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportPage;






