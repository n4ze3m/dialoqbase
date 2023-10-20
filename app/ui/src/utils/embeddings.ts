export const availableEmbeddingTypes = [
  { value: "openai", label: "OpenAI" },
  { value: "tensorflow", label: "Tensorflow (cpu)" },
  { value: "cohere", label: "Cohere" },
  { value: "huggingface-api", label: "HuggingFace (Inference)" },
  {
    value: "transformer",
    label: "Xenova/all-MiniLM-L6-v2 (cpu)",
  },
  {
    value: "supabase",
    label: "Supabase/gte-small (cpu)",
  },
  {
    value: "google-gecko",
    label: "Google text-gecko-001 (beta)",
  },
];
