export const getUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    const fullPath = window.location.href;
    const host = window.location.protocol + "//" + window.location.host;
    const url = fullPath.replace(host, import.meta.env.VITE_API_URL);
    return url;
  }
  const url = window.location.href;
  const urlWithoutQueryParams = url.split("?")[0];
  return urlWithoutQueryParams;
};
