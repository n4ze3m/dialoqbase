export const availableEmbeddingTypes = [
  { value: "openai", label: "OpenAI" },
  { value: "tensorflow", label: "Tensorflow" },
  { value: "cohere", label: "Cohere" },
  { value: "huggingface-api", label: "HuggingFace (Inference)" },
  {
    value: "transformer",
    label: "all-MiniLM-L6-v2 (xenova/transformers)",
  },
  {
    value: "google-gecko",
    label: "Google text-gecko-001 (beta)",
  },
  // {
  //   value: "bert",
  //   label: "bert-base-uncased (xenova/transformers)",
  // },
];
