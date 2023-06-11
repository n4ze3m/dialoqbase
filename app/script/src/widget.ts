import {
  IframeStyle,
  WidgetContainerStyle,
  WindowWithMatchMedia,
} from "./types";

export function createChatWidget(
  scriptElement: HTMLScriptElement,
): void {
  let mediaQuery: MediaQueryList = (window as WindowWithMatchMedia)
    .matchMedia("(min-width: 768px)");
  let widgetContainer: HTMLDivElement = document.createElement("div");
  widgetContainer.setAttribute("id", "dialoq");
  let widgetContainerStyle: WidgetContainerStyle = widgetContainer.style;
  widgetContainerStyle.boxSizing = "border-box";
  widgetContainerStyle.height = "80vh";
  widgetContainerStyle.position = "fixed";
  widgetContainerStyle.display = "none";
  widgetContainerStyle.zIndex = "99999999";
  widgetContainerStyle.opacity = "0";
  widgetContainerStyle.transition = "opacity 0.3s ease-in-out";
  const position = scriptElement.getAttribute("data-btn-position");

  if (position === "bottom-left") {
    widgetContainerStyle.bottom = "80px";
    widgetContainerStyle.left = "20px";
  } else if (position === "bottom-right") {
    widgetContainerStyle.bottom = "80px";
    widgetContainerStyle.right = "20px";
  } else if (position === "top-left") {
    widgetContainerStyle.top = "80px";
    widgetContainerStyle.left = "20px";
  } else if (position === "top-right") {
    widgetContainerStyle.top = "80px";
    widgetContainerStyle.right = "20px";
  } else {
    widgetContainerStyle.bottom = "80px";
    widgetContainerStyle.right = "20px";
  }

  let iframe: HTMLIFrameElement = document.createElement("iframe");
  let iframeStyle: IframeStyle = iframe.style;
  iframeStyle.right = "0";
  iframeStyle.top = "0";
  iframeStyle.boxSizing = "border-box";
  iframeStyle.position = "absolute";
  iframeStyle.width = "100%";
  iframeStyle.height = "100%";
  iframeStyle.border = "1px solid #e5e5e5";
  iframeStyle.margin = "0";
  iframeStyle.padding = "0";
  iframeStyle.backgroundColor = "white";
  iframeStyle.borderWidth = "1px";
  iframeStyle.boxShadow =
    "rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px";

  iframeStyle.borderRadius = "8px";
  iframeStyle.opacity = "0";
  iframeStyle.transition = "opacity 0.3s ease-in-out";
  setTimeout(() => {
    widgetContainerStyle.opacity = "1";
    iframeStyle.opacity = "1";
  }, 100);
  if (mediaQuery.matches) {
    widgetContainerStyle.width = "400px";
  } else {
    widgetContainerStyle.width = "100%";
    widgetContainerStyle.height = "100%";
    iframeStyle.borderRadius = "0";
    iframeStyle.border = "0";
    if (position === "bottom-left") {
      widgetContainerStyle.bottom = "80px";
      widgetContainerStyle.left = "20px";
    } else if (position === "bottom-right") {
      widgetContainerStyle.bottom = "80px";
      widgetContainerStyle.right = "20px";
    } else if (position === "top-left") {
      widgetContainerStyle.top = "80px";
      widgetContainerStyle.left = "20px";
    } else if (position === "top-right") {
      widgetContainerStyle.top = "80px";
      widgetContainerStyle.right = "20px";
    } else {
      widgetContainerStyle.bottom = "80px";
      widgetContainerStyle.right = "20px";
    }
  }
  widgetContainer.appendChild(iframe);
  let chatbotUrl: string = scriptElement.getAttribute(
    "data-chat-url",
  ) as string;
  let iframeSource: string = `${chatbotUrl}?mode=iframe`;
  iframe.src = iframeSource;
  document.body.appendChild(widgetContainer);
}
