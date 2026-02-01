import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Home, 
  PenTool, 
  BookOpen, 
  Target, 
  Calendar, 
  Sparkles, 
  Download, 
  Trophy, 
  CreditCard,
  User,
  LogOut,
  Settings,
  Pen
} from "lucide-react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar-new";
import { SparklesCore } from "@/components/ui/sparkles";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: React.ReactNode;
}

const Logo = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-normal flex space-x-2 items-center text-sm text-black dark:text-white py-1 relative z-20"
    >
      <div className="relative flex-shrink-0">
        {/* Gradient background circle */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent rounded-lg blur-sm opacity-50" />
        {/* Icon container */}
        <div className="relative h-8 w-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg">
          <PenTool className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div>
        {/* Sparkle effect - 차분하게 */}
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-1 -right-1"
        >
          <Sparkles className="h-3 w-3 text-primary/60" fill="currentColor" />
        </motion.div>
      </div>
      <motion.span className="font-medium text-black dark:text-white whitespace-pre">
        Best Wording
      </motion.span>
    </motion.div>
  );
};

const LogoIcon = () => {
  return (
    <div className="font-normal flex space-x-2 items-center text-sm text-black dark:text-white py-1 relative z-20">
      <div className="relative flex-shrink-0">
        {/* Gradient background circle */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent rounded-lg blur-sm opacity-50" />
        {/* Icon container */}
        <div className="relative h-8 w-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg">
          <PenTool className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div>
        {/* Sparkle effect - 차분하게 */}
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-1 -right-1"
        >
          <Sparkles className="h-3 w-3 text-primary/60" fill="currentColor" />
        </motion.div>
      </div>
    </div>
  );
};

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut, isAdmin: isUserAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const navItems = [
    { href: "/", label: "홈", icon: <Home className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> },
    { href: "/writing", label: "글쓰기", icon: <PenTool className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> },
    { href: "/transcription", label: "필사", icon: <BookOpen className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> },
    { href: "/goals", label: "진척관리", icon: <Target className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> },
    { href: "/diary", label: "일기", icon: <Calendar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> },
    { href: "/support", label: "글쓰기지원", icon: <Sparkles className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> },
    { href: "/export", label: "출력", icon: <Download className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> },
    { href: "/awards", label: "시상", icon: <Trophy className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> },
    { href: "/pricing", label: "요금제", icon: <CreditCard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> },
  ];

  return (
    <div className="min-h-screen bg-background flex relative">
      {/* Sparkles Background - 차분한 배경 효과 */}
      <div className="fixed inset-0 w-full h-full z-0 opacity-30">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.3}
          maxSize={0.8}
          particleDensity={30}
          className="w-full h-full"
          particleColor="rgba(139, 120, 100, 0.4)"
          speed={0.3}
        />
      </div>

      {/* 사이드바는 관리자만 표시 */}
      {isUserAdmin && (
        <div className="relative z-10">
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              {sidebarOpen ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {navItems.map((item, idx) => (
                  <SidebarLink
                    key={idx}
                    link={item}
                    className={cn(
                      location.pathname === item.href && "bg-primary/10 text-primary"
                    )}
                  />
                ))}
              </div>
            </div>
            <div className="border-t pt-4">
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  {sidebarOpen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex-1 min-w-0"
                    >
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 truncate">
                        {user.user_metadata?.name || user.email}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                        {user.email}
                      </p>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/login")}
                  >
                    로그인
                  </Button>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => navigate("/register")}
                  >
                    회원가입
                  </Button>
                </div>
              )}
            </div>
          </SidebarBody>
        </Sidebar>
        </div>
      )}

      <div className={`flex flex-1 flex-col min-h-screen relative z-10 bg-background/95 dark:bg-background/95 backdrop-blur-sm ${!isUserAdmin ? 'ml-0' : ''}`}>
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            {/* 관리자가 아닌 경우 헤더에 로고와 네비게이션 메뉴 표시 */}
            {!isUserAdmin && (
              <div className="flex items-center space-x-4">
                <Link to="/" className="flex items-center space-x-2">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent rounded-lg blur-sm opacity-50" />
                    <div className="relative h-8 w-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg">
                      <PenTool className="h-4 w-4 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Best Wording
                  </span>
                </Link>
                <div className="hidden md:flex items-center space-x-2 ml-4">
                  {navItems
                    .filter((item) => {
                      if (!user) {
                        // 비회원은 글쓰기와 필사만 보이게
                        return item.href === "/writing" || item.href === "/transcription";
                      }
                      // 회원은 진척관리 제외하고 표시
                      return item.href !== "/goals";
                    })
                    .slice(0, 4)
                    .map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={`text-sm font-medium transition-colors hover:text-primary px-3 py-2 rounded-md ${
                          location.pathname === item.href
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:bg-accent"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                </div>
              </div>
            )}
            <div className="flex items-center space-x-4">
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hidden md:flex">
                      <User className="mr-2 h-4 w-4" />
                      {user.user_metadata?.name || user.email}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      프로필
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <Settings className="mr-2 h-4 w-4" />
                      설정
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      로그아웃
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            {!user && (
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/login")}
                >
                  로그인
                </Button>
                <Button size="sm" onClick={() => navigate("/register")}>
                  회원가입
                </Button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>

        <footer className="border-t py-6 px-4 md:px-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 Best Wording. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
