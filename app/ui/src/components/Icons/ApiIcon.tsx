import React from "react";

export const ApiIcon = React.forwardRef<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement>
>((props, ref) => {
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    ref={ref}
    {...props}
  >
    <path d="M2 12L7 2M7 12l5-10M12 12l5-10M17 12l5-10M4.5 7h15M12 16v6"></path>
  </svg>
  );
});
