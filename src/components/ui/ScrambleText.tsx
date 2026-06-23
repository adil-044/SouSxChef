"use client";
import { useEffect, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><";

export function ScrambleText({ text, isHovered, className }: { text: string; isHovered: boolean; className?: string }) {
  const [displayed, setDisplayed] = useState(text);

  useEffect(() => {
    if (!isHovered) {
      setDisplayed(text);
      return;
    }
    
    let frame = 0;
    const interval = setInterval(() => {
      const revealCount = Math.floor(frame / 4);
      if (revealCount >= text.length) {
        clearInterval(interval);
        setDisplayed(text);
        return;
      }
      
      let currentStr = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          currentStr += " ";
        } else if (i < revealCount) {
          currentStr += text[i];
        } else {
          currentStr += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setDisplayed(currentStr);
      frame++;
    }, 25);
    
    return () => clearInterval(interval);
  }, [isHovered, text]);

  return <span className={className}>{displayed}</span>;
}
