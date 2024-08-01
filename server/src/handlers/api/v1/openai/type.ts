export interface OpenaiRequestType {
    Body: {
        messages: {
            role: "user" | "assistant";
            content: string;
        }[]
        model: string;
        stream: boolean;
        temperature: number;
    }
}