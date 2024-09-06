export interface OpenaiRequestType {
    Body: {
        messages: {
            role: "user" | "assistant";
            content: string;
        }[]
        model: string;
        stream: boolean;
        temperature: number;
        tools?: {
            type?: "knowledge_base",
            value?: string[]
        }[]
    }
}