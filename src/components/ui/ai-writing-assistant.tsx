import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Wand2, MessageSquare, Lightbulb, Palette } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { analyzeText, enhanceWriting, generateWritingIdeas } from "@/lib/ai";

interface AIWritingAssistantProps {
  text: string;
  onTextChange: (newText: string) => void;
  disabled?: boolean;
}

const AIWritingAssistant = ({ text, onTextChange, disabled }: AIWritingAssistantProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'enhance' | 'analyze' | 'ideas'>('enhance');
  const [generatedText, setGeneratedText] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [ideaTheme, setIdeaTheme] = useState("");

  const handleEnhance = async (type: 'expand' | 'summarize' | 'polish') => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await enhanceWriting(text, type);
      if (result.success) {
        setGeneratedText(result.data.result);
        setActiveTab('enhance');
      }
    } catch (error) {
      console.error("Error enhancing text:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await analyzeText(text);
      if (result.success) {
        setAnalysisResult(result.data.result);
        setActiveTab('analyze');
      }
    } catch (error) {
      console.error("Error analyzing text:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateIdeas = async () => {
    if (!ideaTheme.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await generateWritingIdeas(ideaTheme, 5);
      if (result.success) {
        setGeneratedText(result.data.result);
        setActiveTab('ideas');
      }
    } catch (error) {
      console.error("Error generating ideas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyGeneratedText = () => {
    if (generatedText) {
      onTextChange(generatedText);
      setGeneratedText("");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <CardTitle>AI 글쓰기 도우미</CardTitle>
        </div>
        <CardDescription>
          AI를 활용하여 글을 개선하고 분석하세요
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge 
            variant={activeTab === 'enhance' ? 'default' : 'secondary'}
            className="cursor-pointer"
            onClick={() => setActiveTab('enhance')}
          >
            <Wand2 className="h-3 w-3 mr-1" />
            개선
          </Badge>
          <Badge 
            variant={activeTab === 'analyze' ? 'default' : 'secondary'}
            className="cursor-pointer"
            onClick={() => setActiveTab('analyze')}
          >
            <Palette className="h-3 w-3 mr-1" />
            분석
          </Badge>
          <Badge 
            variant={activeTab === 'ideas' ? 'default' : 'secondary'}
            className="cursor-pointer"
            onClick={() => setActiveTab('ideas')}
          >
            <Lightbulb className="h-3 w-3 mr-1" />
            아이디어
          </Badge>
        </div>

        {activeTab === 'enhance' && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">현재 텍스트를 기반으로 AI가 개선합니다</p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEnhance('expand')}
                disabled={disabled || isLoading || !text.trim()}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                확장하기
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEnhance('summarize')}
                disabled={disabled || isLoading || !text.trim()}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                요약하기
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEnhance('polish')}
                disabled={disabled || isLoading || !text.trim()}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                다듬기
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'analyze' && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">텍스트를 분석하여 구조를 파악합니다</p>
            <Button
              size="sm"
              onClick={handleAnalyze}
              disabled={disabled || isLoading || !text.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  분석 중...
                </>
              ) : (
                <>
                  <Palette className="h-4 w-4 mr-2" />
                  텍스트 분석
                </>
              )}
            </Button>
          </div>
        )}

        {activeTab === 'ideas' && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">주제에 맞는 글쓰기 아이디어를 생성합니다</p>
            <div className="flex gap-2">
              <Textarea
                placeholder="아이디어 주제를 입력하세요 (예: 사랑, 여행, 미래)"
                value={ideaTheme}
                onChange={(e) => setIdeaTheme(e.target.value)}
                className="resize-none text-sm"
                rows={2}
              />
              <Button
                size="sm"
                onClick={handleGenerateIdeas}
                disabled={disabled || isLoading || !ideaTheme.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    생성 중...
                  </>
                ) : (
                  <>
                    <Lightbulb className="h-4 w-4 mr-2" />
                    생성
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {(generatedText || analysisResult) && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">
                {activeTab === 'analyze' ? '분석 결과' : '생성된 텍스트'}
              </h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setGeneratedText("");
                  setAnalysisResult("");
                }}
              >
                지우기
              </Button>
            </div>
            <div className="bg-muted rounded-md p-3 min-h-[100px] max-h-40 overflow-y-auto">
              {analysisResult || generatedText}
            </div>
            {generatedText && (
              <Button
                size="sm"
                onClick={applyGeneratedText}
                className="w-full"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                생성된 텍스트 적용
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIWritingAssistant;