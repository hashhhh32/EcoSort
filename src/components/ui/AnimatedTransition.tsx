
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedTransitionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 
    | "fade-in" 
    | "slide-up" 
    | "slide-down" 
    | "slide-left" 
    | "slide-right" 
    | "scale-up" 
    | "scale-down" 
    | "bounce-in";
  delay?: number;
  duration?: number;
  show?: boolean;
}

export const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({
  children,
  className,
  animation = "fade-in",
  delay = 0,
  duration = 300,
  show = true,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(show);
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay, show]);

  return (
    <div
      className={cn(
        "transition-all",
        visible ? `animate-${animation} opacity-100` : "opacity-0",
        className
      )}
      style={{ 
        animationDuration: `${duration}ms`, 
        animationDelay: `${delay}ms`,
        animationFillMode: "forwards" 
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedTransition;
