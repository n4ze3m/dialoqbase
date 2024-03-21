# Create Bot

This guide will walk you through the process of creating a bot using Dialoqbase API. 


::: code-group
```typescript [javascript]
const { data, error } = await dialoqbase.bot.create({
    name: "Test Bot 2",
    model: "claude-3-opus-20240229",
    embedding: "nomic-ai/nomic-embed-text-v1.5"
})
```
```sh [curl]
curl -X POST -H "Content-Type: application/json" -d '{
    "name": "Test Bot 2",
    "model": "claude-3-opus-20240229",
    "embedding": "nomic-ai/nomic-embed-text-v1.5"
}' "http://localhost:3000/api/v1/bot/api"
```
:::

### Supported Schema

- `name`: (Optional) The name of the bot.
- `embedding`: The embedding model to be used.
- `model`: The model for the bot.
- `system_prompt`: (Optional) Prompt for the system.
- `question_generator_prompt`: (Optional) Prompt for the question generator.
- `temperature`: (Optional) Temperature value.