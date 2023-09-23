import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import { useStoreMessage } from "../store";
import { notification } from "antd";
import { useMutation } from "@tanstack/react-query";

type VoiceOptions = {
  text: string;
};

interface ElevenLabsTTSProps {
  speak: (args: VoiceOptions) => void;
  cancel: () => void;
  isPlaying: boolean;
  loading: boolean;
}

export const useElevenLabsTTS = (): ElevenLabsTTSProps => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { elevenLabsDefaultVoice } = useStoreMessage();
  const [isPlaying, setIsPlaying] = useState(false);

  const onSubmit = async (values: { text: string; voice_id: string }) => {
    const response = await api.post("/voice/11labs/tts", values, {
      responseType: "arraybuffer",
    });
    return response.data;
  };

  const { mutateAsync: generateAudio, isLoading } = useMutation(onSubmit);

  const speak = async (args: VoiceOptions) => {
    const { text } = args;

    try {
      const data = await generateAudio({
        text,
        voice_id: elevenLabsDefaultVoice,
      });

      const blob = new Blob([data], { type: "audio/mpeg" });
      const url = window.URL.createObjectURL(blob);
      audioRef.current = new Audio(url);

      audioRef.current.onended = () => {
        setIsPlaying(false);
      };

      audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.log(error);

      notification.error({
        message: "Error",
        description: "Something went wrong while trying to play the audio",
      });
    }
  };

  const cancel = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      cancel();
    };
  }, []);

  return {
    speak,
    cancel,
    isPlaying,
    loading: isLoading,
  };
};
