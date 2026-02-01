import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCurrentUser } from "@/lib/auth";
import { Transcription } from "@/lib/storage";
import { getTranscriptionsAsync, saveTranscriptionAsync } from "@/lib/storageHybrid";
import { gutenbergBooks, searchBooks, getBookById, getAllCategories, GutenbergBook } from "@/lib/gutenberg";
import { toast } from "@/hooks/use-toast";
import { Plus, BookOpen, X, Save, Search, Book, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const TranscriptionPage = () => {
  const user = getCurrentUser();
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [originalText, setOriginalText] = useState("");
  const [transcribedText, setTranscribedText] = useState("");
  const [reflection, setReflection] = useState("");
  const [selectedBook, setSelectedBook] = useState<GutenbergBook | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
  const [filteredBooks, setFilteredBooks] = useState<GutenbergBook[]>(gutenbergBooks);
  
  // 한 문장씩 필사 기능
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [transcribedSentences, setTranscribedSentences] = useState<string[]>([]);
  const [isSentenceMode, setIsSentenceMode] = useState(false);

  useEffect(() => {
    void loadTranscriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterBooks();
  }, [searchQuery, selectedCategory]);

  const loadTranscriptions = async () => {
    try {
      const userTranscriptions = await getTranscriptionsAsync(user?.id || null);
      setTranscriptions(userTranscriptions);
    } catch (err: any) {
      toast({
        title: "불러오기 실패",
        description: err?.message ?? "필사 목록을 불러오지 못했습니다.",
        variant: "destructive",
      });
    }
  };

  const filterBooks = () => {
    let books = searchQuery ? searchBooks(searchQuery) : gutenbergBooks;
    
    if (selectedCategory !== "all") {
      books = books.filter((book) => book.category === selectedCategory);
    }
    
    setFilteredBooks(books);
  };

  const handleNew = () => {
    setIsEditing(true);
    setOriginalText("");
    setTranscribedText("");
    setReflection("");
    setSelectedBook(null);
    setSentences([]);
    setTranscribedSentences([]);
    setCurrentSentenceIndex(0);
    setIsSentenceMode(false);
  };

  // 원문을 문장 단위로 분리하는 함수
  const splitIntoSentences = (text: string): string[] => {
    // 마침표, 물음표, 느낌표로 문장 분리 (공백 제거 후 필터링)
    const sentenceEndings = /[.!?。！？]\s*/g;
    const sentences = text
      .split(sentenceEndings)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    return sentences;
  };

  const handleSelectBook = (book: GutenbergBook) => {
    setSelectedBook(book);
    setOriginalText(book.text);
    const bookSentences = splitIntoSentences(book.text);
    setSentences(bookSentences);
    setTranscribedSentences(new Array(bookSentences.length).fill(""));
    setCurrentSentenceIndex(0);
    setIsSentenceMode(false);
    setIsBookDialogOpen(false);
    toast({
      title: "작품 선택 완료",
      description: `${book.title}이(가) 선택되었습니다.`,
    });
  };

  const handleToggleSentenceMode = () => {
    if (!originalText.trim()) {
      toast({
        title: "오류",
        description: "먼저 원문을 입력하거나 작품을 선택해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isSentenceMode) {
      // 문장 모드로 전환
      const newSentences = splitIntoSentences(originalText);
      setSentences(newSentences);
      setTranscribedSentences(new Array(newSentences.length).fill(""));
      setCurrentSentenceIndex(0);
    }
    setIsSentenceMode(!isSentenceMode);
  };

  const handleSentenceTranscribe = (sentence: string, index: number) => {
    const newTranscribed = [...transcribedSentences];
    newTranscribed[index] = sentence;
    setTranscribedSentences(newTranscribed);
    
    // 전체 필사 내용 업데이트
    const fullTranscribed = newTranscribed.join(" ");
    setTranscribedText(fullTranscribed);
  };

  const handleNextSentence = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1);
    }
  };

  const handlePrevSentence = () => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(currentSentenceIndex - 1);
    }
  };

  const handleLoadFromGutenberg = () => {
    setIsBookDialogOpen(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setOriginalText("");
    setTranscribedText("");
    setReflection("");
    setSelectedBook(null);
    setSentences([]);
    setTranscribedSentences([]);
    setCurrentSentenceIndex(0);
    setIsSentenceMode(false);
  };

  const handleSave = async () => {
    if (!originalText.trim() || !transcribedText.trim()) {
      toast({
        title: "오류",
        description: "원문과 필사 내용을 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      await saveTranscriptionAsync({
        userId: user?.id || null,
        originalText,
        transcribedText,
        reflection: reflection || "",
      });

      toast({
        title: "저장 완료",
        description: "필사가 저장되었습니다.",
      });

      await loadTranscriptions();
      handleCancel();
    } catch (err: any) {
      toast({
        title: "저장 실패",
        description: err?.message ?? "저장 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const categories = ["all", ...getAllCategories()];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">필사</h1>
          <p className="text-muted-foreground mt-2">
            Project Gutenberg Korea의 작품을 필사하고 감상을 작성하세요
          </p>
        </div>
        {!isEditing && (
          <Button onClick={handleNew}>
            <Plus className="mr-2 h-4 w-4" />
            새 필사
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>필사 작성</CardTitle>
                <CardDescription>원문을 필사하고 감상을 작성하세요</CardDescription>
              </div>
              <Dialog open={isBookDialogOpen} onOpenChange={setIsBookDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={handleLoadFromGutenberg}>
                    <Book className="mr-2 h-4 w-4" />
                    작품 선택
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Project Gutenberg Korea 작품 선택</DialogTitle>
                    <DialogDescription>
                      필사할 작품을 선택하세요
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          placeholder="작품 제목, 저자, 설명으로 검색..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="카테고리" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat === "all" ? "전체" : cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <ScrollArea className="h-[400px]">
                      <div className="grid gap-4 md:grid-cols-2">
                        {filteredBooks.length === 0 ? (
                          <div className="col-span-full text-center py-8 text-muted-foreground">
                            검색 결과가 없습니다.
                          </div>
                        ) : (
                          filteredBooks.map((book) => (
                            <Card
                              key={book.id}
                              className="cursor-pointer hover:bg-accent transition-colors"
                              onClick={() => handleSelectBook(book)}
                            >
                              <CardHeader>
                                <CardTitle className="text-lg">{book.title}</CardTitle>
                                <CardDescription>
                                  {book.author} • {book.category}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                  {book.description}
                                </p>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedBook && (
              <div className="bg-primary/5 p-4 rounded-lg">
                <p className="text-sm font-semibold">선택된 작품</p>
                <p className="text-sm text-muted-foreground">
                  {selectedBook.title} - {selectedBook.author}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="original">원문</Label>
                {originalText.trim() && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleToggleSentenceMode}
                  >
                    {isSentenceMode ? "전체 보기" : "한 문장씩 필사"}
                  </Button>
                )}
              </div>
              {isSentenceMode && sentences.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">
                        문장 {currentSentenceIndex + 1} / {sentences.length}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handlePrevSentence}
                          disabled={currentSentenceIndex === 0}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleNextSentence}
                          disabled={currentSentenceIndex === sentences.length - 1}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm font-sans mb-4 p-3 bg-background rounded border">
                      {sentences[currentSentenceIndex]}
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="sentence-transcribe">이 문장 필사하기</Label>
                      <Textarea
                        id="sentence-transcribe"
                        value={transcribedSentences[currentSentenceIndex] || ""}
                        onChange={(e) => handleSentenceTranscribe(e.target.value, currentSentenceIndex)}
                        placeholder="위 문장을 필사하세요"
                        rows={4}
                        className="font-sans text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transcribed">전체 필사 내용</Label>
                    <Textarea
                      id="transcribed"
                      value={transcribedText}
                      onChange={(e) => setTranscribedText(e.target.value)}
                      placeholder="필사한 내용이 자동으로 합쳐집니다"
                      rows={8}
                      className="font-sans text-sm"
                      readOnly
                    />
                    <p className="text-xs text-muted-foreground">
                      {transcribedText.length}자
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <Textarea
                    id="original"
                    value={originalText}
                    onChange={(e) => setOriginalText(e.target.value)}
                    placeholder="필사할 원문을 입력하거나 작품을 선택하세요"
                    rows={10}
                    className="font-sans text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    {originalText.length}자
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="transcribed">필사 내용</Label>
                    <Textarea
                      id="transcribed"
                      value={transcribedText}
                      onChange={(e) => setTranscribedText(e.target.value)}
                      placeholder="원문을 필사하세요"
                      rows={10}
                      className="font-sans text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      {transcribedText.length}자
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="reflection">감상</Label>
              <Textarea
                id="reflection"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="필사한 글에 대한 감상을 작성하세요"
                rows={6}
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
          {transcriptions.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">작성한 필사가 없습니다.</p>
                <Button onClick={handleNew}>
                  <Plus className="mr-2 h-4 w-4" />
                  첫 필사 시작하기
                </Button>
              </CardContent>
            </Card>
          ) : (
            transcriptions.map((transcription) => (
              <Card key={transcription.id}>
                <CardHeader>
                  <CardTitle className="text-lg">필사</CardTitle>
                  <CardDescription>
                    {new Date(transcription.createdAt).toLocaleDateString("ko-KR")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold">원문</Label>
                    <ScrollArea className="h-24 mt-1">
                      <p className="text-sm text-muted-foreground font-sans">
                        {transcription.originalText}
                      </p>
                    </ScrollArea>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">필사 내용</Label>
                    <ScrollArea className="h-24 mt-1">
                      <p className="text-sm text-muted-foreground font-sans">
                        {transcription.transcribedText}
                      </p>
                    </ScrollArea>
                  </div>
                  {transcription.reflection && (
                    <div>
                      <Label className="text-sm font-semibold">감상</Label>
                      <ScrollArea className="h-20 mt-1">
                        <p className="text-sm text-muted-foreground">
                          {transcription.reflection}
                        </p>
                      </ScrollArea>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TranscriptionPage;
