import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Crown, Users, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PricingPage = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "무료",
      price: "0",
      period: "무료",
      description: "기본 기능을 무료로 이용하세요",
      features: [
        "글 작성 (제한적)",
        "필사 작성",
        "일기 작성",
        "기본 글쓰기 지원",
        "비회원 모드 지원",
      ],
      limitations: [
        "글 저장 제한 (5개)",
        "출력 기능 제한",
        "고급 글쓰기 지원 불가",
      ],
      buttonText: "지금 시작하기",
      buttonVariant: "outline" as const,
    },
    {
      name: "회원",
      price: "9,900",
      period: "월",
      description: "모든 기능을 자유롭게 이용하세요",
      features: [
        "무제한 글 작성 및 저장",
        "무제한 필사 작성",
        "무제한 일기 작성",
        "진척관리 기능",
        "전체 출력 기능",
        "고급 글쓰기 지원",
        "시상 참여",
        "우선 고객 지원",
      ],
      limitations: [],
      buttonText: "회원가입하기",
      buttonVariant: "default" as const,
      popular: true,
    },
    {
      name: "프리미엄",
      price: "19,900",
      period: "월",
      description: "저작권 서비스 및 추가 혜택",
      features: [
        "회원 모든 기능",
        "저작권 보호 서비스",
        "글 중계 수수료 면제",
        "프리미엄 템플릿",
        "1:1 글쓰기 코칭 (월 1회)",
        "우선 시상 심사",
      ],
      limitations: [],
      buttonText: "프리미엄 시작하기",
      buttonVariant: "default" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">요금제</h1>
        <p className="text-muted-foreground mt-2">
          나에게 맞는 요금제를 선택하세요
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`relative ${plan.popular ? "border-primary border-2 shadow-lg" : ""}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                인기
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.price !== "0" && (
                  <span className="text-muted-foreground">원</span>
                )}
                <span className="text-muted-foreground">/{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
                {plan.limitations.map((limitation, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <X className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{limitation}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.buttonVariant}
                onClick={() => {
                  if (plan.name === "무료") {
                    navigate("/");
                  } else {
                    navigate("/register");
                  }
                }}
              >
                {plan.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-primary/5">
        <CardHeader>
          <CardTitle>저작권 서비스</CardTitle>
          <CardDescription>
            저작권이 유효한 글에 대한 특별 서비스
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">저작권 보호</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                작성한 글의 저작권을 보호하고 관리할 수 있습니다.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">글 중계 서비스</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                저작권이 있는 글을 출판사나 매체에 중계해드립니다.
                중계 수수료는 거래 금액의 10%입니다.
              </p>
            </div>
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              * 저작권 서비스는 프리미엄 회원만 이용 가능합니다.
            </p>
            <p className="text-sm text-muted-foreground">
              * 중계 수수료는 성공적인 거래가 완료된 경우에만 부과됩니다.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>자주 묻는 질문</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">비회원도 이용할 수 있나요?</h3>
            <p className="text-sm text-muted-foreground">
              네, 비회원으로도 기본 기능을 이용할 수 있습니다. 다만 글 저장 개수와 일부 기능에 제한이 있습니다.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">회원가입 후 언제든지 해지할 수 있나요?</h3>
            <p className="text-sm text-muted-foreground">
              네, 언제든지 회원탈퇴를 통해 서비스를 해지할 수 있습니다. 탈퇴 시 모든 데이터는 삭제됩니다.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">저작권 서비스는 어떻게 이용하나요?</h3>
            <p className="text-sm text-muted-foreground">
              프리미엄 회원이 되시면 저작권 보호 및 글 중계 서비스를 이용하실 수 있습니다.
              자세한 내용은 고객센터로 문의해주세요.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingPage;


