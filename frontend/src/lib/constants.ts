export const PROVIDER_MODELS: Record<
  string,
  { decode: string[]; embedding: string[] }
> = {
  Google: {
    decode: [
      "gemini-3-flash-preview",
      "gemini-3-pro-image-preview",
      "gemini-2.5-pro",
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
    ],
    embedding: ["gemini-embedding-001"],
  },
  OpenAI: {
    decode: ["gpt-5-mini", "gpt-5-nano", "gpt-4o-mini", "gpt-4o"],
    embedding: [
      "text-embedding-3-small",
      "text-embedding-3-large",
      "text-embedding-ada-002",
    ],
  },
};

export const PROVIDERS = ["Google", "OpenAI"] as const;
