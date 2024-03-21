# Adding text based source

Adding file based sources to a bot is a crucial aspect of enhancing its capabilities to fetch and provide relevant information to users. This guide will walk you through the process of adding a file-based source to a bot using Dialoqbase API.

:::code-group
```typescript [javascript]
const formData = new FormData();

formData.append("file", pdfFile, "test.pdf")
formData.append("file", errorFile, "test.html")

const { data, error } = await dialoqbase.bot.source.addFile(botId, formData)
```
```sh [curl]
curl -X POST -F "file=@/path/to/test.pdf" -F "file=@/path/to/test.html" http://localhost:3000/api/v1/bot/{botId}/source/upload/bulk
```
:::

### Supported Schema

- `file`: This field specifies the file to be uploaded. It could be a PDF, CSV, or any other relevant file format supported by dialoqbase.

