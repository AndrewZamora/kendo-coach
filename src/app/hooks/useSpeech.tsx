"use client";
import { useEffect, useRef } from "react";

function useSpeech() {
  const synth = useRef<SpeechSynthesis | null>(null);
  useEffect(() => {
    synth.current = window.speechSynthesis;
    return () => {
      if (synth.current) {
        synth.current.cancel();
      }
    };
  }, []);
  function speak(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    synth.current?.speak(utterance);
  }
  return { speak };
}

export default useSpeech;
