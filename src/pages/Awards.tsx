import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getAwards, Award } from "@/lib/storage";
import { Trophy, Medal, Award as AwardIcon, Crown } from "lucide-react";

const AwardsPage = () => {
  const [weeklyAwards, setWeeklyAwards] = useState<Award[]>([]);
  const [monthlyAwards, setMonthlyAwards] = useState<Award[]>([]);
  const [yearlyAwards, setYearlyAwards] = useState<Award[]>([]);
  const [hallOfFame, setHallOfFame] = useState<Award[]>([]);

  useEffect(() => {
    loadAwards();
  }, []);

  const loadAwards = () => {
    setWeeklyAwards(getAwards(undefined, "weekly"));
    setMonthlyAwards(getAwards(undefined, "monthly"));
    setYearlyAwards(getAwards(undefined, "yearly"));
    setHallOfFame(getAwards(undefined, "hall-of-fame"));
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />;
    return <AwardIcon className="h-6 w-6 text-muted-foreground" />;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-500">1위</Badge>;
    if (rank === 2) return <Badge className="bg-gray-400">2위</Badge>;
    if (rank === 3) return <Badge className="bg-amber-600">3위</Badge>;
    return <Badge variant="outline">{rank}위</Badge>;
  };

  const AwardList = ({ awards, period }: { awards: Award[]; period: string }) => {
    if (awards.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {period === "weekly" && "이번 주 수상자가 없습니다."}
              {period === "monthly" && "이번 달 수상자가 없습니다."}
              {period === "yearly" && "올해 수상자가 없습니다."}
              {period === "hall-of-fame" && "명예의 전당에 등록된 수상자가 없습니다."}
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {awards.map((award) => (
          <Card key={award.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getRankIcon(award.rank)}
                  <div>
                    <CardTitle className="text-lg">{award.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {award.description}
                    </CardDescription>
                  </div>
                </div>
                {getRankBadge(award.rank)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {new Date(award.createdAt).toLocaleDateString("ko-KR")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">시상</h1>
        <p className="text-muted-foreground mt-2">
          우수한 글쓰기 활동을 인정받은 회원들을 확인하세요
        </p>
      </div>

      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="weekly">주간</TabsTrigger>
          <TabsTrigger value="monthly">월간</TabsTrigger>
          <TabsTrigger value="yearly">연간</TabsTrigger>
          <TabsTrigger value="hall-of-fame">명예의 전당</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly" className="mt-6">
          <AwardList awards={weeklyAwards} period="weekly" />
        </TabsContent>
        <TabsContent value="monthly" className="mt-6">
          <AwardList awards={monthlyAwards} period="monthly" />
        </TabsContent>
        <TabsContent value="yearly" className="mt-6">
          <AwardList awards={yearlyAwards} period="yearly" />
        </TabsContent>
        <TabsContent value="hall-of-fame" className="mt-6">
          <AwardList awards={hallOfFame} period="hall-of-fame" />
        </TabsContent>
      </Tabs>

      <Card className="bg-primary/5">
        <CardHeader>
          <CardTitle>시상 기준</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• 주간: 일주일 동안 가장 많은 글을 작성한 회원</li>
            <li>• 월간: 한 달 동안 가장 우수한 글을 작성한 회원</li>
            <li>• 연간: 올해 가장 뛰어난 활동을 한 회원</li>
            <li>• 명예의 전당: 특별한 공헌을 한 회원</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AwardsPage;


