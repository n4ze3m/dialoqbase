export const removeTrailingSlash = (url: string): string => {
  if (url.endsWith("/")) {
    return url.slice(0, -1);
  }
  return url;
};
