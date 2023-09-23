import { useEffect, useState } from "react";
import { useStoreMessage } from "../store";

interface SpeechSynthesisProps {
  onEnd?: () => void;
}

interface VoiceOptions {
  text: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

interface SpeechSynthesisState {
  supported: boolean;
  speak: (args?: VoiceOptions) => void;
  speaking: boolean;
  cancel: () => void;
  voices: SpeechSynthesisVoice[];
  pause: () => void;
}

export const useSpeechSynthesis = (
  props: SpeechSynthesisProps = {}
): SpeechSynthesisState => {
  const { onEnd = () => {} } = props;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [supported, setSupported] = useState<boolean>(false);
  const { defaultWebTextToSpeechLanguageWebAPI } = useStoreMessage();

  const processVoices = (voiceOptions: SpeechSynthesisVoice[]) => {
    setVoices(voiceOptions);
  };

  const getVoices = () => {
    let voiceOptions = window.speechSynthesis.getVoices();
    if (voiceOptions.length > 0) {
      processVoices(voiceOptions);
      return;
    }

    window.speechSynthesis.onvoiceschanged = (event) => {
      //@ts-ignore
      voiceOptions = event.target.getVoices();
      processVoices(voiceOptions);
    };
  };

  const handleEnd = () => {
    setSpeaking(false);
    onEnd();
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setSupported(true);
      getVoices();
    }
  }, []);

  const speak = (
    args: VoiceOptions = {
      text: "",
    }
  ) => {
    const { text = "", rate = 1, pitch = 1, volume = 1 } = args;
    const voice =
      voices.find(
        (voice) => voice.name === defaultWebTextToSpeechLanguageWebAPI
      ) || voices[0];
    if (!supported) return;
    setSpeaking(true);
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    utterance.voice = voice;
    utterance.onend = handleEnd;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    window.speechSynthesis.speak(utterance);
  };

  const cancel = () => {
    if (!supported) return;
    setSpeaking(false);
    window.speechSynthesis.cancel();
  };

  const pause = () => {
    if (!supported) return;
    window.speechSynthesis.pause();
  };

  return {
    supported,
    speak,
    speaking,
    cancel,
    voices,
    pause,
  };
};
