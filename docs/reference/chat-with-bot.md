# Chat With Bot


This guide will walk you through the process of chatting with a bot using Dialoqbase API.


:::code-group
```typescript [javascript with streams]
const chat = await dialoqbase.bot.chat(botId, {
    message: "Hello tell me a joke",
    stream: true,
    history: []
})

for await (const message of chat) {
    console.log(message);
}
```
```typescript [javascript without streams]
const chat = await dialoqbase.bot.chat(botId, {
    message: "Hello tell me a joke",
    stream: false,
    history: []
})

console.log(chat);
```
```sh [curl]
curl -X POST -H "Content-Type: application/json" -d '{"message": "Hello tell me a joke", "stream": false, "history": []}' http://localhost:3000/api/v1/bot/${botId}/chat
```
:::

### Supported Schema

- `message`: The message to be sent to the bot.
- `stream`: (Optional) If set to `true`, the chat will be streamed. If set to `false`, the chat will be returned as a single response.
- `history`: (Optional) The chat history.


### Response


- `bot`: The response from the bot.
    - `text`: The response text from the bot.
    - `sourceDocuments`: The source documents used by the bot to generate the response.
        - `pageContent`: The content of the page.
        - `metadata`: The metadata of the source document.
        - `source`: The source of the document.
        - `content`: The content of the source document.
- `history`: The chat history.