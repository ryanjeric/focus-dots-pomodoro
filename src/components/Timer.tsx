import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface TimerProps {
  onComplete?: () => void;
  initialMinutes?: number;
}

const Timer = ({ onComplete = () => {}, initialMinutes = 25 }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const toggleTimer = useCallback(() => {
    if (!isRunning && !isPaused) {
      // Start timer
      setIsRunning(true);
    } else if (isRunning) {
      // Pause timer
      setIsRunning(false);
      setIsPaused(true);
    } else if (isPaused) {
      // Resume timer
      setIsRunning(true);
      setIsPaused(false);
    }
  }, [isRunning, isPaused]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(initialMinutes * 60);
  }, [initialMinutes]);

  useEffect(() => {
    let interval: number | undefined;

    if (isRunning) {
      interval = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            onComplete();
            return initialMinutes * 60;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, initialMinutes, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center bg-background w-full max-w-md mx-auto">
      <motion.div
        className="w-64 h-64 rounded-full bg-card shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        initial={{ scale: 1 }}
        animate={{
          scale: isRunning ? [1, 1.02, 1] : 1,
          boxShadow: isRunning
            ? [
                "0 4px 6px rgba(0,0,0,0.1)",
                "0 10px 15px rgba(0,0,0,0.2)",
                "0 4px 6px rgba(0,0,0,0.1)",
              ]
            : "0 4px 6px rgba(0,0,0,0.1)",
          transition: {
            duration: 1.5,
            repeat: isRunning ? Infinity : 0,
            repeatType: "reverse",
          },
        }}
      >
        <span className="text-6xl font-light select-none">
          {formatTime(timeLeft)}
        </span>
      </motion.div>

      <div className="mt-4 text-sm text-muted-foreground text-center">
        {isRunning
          ? "Focus session in progress"
          : isPaused
            ? "Session paused"
            : "Tap circle to start"}
      </div>
    </div>
  );
};

export default Timer;
