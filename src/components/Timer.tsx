import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface TimerProps {
  onComplete?: () => void;
  initialMinutes?: number;
  isRunning: boolean;
  isPaused: boolean;
}

const Timer = ({ onComplete = () => {}, initialMinutes = 25, isRunning, isPaused }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const resetTimer = useCallback(() => {
    setTimeLeft(initialMinutes * 60);
  }, [initialMinutes]);

  useEffect(() => {
    let interval: number | undefined;

    if (isRunning) {
      interval = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
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
    </div>
  );
};

export default Timer;
