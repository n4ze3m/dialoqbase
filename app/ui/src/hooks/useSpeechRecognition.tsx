import { useRef, useEffect, useState, useCallback } from "react";

type SpeechRecognitionProps = {
  onEnd?: () => void;
  onResult?: (transcript: string) => void;
  onError?: (event: Event) => void;
};

type ListenArgs = {
  lang?: string;
  interimResults?: boolean;
  continuous?: boolean;
  maxAlternatives?: number;
  grammars?: any;
};

type SpeechRecognitionHook = {
  listen: (args?: ListenArgs) => void;
  listening: boolean;
  stop: () => void;
  supported: boolean;
  transcript: string;
};

const useEventCallback = <T extends (...args: any[]) => any>(
  fn: T,
  dependencies: any[]
) => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);

  return useCallback(
    (...args: Parameters<T>) => {
      const fn = ref.current;
      return fn!(...args);
    },
    [ref]
  );
};

export const useSpeechRecognition = (
  props: SpeechRecognitionProps = {}
): SpeechRecognitionHook => {
  const { onEnd = () => {}, onResult = () => {}, onError = () => {} } = props;
  const recognition = useRef<SpeechRecognition | null>(null);
  const [listening, setListening] = useState<boolean>(false);
  const [supported, setSupported] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    console.log("window.SpeechRecognition", window.SpeechRecognition);
    if (window.SpeechRecognition) {
      setSupported(true);
      recognition.current = new window.SpeechRecognition();
    }
  }, []);

  const processResult = (event: SpeechRecognitionEvent) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join("");

    onResult(transcript);
  };

  const handleError = (event: Event) => {
    if ((event as SpeechRecognitionErrorEvent).error === "not-allowed") {
      if (recognition.current) {
        recognition.current.onend = null;
      }
      setListening(false);
    }
    onError(event);
  };

  const listen = useEventCallback(
    (args: ListenArgs = {}) => {
      if (listening || !supported) return;
      const {
        lang = "",
        interimResults = true,
        continuous = false,
        maxAlternatives = 1,
        grammars,
      } = args;
      setListening(true);
      setLiveTranscript("");
      if (recognition.current) {
        recognition.current.lang = lang;
        recognition.current.interimResults = interimResults;
        recognition.current.onresult = (event) => {
          processResult(event);
          const transcript = Array.from(event.results)
            .map((result) => result[0])
            .map((result) => result.transcript)
            .join("");
          setLiveTranscript(transcript);
        };
        recognition.current.onerror = handleError;
        recognition.current.continuous = continuous;
        recognition.current.maxAlternatives = maxAlternatives;

        if (grammars) {
          recognition.current.grammars = grammars;
        }
        recognition.current.onend = () => {
          if (recognition.current) {
            recognition.current.start();
          }
        };
        if (recognition.current) {
          recognition.current.start();
        }
      }
    },
    [listening, supported, recognition]
  );

  const stop = useEventCallback(() => {
    if (!listening || !supported) return;
    if (recognition.current) {
      recognition.current.onresult = null;
      recognition.current.onend = null;
      recognition.current.onerror = null;
      setListening(false);
      recognition.current.stop();
    }
    onEnd();
  }, [listening, supported, recognition, onEnd]);

  return {
    listen,
    listening,
    stop,
    supported,
    transcript: liveTranscript,
  };
};
