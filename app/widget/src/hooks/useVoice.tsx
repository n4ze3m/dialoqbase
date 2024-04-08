import { useEffect, useRef, useState } from "react";
import { notification } from "antd";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { getUrl } from "../utils/getUrl";

type VoiceOptions = {
  id: string;
};

export const useVoice = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const onSubmit = async (values: { id: string }) => {
    const response = await axios.post(`${getUrl().split("?")[0]}/tts`, values, {
      responseType: "arraybuffer",
    });
    return response.data;
  };

  const { mutateAsync: generateAudio, isLoading } = useMutation(onSubmit);

  const speak = async (args: VoiceOptions) => {
    try {
      const data = await generateAudio({
        id: args.id,
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
