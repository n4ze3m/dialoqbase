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
    default:
      return "none";
  }
};
