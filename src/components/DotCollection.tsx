import React from "react";
import { motion } from "framer-motion";

interface DotCollectionProps {
  completedSessions?: number;
  maxDotsPerRow?: number;
  dotSize?: number;
  dotSpacing?: number;
  dotColors?: string[];
  isDarkMode?: boolean;
}

const DotCollection = ({
  completedSessions = 0,
  maxDotsPerRow = 5,
  dotSize = 16,
  dotSpacing = 8,
  dotColors = ["#FF9F9F", "#FFD6A5", "#FFFEC4", "#CBFFA9", "#A0D2FF"],
  isDarkMode = false,
}: DotCollectionProps) => {
  // Calculate rows and columns based on completed sessions
  const rows = Math.ceil(completedSessions / maxDotsPerRow);

  // Create an array of dots based on completed sessions
  const dots = Array.from({ length: completedSessions }, (_, index) => {
    const row = Math.floor(index / maxDotsPerRow);
    const col = index % maxDotsPerRow;
    const colorIndex = index % dotColors.length;

    return {
      id: index,
      row,
      col,
      color: isDarkMode ? "#8A85FF" : dotColors[colorIndex],
    };
  });

  // Calculate container dimensions
  const containerWidth = maxDotsPerRow * (dotSize + dotSpacing) - dotSpacing;
  const containerHeight = rows * (dotSize + dotSpacing) - dotSpacing;

  return (
    <div
      className="flex items-center justify-center w-full bg-background rounded-lg p-4"
      style={{ minHeight: `${Math.max(60, containerHeight)}px` }}
    >
      <div
        className="relative"
        style={{
          width: `${containerWidth}px`,
          height: `${containerHeight}px`,
          minHeight: "40px",
        }}
      >
        {dots.map((dot) => (
          <motion.div
            key={dot.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: (0.1 * dot.id) % 0.5, // Staggered animation
            }}
            className="absolute rounded-full shadow-sm"
            style={{
              width: `${dotSize}px`,
              height: `${dotSize}px`,
              backgroundColor: dot.color,
              top: `${dot.row * (dotSize + dotSpacing)}px`,
              left: `${dot.col * (dotSize + dotSpacing)}px`,
              transition: "background-color 0.3s ease",
            }}
          />
        ))}

        {/* Empty state when no dots */}
        {completedSessions === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            <p>Complete sessions to collect dots</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DotCollection;
