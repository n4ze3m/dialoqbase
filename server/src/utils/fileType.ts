export const fileTypeFinder = (mimeType: string) => {
  switch (mimeType) {
    case "application/pdf":
      return "pdf";
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "docx";
    case "text/csv":
      return "csv";
    case "text/plain":
      return "txt";
    case "video/mp4":
      return "mp4";
    case "audio/mpeg":
      return "mp3";
    case "audio/mp3":
      return "mp3";
    case "video/mpeg":
      return "mp4";
    case "application/zip":
      return "zip";
    case "application/x-zip-compressed":
      return "zip";
    case "application/json":
      return "json";
    default:
      return "none";
  }
};
