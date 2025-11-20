import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";

const VISIT_COUNT_KEY = "bestwording_visit_count";

export const VisitCounter = () => {
  const [visitCount, setVisitCount] = useState<number>(0);

  useEffect(() => {
    // localStorage에서 방문 횟수 가져오기
    const storedCount = localStorage.getItem(VISIT_COUNT_KEY);
    const currentCount = storedCount ? parseInt(storedCount, 10) : 0;
    
    // 방문 횟수 증가
    const newCount = currentCount + 1;
    localStorage.setItem(VISIT_COUNT_KEY, newCount.toString());
    setVisitCount(newCount);
  }, []);

  // 숫자를 천 단위로 포맷팅
  const formatNumber = (num: number): string => {
    return num.toLocaleString("ko-KR");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5, duration: 0.8 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 dark:bg-background/90 backdrop-blur-md border border-border/50 shadow-lg"
    >
      <Eye className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm font-medium text-foreground">
        방문 <span className="text-primary font-semibold">{formatNumber(visitCount)}</span>회
      </span>
    </motion.div>
  );
};

