import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Timer from "./Timer";
import DotCollection from "./DotCollection";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Play, Pause, X } from "lucide-react";

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [completedSessions, setCompletedSessions] = useState<number[]>([]);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Load saved state from localStorage on component mount
  useEffect(() => {
    const savedSessions = localStorage.getItem("completedSessions");
    const savedTheme = localStorage.getItem("darkMode");

    if (savedSessions) {
      setCompletedSessions(JSON.parse(savedSessions));
    }

    if (savedTheme) {
      setIsDarkMode(savedTheme === "true");
    } else {
      // Check user's system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(
      "completedSessions",
      JSON.stringify(completedSessions),
    );
    localStorage.setItem("darkMode", String(isDarkMode));
  }, [completedSessions, isDarkMode]);

  const handleTimerComplete = () => {
    // Add a new session to the completed sessions
    const newSession = Date.now();
    setCompletedSessions([...completedSessions, newSession]);
    setIsTimerRunning(false);
    setIsPaused(false);
  };

  const handleTimerToggle = () => {
    if (isPaused) {
      setIsPaused(false);
      setIsTimerRunning(true);
    } else if (isTimerRunning) {
      setIsPaused(true);
      setIsTimerRunning(false);
    } else {
      setIsTimerRunning(true);
    }
  };

  const handleTimerReset = () => {
    setIsTimerRunning(false);
    setIsPaused(false);
  };

  const handleThemeChange = (theme: "light" | "dark") => {
    setIsDarkMode(theme === "dark");
  };

  // Get today's sessions only
  const getTodaySessions = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    return completedSessions.filter((timestamp) => timestamp >= todayTimestamp);
  };

  const todaySessions = getTodaySessions();

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-between px-4 py-8 transition-colors duration-300 ${isDarkMode ? "dark bg-background" : "bg-background"}`}
    >
      <div className="w-full flex justify-end">
        <ThemeToggle
          initialTheme={isDarkMode ? "dark" : "light"}
          onThemeChange={handleThemeChange}
        />
      </div>

      <motion.div
        className="w-full max-w-md flex flex-col items-center justify-center gap-12 my-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-light text-center">FocusDots</h1>

        <div className="w-full">
          <motion.div
            className="relative mx-auto"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Timer
              onComplete={handleTimerComplete}
              initialMinutes={25}
              isRunning={isTimerRunning}
              isPaused={isPaused}
            />
          </motion.div>

          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Button
              size="lg"
              className={`rounded-full px-8 py-6 text-lg font-medium shadow-md ${isTimerRunning ? "bg-destructive hover:bg-destructive/90" : isPaused ? "bg-primary hover:bg-primary/90" : "bg-primary hover:bg-primary/90"}`}
              onClick={handleTimerToggle}
            >
              {isTimerRunning ? (
                <>
                  <Pause className="mr-2 h-5 w-5" />
                  Pause Focus
                </>
              ) : isPaused ? (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Resume Focus
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Start Focus
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="w-full max-w-md mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="text-center mb-2 text-sm text-muted-foreground">
          {todaySessions.length > 0
            ? `${todaySessions.length} ${todaySessions.length === 1 ? "session" : "sessions"} today`
            : "No sessions completed today"}
        </div>
        <DotCollection
          completedSessions={todaySessions.length}
          isDarkMode={isDarkMode}
          maxDotsPerRow={7}
        />
      </motion.div>
    </div>
  );
};

export default Home;
