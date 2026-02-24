"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function generateRandomNumber(max: number): number {
  return Math.floor(Math.random() * max) + 1;
}

export function AnimatedNumbers() {
  const [numbers, setNumbers] = useState<number[]>([]);

  useEffect(() => {
    setNumbers(Array.from({ length: 6 }, () => generateRandomNumber(60)));

    const interval = setInterval(() => {
      setNumbers(Array.from({ length: 6 }, () => generateRandomNumber(60)));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-3 justify-center">
      <AnimatePresence mode="popLayout">
        {numbers.map((num, i) => (
          <motion.div
            key={`${num}-${i}`}
            initial={{ scale: 0, rotateY: 180, opacity: 0 }}
            animate={{ scale: 1, rotateY: 0, opacity: 1 }}
            exit={{ scale: 0, rotateY: -180, opacity: 0 }}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
              type: "spring",
              stiffness: 200,
            }}
            className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-lg md:text-xl font-bold neon-glow bg-primary text-primary-foreground"
          >
            {num.toString().padStart(2, "0")}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
