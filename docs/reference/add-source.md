# Adding text based source

Adding sources to a bot is a crucial aspect of enhancing its capabilities to fetch and provide relevant information to users. This guide will walk you through the process of adding a text-based source to a bot using Dialoqbase API.


:::code-group
```typescript [javascript]
const bot = await dialoqbase.bot.source.add(botId, [
    {
        content: "https://n4ze3m.com",
        type: "website",
    },
    {
        content: "https://www.youtube.com/watch?v=BLmsVvcUxmY",
        type: "youtube",
        options: {
            youtube_mode: "transcript"
        }
    },
    {
        content: "Hello World!",
        type: "text",
    },
])
```
```sh [curl]
curl -X POST -H "Content-Type: application/json" -d '[
    {
        "content": "https://n4ze3m.com",
        "type": "website"
    },
    {
        "content": "https://www.youtube.com/watch?v=BLmsVvcUxmY",
        "type": "youtube",
        "options": {
            "youtube_mode": "transcript"
        }
    },
    {
        "content": "Hello World!",
        "type": "text"
    }
]' http://localhost:3000/api/v1/bot/{botId}/source/bulk
```
:::

### Supported Schema


- `content`: This field specifies the content of the source. It could be a URL, text, or any other relevant content.
- `type`: Describes the type of source being added. It can be one of the following:
  - "text": Plain text content.
  - "website": URL pointing to a website.
  - "crawl": Used for web crawling purposes.
  - "github": GitHub repository.
  - "youtube": YouTube video.
  - "rest": REST API endpoint.
  - "sitemap": URL pointing to a sitemap.
- `options`: Optional field, contains additional options specific to the type of source being added. For example, for a YouTube video, you can specify the `youtube_mode` as "transcript" to fetch the transcript of the video.