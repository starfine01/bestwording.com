import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Target, Zap, CheckCircle2 } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Suggestions",
      description: "Get intelligent word choices that elevate your writing instantly",
    },
    {
      icon: Target,
      title: "Context-Aware",
      description: "Recommendations that understand your content's tone and purpose",
    },
    {
      icon: Zap,
      title: "Real-Time Analysis",
      description: "Instant feedback as you write, helping you make better decisions",
    },
  ];

  return (
    <>
      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col gap-6 items-center justify-center px-4 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Perfect Words, Every Time</span>
          </motion.div>

          <h1 className="text-4xl md:text-7xl font-bold dark:text-white text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Best Wording
          </h1>

          <p className="font-light text-lg md:text-2xl dark:text-neutral-200 text-muted-foreground py-4 text-center max-w-3xl">
            Transform your writing with intelligent word suggestions. Find the perfect phrase, every single time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all">
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 rounded-full border-2 hover:bg-primary/5 transition-all"
            >
              See How It Works
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex items-center gap-2 mt-8 text-sm text-muted-foreground"
          >
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span>No credit card required</span>
            <span className="mx-2">•</span>
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span>Free forever plan</span>
          </motion.div>
        </motion.div>
      </AuroraBackground>

      <section className="py-24 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
              Why Choose Best Wording?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you write with confidence and clarity
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 h-full hover:shadow-lg transition-all border-2 hover:border-primary/20 group">
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

      <section className="py-24 px-4 bg-gradient-to-b from-background to-primary/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
            Ready to Improve Your Writing?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of writers who trust Best Wording to find the perfect words for their content
          </p>
          <Button size="lg" className="text-lg px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all">
            Start Writing Better Today
          </Button>
        </motion.div>
      </section>

      <footer className="py-12 px-4 border-t border-border bg-background">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p className="text-sm">© 2024 Best Wording. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Index;
