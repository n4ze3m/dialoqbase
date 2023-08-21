import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

export default function Markdown({ message }: { message: string }) {
  return (
    <ReactMarkdown
      className="markdown"
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              {...props}
              children={String(children).replace(/\n$/, "")}
              style={atomDark}
              language={match[1]}
              PreTag="div"
            />
          ) : (
            <code className={`${className} bg-gray-200 rounded-md p-1 text-sm`} {...props}>
              {children}
            </code>
          );
        },
        a({ node, ...props }) {
          return (
            <a
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 text-sm hover:underline"
              {...props}
            >
              {props.children}
            </a>
          );
        },
        li({ node, ...props }) {
          return (
            <li
              className="list-decimal text-sm marker:text-gray-500"
              {...props}
            >
              {props.children}
            </li>
          );
        },
        ul({ node, ...props }) {
          return (
            <ul className="mx-2 text-sm" {...props}>
              {props.children}
            </ul>
          );
        },
        ol({ node, ...props }) {
          return (
            <ul className="mx-2 text-sm" {...props}>
              {props.children}
            </ul>
          );
        },
        h1({ node, ...props }) {
          return (
            <h1 className="text-2xl font-bold" {...props}>
              {props.children}
            </h1>
          );
        },
        h2({ node, ...props }) {
          return (
            <h2 className="text-xl font-bold" {...props}>
              {props.children}
            </h2>
          );
        },
        h3({ node, ...props }) {
          return (
            <h3 className="text-lg font-bold" {...props}>
              {props.children}
            </h3>
          );
        },
        h4({ node, ...props }) {
          return (
            <h4 className="text-base font-bold" {...props}>
              {props.children}
            </h4>
          );
        },
        h5({ node, ...props }) {
          return (
            <h5 className="text-sm font-bold" {...props}>
              {props.children}
            </h5>
          );
        },
        h6({ node, ...props }) {
          return (
            <h6 className="text-xs font-bold" {...props}>
              {props.children}
            </h6>
          );
        },
        p({ node, ...props }) {
          return (
            <p className="text-sm" {...props}>
              {props.children}
            </p>
          );
        },
        table({ node, ...props }) {
          return (
            <table
              className="border-collapse border text-sm border-gray-300"
              {...props}
            >
              {props.children}
            </table>
          );
        },
        thead({ node, ...props }) {
          return (
            <thead className="bg-gray-100" {...props}>
              {props.children}
            </thead>
          );
        },
        tbody({ node, ...props }) {
          return (
            <tbody className="divide-y divide-gray-300" {...props}>
              {props.children}
            </tbody>
          );
        },
        tr({ node, ...props }) {
          return (
            <tr className="divide-x divide-gray-300" {...props}>
              {props.children}
            </tr>
          );
        },

        th({ node, ...props }) {
          return (
            <th className="p-2" {...props}>
              {props.children}
            </th>
          );
        },

        td({ node, ...props }) {
          return (
            <td className="p-2" {...props}>
              {props.children}
            </td>
          );
        },

        blockquote({ node, ...props }) {
          return (
            <blockquote className="border-l-4 border-gray-300 pl-2" {...props}>
              {props.children}
            </blockquote>
          );
        },
      }}
    >
      {message}
    </ReactMarkdown>
  );
}
