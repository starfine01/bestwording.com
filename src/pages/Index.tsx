import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { SparklesCore } from "@/components/ui/sparkles";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Target, Zap, CheckCircle2, PenTool, BookOpen, Trophy, FileText } from "lucide-react";
// (auth not used here yet)
import { VisitCounter } from "@/components/VisitCounter";

const Index = () => {
  const navigate = useNavigate();
  // (Auth state can be used here later for personalized CTA)

  const features = [
    {
      icon: PenTool,
      title: "글쓰기",
      description: "다양한 장르의 글을 작성하고 관리하세요",
      path: "/writing",
    },
    {
      icon: BookOpen,
      title: "필사",
      description: "좋은 글을 필사하고 감상을 작성하세요",
      path: "/transcription",
    },
    {
      icon: Target,
      title: "진척관리",
      description: "목표를 설정하고 진척 상황을 추적하세요",
      path: "/goals",
    },
    {
      icon: FileText,
      title: "일기",
      description: "하루하루를 기록하고 되돌아보세요",
      path: "/diary",
    },
    {
      icon: Sparkles,
      title: "글쓰기지원",
      description: "AI 기반 글쓰기 도구로 더 나은 글을 작성하세요",
      path: "/support",
    },
    {
      icon: Trophy,
      title: "시상",
      description: "우수한 글쓰기 활동을 인정받으세요",
      path: "/awards",
    },
  ];

  return (
    <>
      <VisitCounter />
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <AuroraBackground className="h-full">
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background pointer-events-none" />
          </AuroraBackground>
        </div>

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="flex flex-col items-center justify-center text-center space-y-8"
          >
            {/* Logo/Brand */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mb-8 -mt-12 md:-mt-16 lg:-mt-20"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-sm md:text-base text-muted-foreground mb-4 text-center italic"
              >
                (정식 서비스 전 테스트 중입니다. 하고 싶은 말씀은 '운영진에게 쓰기'에 남겨주세요.)
              </motion.p>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 dark:from-slate-100 dark:via-slate-300 dark:to-slate-100 drop-shadow-lg" style={{ lineHeight: '1.2', paddingBottom: '0.2em' }}>
                Best Wording
              </h1>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="space-y-4 max-w-4xl"
            >
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                <span className="text-primary">당신의 글쓰기 습관을</span>{" "}
                <span className="text-foreground">만들어 갑니다</span>
              </h2>
              <p className="text-xl md:text-2xl lg:text-3xl font-light text-muted-foreground mt-6">
                명문장 필사부터 나만의 격언 작성까지
              </p>
              <p className="text-lg md:text-xl text-muted-foreground/80 mt-4 max-w-2xl mx-auto">
                창작에 대한 지속적 동기와 함께 당신만의 글쓰기 여정을 시작하세요
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 mt-8"
            >
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90"
                onClick={() => navigate("/writing")}
              >
                글쓰기 시작하기
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 rounded-full border-2 hover:bg-accent/10 transition-all"
                onClick={() => navigate("/transcription")}
              >
                필사하기
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 rounded-full border-2 hover:bg-accent/10 transition-all"
                onClick={() => navigate("/admin-message")}
              >
                운영진에게 쓰기
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="mt-4"
            >
              <p className="text-sm md:text-base text-muted-foreground">
                운영진 메일: <span className="text-primary font-medium">starfine@naver.com</span>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-background relative border-t">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground">
              주요 기능
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              글쓰기를 더 쉽고 즐겁게 만들어주는 다양한 기능들
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card 
                  className="p-8 h-full hover:shadow-lg transition-all border-2 hover:border-primary/20 group cursor-pointer"
                  onClick={() => navigate(feature.path)}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-background via-primary/5 to-background border-t">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Best Wording과 함께 더 나은 글쓰기를 시작해보세요
          </p>
          <Button 
            size="lg" 
            className="text-lg px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all bg-primary hover:bg-primary/90"
            onClick={() => navigate("/writing")}
          >
            글쓰기 시작하기
          </Button>
        </motion.div>
      </section>

      <footer className="py-12 px-4 border-t border-border bg-background">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p className="text-sm">© 2025 Best Wording. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Index;
