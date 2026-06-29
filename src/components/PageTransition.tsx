import { motion } from "motion/react";
import React from "react";

const transitionVariants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.23, 1, 0.32, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.25,
      ease: [0.23, 1, 0.32, 1] as const,
    },
  },
};

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      variants={transitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full min-h-screen origin-top"
    >
      {children}
    </motion.div>
  );
}
