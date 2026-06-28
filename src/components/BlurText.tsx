import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  animateBy?: "words" | "characters";
  direction?: "top" | "bottom";
}

export default function BlurText({
  text,
  className = "",
  delay = 100,
  animateBy = "words",
  direction = "bottom",
}: BlurTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  const elements =
    animateBy === "words" ? text.split(" ") : text.split("");

  const yStart = direction === "bottom" ? 50 : -50;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: delay / 1000,
      },
    },
  };

  const itemVariants = {
    hidden: {
      filter: "blur(10px)",
      opacity: 0,
      y: yStart,
    },
    visible: {
      filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
      opacity: [0, 0.5, 1],
      y: [yStart, -5, 0],
      transition: {
        duration: 0.35,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.span
      ref={ref}
      className={`inline-flex flex-wrap ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {elements.map((element, index) => (
        <span
          key={index}
          className="inline-block overflow-hidden mr-[0.25em] py-0.5"
        >
          <motion.span className="inline-block" variants={itemVariants}>
            {element}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
