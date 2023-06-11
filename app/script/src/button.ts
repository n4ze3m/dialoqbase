import { CLOSE_SVG, OPEN_SVG } from "./svg";
import { ButtonContainerStyle, ChatButtonStyle } from "./types";

export function createChatButton(
  scriptElement: HTMLScriptElement,
): void {
  let buttonContainer: HTMLDivElement = document.createElement("div");
  let buttonContainerStyle: ButtonContainerStyle = buttonContainer.style;
  buttonContainerStyle.display = "block";
  buttonContainerStyle.position = "fixed";

  const position = scriptElement.getAttribute("data-btn-position");

  if (position === "bottom-left") {
    buttonContainerStyle.bottom = "20px";
    buttonContainerStyle.left = "20px";
  } else if (position === "bottom-right") {
    buttonContainerStyle.bottom = "20px";
    buttonContainerStyle.right = "20px";
  } else if (position === "top-left") {
    buttonContainerStyle.top = "20px";
    buttonContainerStyle.left = "20px";
  } else if (position === "top-right") {
    buttonContainerStyle.top = "20px";
    buttonContainerStyle.right = "20px";
  } else {
    buttonContainerStyle.bottom = "20px";
    buttonContainerStyle.right = "20px";
  }

  buttonContainerStyle.zIndex = "999999";
  let chatButton: HTMLButtonElement = document.createElement("button");
  chatButton.setAttribute("id", "dialoq-btn");
  chatButton.innerHTML = OPEN_SVG;

  chatButton.onclick = function () {
    let widgetContainer: HTMLDivElement = document.querySelector(
      "#dialoq",
    ) as HTMLDivElement;
    if (widgetContainer) {
      if (widgetContainer.style.display === "none") {
        widgetContainer.style.display = "block";
        chatButton.innerHTML = CLOSE_SVG;
      } else {
        widgetContainer.style.display = "none";
        chatButton.innerHTML = OPEN_SVG;
      }
    } else {
      console.log("widgetContainer not found");
    }
  };

  let chatButtonStyle: ChatButtonStyle = chatButton.style;
  chatButtonStyle.backgroundColor = "#9b59b6";
  chatButtonStyle.color = "white";
  chatButtonStyle.width = "50px";
  chatButtonStyle.height = "50px";
  chatButtonStyle.borderRadius = "50%";
  chatButtonStyle.borderWidth = "0px";

  buttonContainer.appendChild(chatButton);
  document.body.appendChild(buttonContainer);
}
