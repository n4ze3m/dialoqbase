import axios from "axios";

export const BASE_URL = "https://api.elevenlabs.io/v1";

type VerificationAttempt = {
  text: string;
  date_unix: number;
  accepted: boolean;
  similarity: number;
  levenshtein_distance: number;
  recording: {
    recording_id: string;
    mime_type: string;
    size_bytes: number;
    upload_date_unix: number;
    transcription: string;
  };
};

type ManualVerification = {
  extra_text: string;
  request_time_unix: number;
  files: {
    file_id: string;
    file_name: string;
    mime_type: string;
    size_bytes: number;
    upload_date_unix: number;
  }[];
};

type FineTuning = {
  language: string;
  is_allowed_to_fine_tune: boolean;
  fine_tuning_requested: boolean;
  finetuning_state: string;
  verification_attempts: VerificationAttempt[];
  verification_failures: string[];
  verification_attempts_count: number;
  slice_ids: string[];
  manual_verification: ManualVerification;
  manual_verification_requested: boolean;
};

type Labels = {
  [key: string]: string;
};

type Settings = {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
};

type Sharing = {
  status: string;
  history_item_sample_id: string;
  original_voice_id: string;
  public_owner_id: string;
  liked_by_count: number;
  cloned_by_count: number;
  whitelisted_emails: string[];
  name: string;
  labels: Labels;
  description: string;
  review_status: string;
  review_message: string;
  enabled_in_library: boolean;
};

type VoiceSample = {
  sample_id: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  hash: string;
};

export type Voice = {
  voice_id: string;
  name: string;
  samples: VoiceSample[];
  category: string;
  fine_tuning: FineTuning;
  labels: Labels;
  description: string;
  preview_url: string;
  available_for_tiers: string[];
  settings: Settings;
  sharing: Sharing;
  high_quality_base_model_ids: string[];
};

type VoiceData = {
  voices: Voice[];
};

export const isElevenLabAPIKeyValid = async (apiKey: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/user`, {
      headers: {
        "xi-api-key": apiKey,
      },
    });

    return response.status === 200;
  } catch (e) {
    return false;
  }
};

export const isElevenLabAPIKeyPresent = () => {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  return !!apiKey;
};

export const isElevenLabAPIValid = () => {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return false;
  }

  return isElevenLabAPIKeyValid(apiKey);
};

export const getVoices = async () => {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  const response = await axios.get(`${BASE_URL}/voices`, {
    headers: {
      "xi-api-key": apiKey,
    },
  });

  const data: VoiceData = response.data;

  return data.voices;
};

export const getElevenLab = async () => {
  let voices: Voice[] = [];
  const is11LabAPIVPresent = isElevenLabAPIKeyPresent();
  let is11LabAPIVValid = false;
  if (is11LabAPIVPresent) {
    is11LabAPIVValid = await isElevenLabAPIValid();
    if (is11LabAPIVValid) {
      voices = await getVoices();
    }
  }

  return {
    eleven_labs_api_key_present: is11LabAPIVPresent,
    eleven_labs_api_key_valid: is11LabAPIVValid,
    voices: voices,
  };
};

export const textToSpeech = async (text: string, voiceId: string) => {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  const response = await axios.post(
    `${BASE_URL}/text-to-speech/${voiceId}`,
    {
      text: text,
    },
    {
      headers: {
        "xi-api-key": apiKey,
      },
      responseType: "arraybuffer",
    },
  );

  return response.data;
};
