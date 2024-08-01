# Creating a Tiny AI App Using Dialoqbase API

Learn how to create a custom AI chatbot application using the Dialoqbase API. This guide covers essential features including user-specific bot management, knowledge base creation, and interactive chat functionality.

## Key Features

1. **User-Specific Bot Management**: Create and manage dedicated chatbots for individual users.
2. **Bot Creation and Knowledge Integration**: Set up new bots and populate them with relevant information.
3. **Interactive Chat Interface**: Engage with the bot using the OpenAI SDK.

## Before You Begin

Ensure you have:

- Node.js (or your preferred programming language)
- Dialoqbase running locally or on a cloud server
- Dialoqbase API key (admin access recommended)

This tutorial uses Node.js with Dialoqbase running locally at `http://localhost:3000`. The example API key is `dq_xxxyyyzzz`.

## Step-by-Step Guide

### 1. Implement User-Specific Bot Management

Create a unique bot for each user, similar to Stripe's customer management system.

```javascript
const response = await fetch('http://localhost:3000/api/v1/admin/register-user', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dq_xxxyyyzzz'
    },
    body: JSON.stringify({
        email: 'darthvader@galacticempire.com',
        name: 'Darth Vader',
        password: 'password',
        return_id: true
    })
});

const userData = await response.json();
const userId = userData.user_id;
const userApiKey = userData.api_key;
```

Note: Set `return_id` to `true` to receive the `user_id` and `api_key`. Store these for future use.

### 2. Create a Bot and Add Knowledge

Now that we have a user, let's create their personalized bot and add information to it.

```javascript
const botResponse = await fetch('http://localhost:3000/api/v1/bot/api', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userApiKey}`
    },
    body: JSON.stringify({
        name: 'Darth Vader Bot',
        model: "claude-3-opus-20240229",
        embedding: "nomic-ai/nomic-embed-text-v1.5"
    })
});

const botData = await botResponse.json();
const botId = botData.id;

// Add knowledge to the bot
await fetch(`http://localhost:3000/api/v1/bot/${botId}/source/bulk`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userApiKey}`
    },
    body: JSON.stringify({
        data: [
            {
                "content": "https://n4ze3m.com",
                "type": "website"
            }
        ]
    })
});
```

This example uses the `claude-3-opus-20240229` model and `nomic-ai/nomic-embed-text-v1.5` embedding. Choose any model and embedding enabled in your Dialoqbase instance.

### 3. Interact with Your Bot

Install the OpenAI SDK:

```bash
npm install openai
```

Use the following code to chat with your bot:

```javascript
import { OpenAI } from "openai";

const dialoqbase = new OpenAI({
    apiKey: userApiKey,
    baseURL: "http://localhost:3000/api/v1/openai",
});

const chatResponse = await dialoqbase.chat.completions.create({
    model: botId,
    messages: [
        { role: "user", content: "Hello" },
    ],
    stream: true,
});

for await (const chunk of chatResponse) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '');
}
```

## Conclusion

Congratulations! You've successfully created a personalized AI chatbot application using the Dialoqbase API. This foundation allows you to:

1. Create user-specific bots
2. Add custom knowledge to each bot
3. Engage in interactive conversations