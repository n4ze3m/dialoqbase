import { ApiIcon } from "../components/Icons/ApiIcon";
import { GithubIcon } from "../components/Icons/GithubIcon";
import { SpiderIcon } from "../components/Icons/SpiderIcon";
import { YoutubeIcon } from "../components/Icons/YoutubeIcon";

export const sources = {
  website: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="w-4 h-4"
      viewBox="0 0 24 24"
    >
      <path d="M21.54 15H17a2 2 0 00-2 2v4.54M7 3.34V5a3 3 0 003 3v0a2 2 0 012 2v0c0 1.1.9 2 2 2v0a2 2 0 002-2v0c0-1.1.9-2 2-2h3.17M11 21.95V18a2 2 0 00-2-2v0a2 2 0 01-2-2v-1a2 2 0 00-2-2H2.05"></path>
      <circle cx="12" cy="12" r="10"></circle>
    </svg>
  ),
  text: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="w-4 h-4"
      viewBox="0 0 24 24"
    >
      <path d="M17 6.1H3M21 12.1H3M15.1 18H3"></path>
    </svg>
  ),
  pdf: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
        className="w-4 h-4"
      viewBox="0 0 24 24"
    >
      <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"></path>
      <path d="M14 2L14 8 20 8"></path>
    </svg>
  ),
  docx: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
        className="w-4 h-4"
      viewBox="0 0 24 24"
    >
      <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"></path>
      <path d="M14 2L14 8 20 8"></path>
      <path d="M16 13L8 13"></path>
      <path d="M16 17L8 17"></path>
      <path d="M10 9L8 9"></path>
    </svg>
  ),
  csv: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="w-4 h-4"
      viewBox="0 0 24 24"
    >
      <path d="M12 3v18"></path>
      <rect width="18" height="18" x="3" y="3" rx="2"></rect>
      <path d="M3 9h18M3 15h18"></path>
    </svg>
  ),
  txt: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="w-4 h-4"
      viewBox="0 0 24 24"
    >
      <path d="M17 6.1H3M21 12.1H3M15.1 18H3"></path>
    </svg>
  ),
  crawl: <SpiderIcon className="h-4 w-4" />,
  github: <GithubIcon className="h-4 w-4" />,
  youtube: <YoutubeIcon className="h-4 w-4" />,
  mp3: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="w-4 h-4"
      viewBox="0 0 24 24"
    >
      <path d="M17.5 22h.5c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3"></path>
      <path d="M14 2L14 8 20 8"></path>
      <path d="M10 20v-1a2 2 0 114 0v1a2 2 0 11-4 0zM6 20v-1a2 2 0 10-4 0v1a2 2 0 104 0z"></path>
      <path d="M2 19v-3a6 6 0 0112 0v3"></path>
    </svg>
  ),
  mp4: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="w-4 h-4"
      viewBox="0 0 24 24"
    >
      <path d="M4 8V4a2 2 0 012-2h8.5L20 7.5V20a2 2 0 01-2 2H4"></path>
      <path d="M14 2L14 8 20 8"></path>
      <path d="M10 15.5l4 2.5v-6l-4 2.5"></path>
      <rect width="8" height="6" x="2" y="12" rx="1"></rect>
    </svg>
  ),
  rest: <ApiIcon className="h-4 w-4" />,
};
