"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Card = {
  title: string;
  src: string;
  description?: string;
  href?: string;
};

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: Card;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "relative h-60 md:h-96 w-full cursor-pointer overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(4,16,10,0.85)] shadow-[0_25px_60px_rgba(2,8,5,0.5)] transition-all duration-300 ease-out",
        hovered !== null && hovered !== index && "blur-sm scale-[0.98] opacity-60"
      )}
    >
      <Image
        src={card.src}
        alt={card.title}
        fill
        className="object-cover absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(2,10,6,0.95)] via-[rgba(2,10,6,0.65)] to-transparent" />
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-end py-8 px-5 transition-opacity duration-300",
          hovered === index ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="text-xl md:text-2xl font-semibold text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)] antialiased mb-2">
          {card.title}
        </div>
        {card.description && (
          <div className="text-sm text-white/90 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] antialiased">
            {card.description}
          </div>
        )}
      </div>
    </div>
  )
);

Card.displayName = "Card";

export function FocusCards({ cards }: { cards: Card[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto md:px-8 w-full">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}
