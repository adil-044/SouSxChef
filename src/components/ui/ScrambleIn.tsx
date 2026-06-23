"use client";
import { useEffect, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><";

export function ScrambleIn({ text, delay, triggered }: { text: string; delay: number; triggered: boolean }) {
  const [displayed, setDisplayed] = useState<string>("");
  
  useEffect(() => {
    if (!triggered) {
      setDisplayed("\u00A0"); // &nbsp;
      return;
    }
    
    let timeout: NodeJS.Timeout;
    timeout = setTimeout(() => {
      let frame = 0;
      const interval = setInterval(() => {
        const revealCount = Math.floor(frame * 0.5);
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
          } else if (i < revealCount + 3) {
            currentStr += CHARS[Math.floor(Math.random() * CHARS.length)];
          } else {
            currentStr += "";
          }
        }
        setDisplayed(currentStr);
        frame++;
      }, 25);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [triggered, delay, text]);

  return <span>{displayed === "" ? "\u00A0" : displayed}</span>;
}
