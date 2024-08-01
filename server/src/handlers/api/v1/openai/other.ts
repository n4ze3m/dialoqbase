export function groupOpenAiMessages(
  messages: {
    role: "user" | "assistant";
    content: string;
  }[]
) {
  if (messages.length % 2 !== 0) {
    messages.pop();
  }

  const groupedMessages = [];
  for (let i = 0; i < messages.length; i += 2) {
    groupedMessages.push({
      [messages[i].role === "user" ? "human" : "ai"]: messages[i].content,
      [messages[i + 1].role === "user" ? "human" : "ai"]:
        messages[i + 1].content,
    });
  }

  return groupedMessages;
}
