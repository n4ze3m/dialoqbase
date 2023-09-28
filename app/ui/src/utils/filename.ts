export function removeUUID(filename: string) {
  return filename.replace(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}-/, "");
}
