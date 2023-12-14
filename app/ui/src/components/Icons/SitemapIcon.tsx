import React from "react";

export const SitemapIcon = React.forwardRef<
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
      ref={ref}
      viewBox="0 0 24 24"
      {...props}
    >
      <rect width="6" height="6" x="16" y="16" rx="1"></rect>
      <rect width="6" height="6" x="2" y="16" rx="1"></rect>
      <rect width="6" height="6" x="9" y="2" rx="1"></rect>
      <path d="M5 16v-3a1 1 0 011-1h12a1 1 0 011 1v3M12 12V8"></path>
    </svg>
  );
});
