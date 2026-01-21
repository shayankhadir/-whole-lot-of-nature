"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LensProps {
  children: React.ReactNode;
  zoomFactor?: number;
  lensSize?: number;
  position?: {
    x: number;
    y: number;
  };
  isStatic?: boolean;
  isFocusing?: () => void;
  hovering?: boolean;
  setHovering?: (hovering: boolean) => void;
  className?: string;
}

export const Lens: React.FC<LensProps> = ({
  children,
  zoomFactor = 1.5,
  lensSize = 170,
  isStatic = false,
  position = { x: 200, y: 150 },
  hovering,
  setHovering,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [localIsHovering, setLocalIsHovering] = useState(false);

  const isHovering = hovering !== undefined ? hovering : localIsHovering;
  const setIsHovering = setHovering || setLocalIsHovering;

  // const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 100, y: 100 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden rounded-lg z-20", className)}
      onMouseEnter={() => {
        setIsHovering(true);
      }}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      {children}

      {isStatic ? (
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.58 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 overflow-hidden lens-mask-static"
          >
            <div className="absolute inset-0 lens-content-static">
              {children}
            </div>
          </motion.div>
        </div>
      ) : (
        <AnimatePresence>
          {isHovering && (
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.58 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute inset-0 overflow-hidden lens-mask-hover"
              >
                <div className="absolute inset-0 lens-content-hover">
                  {children}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      )}
      <style jsx>{`
        .lens-mask-static {
          mask-image: radial-gradient(
            circle ${lensSize / 2}px at ${position.x}px ${position.y}px,
            black 100%,
            transparent 100%
          );
          -webkit-mask-image: radial-gradient(
            circle ${lensSize / 2}px at ${position.x}px ${position.y}px,
            black 100%,
            transparent 100%
          );
          transform-origin: ${position.x}px ${position.y}px;
        }
        .lens-content-static {
          transform: scale(${zoomFactor});
          transform-origin: ${position.x}px ${position.y}px;
        }
        .lens-mask-hover {
          mask-image: radial-gradient(
            circle ${lensSize / 2}px at ${mousePosition.x}px ${
        mousePosition.y
      }px,
            black 100%,
            transparent 100%
          );
          -webkit-mask-image: radial-gradient(
            circle ${lensSize / 2}px at ${mousePosition.x}px ${
        mousePosition.y
      }px,
            black 100%,
            transparent 100%
          );
          transform-origin: ${mousePosition.x}px ${mousePosition.y}px;
          z-index: 50;
        }
        .lens-content-hover {
          transform: scale(${zoomFactor});
          transform-origin: ${mousePosition.x}px ${mousePosition.y}px;
        }
      `}</style>
    </div>
  );
};
