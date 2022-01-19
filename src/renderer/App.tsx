import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import './App.css';

export const DEFAULT_SPEED = 10;
export const PUNCTUATION_SPEED = 6;

export function splitByNCharacters(text: string, n: number) {
  const words = text.split(/[\s]+/);
  const result = [];
  for (let i = 0; i < words.length; i++) {
    let start = 0;
    while (start < words[i].length) {
      result.push(words[i].slice(start, start + n));
      start += n;
    }
  }
  return result;
}

export function getCurrentInterval(currentWord: string, currentSpeed: number) {
  const includesPunctuation = currentWord?.match(/[@!.,?:;]/);

  if (includesPunctuation)
    return 1000 / Math.min(PUNCTUATION_SPEED, currentSpeed);

  return 1000 / currentSpeed;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState(
    splitByNCharacters('Hello, my name is Aidan. I am a software engineer.', 8)
  );
  const [currentSpeed, setCurrentSpeed] = useState(DEFAULT_SPEED);
  const [currentWord, setCurrentWord] = useState(0);

  const handleKeyDown = useCallback(
    async (e: any) => {
      if (e.key === ' ') {
        setIsPlaying(!isPlaying);
      }
      if (e.keyCode === 86 && e.metaKey) {
        const data = await navigator.clipboard.readText();
        setText(splitByNCharacters(data, 8));
      }
    },
    [isPlaying]
  );

  const handleStart = useCallback(() => {
    if (currentWord < text.length) {
      setCurrentWord(currentWord + 1)
    } else {
      setIsPlaying(false);
      setCurrentWord(0);
    }
  }, [currentWord, text]);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        handleStart();
      }, getCurrentInterval(text[currentWord], currentSpeed));
    }
    return () => clearInterval(interval);
  }, [currentSpeed, isPlaying, currentWord, handleStart, text]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  function handlePlay() {
    setIsPlaying(!isPlaying);
  }

  return (
    <>
      <div className="main">
        <div
          role="button"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onClick={handlePlay}
          className="text"
        >
          {text[currentWord]}
        </div>
        <motion.div
          className="background"
          key={undefined}
          initial={{ scale: 1.03 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.1 }}
        />
      </div>
      <div className="overlay" />
    </>
  );
}
