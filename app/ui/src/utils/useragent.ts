function _getOS(userAgent: string) {
  if (/Windows/.test(userAgent)) return "Windows";
  if (/Android/.test(userAgent)) return "Android";
  if (/iOS|iPhone|iPad|iPod/.test(userAgent)) return "iOS";
  if (/Mac/.test(userAgent)) return "macOS";
  if (/Linux/.test(userAgent)) return "Linux";
  if (/CrOS/.test(userAgent)) return "Chrome OS";
  return "Unknown";
}

function _getBrowser(userAgent: string) {
  if (/Firefox/.test(userAgent)) return "Firefox";
  if (/Chrome/.test(userAgent)) return "Chrome";
  if (/Safari/.test(userAgent)) return "Safari";
  if (/Edge/.test(userAgent)) return "Microsoft Edge";
  if (/MSIE|Trident/.test(userAgent)) return "Internet Explorer";
  return "Unknown";
}

export function getOSAndBrowser(userAgent: string) {
  const os = _getOS(userAgent);
  const browser = _getBrowser(userAgent);
  return `${os} - ${browser}`
}
