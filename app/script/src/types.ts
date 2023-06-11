export interface WidgetContainerStyle extends CSSStyleDeclaration {
  display: string;
  boxSizing: string;
  height: string;
  position: string;
  bottom: string;
  zIndex: string;
  width: string;
  transition: string;
  opacity: string;
  right: string;
}

export interface IframeStyle extends CSSStyleDeclaration {
  boxSizing: string;
  position: string;
  right: string;
  top: string;
  width: string;
  height: string;
  border: string;
  margin: string;
  padding: string;
  borderRadius: string;
  backgroundColor: string;
  borderWidth: string;
  boxShadow: string;
  transition: string;
  opacity: string;
}

export interface ButtonContainerStyle extends CSSStyleDeclaration {
  display: string;
  position: string;
  bottom: string;
  right: string;
  zIndex: string;
}

export interface ChatButtonStyle extends CSSStyleDeclaration {
  backgroundColor: string;
  color: string;
  width: string;
  height: string;
  borderRadius: string;
  borderWidth: string;
}

export interface WindowWithMatchMedia extends Window {
  matchMedia(query: string): MediaQueryList;
}
