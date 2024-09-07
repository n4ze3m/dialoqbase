import { motion } from "framer-motion";
import { useState } from "react";

export interface SearchResultProps {
  context: string;
  source: string;
  icon: React.ReactNode;
  score: number;
}

export function SearchResult({
  context,
  source,
  icon,
  score,
}: SearchResultProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 300;

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const truncatedContext = isExpanded ? context : context.slice(0, maxLength);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-[#1e1e1e]"
    >
      <p className="text-gray-600 dark:text-gray-300 mb-3">
        {truncatedContext}
        {context.length > maxLength && (
          <>
            {!isExpanded && "..."}
            <button
              onClick={toggleReadMore}
              className="text-indigo-600 dark:text-indigo-400 ml-2 hover:underline focus:outline-none"
            >
              {isExpanded ? "Read less" : "Read more"}
            </button>
          </>
        )}
      </p>
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
        {icon}
        <span className="ml-2">{source}</span>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end bg-gray-50 dark:bg-[#2a2a2a] rounded-b-lg -mx-4 -mb-4 px-4 py-2">
        <span className="text-xs text-gray-600 dark:text-gray-300">
          Similarity: {`${score}%`}
        </span> 
      </div>
    </motion.div>
  );
}
export function SkeletonSearchResult() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-[#1e1e1e]"
    >
      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
      <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
      <div className="flex items-center">
        <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full mr-2"></div>
        <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </motion.div>
  );
}

export const NoResult = () => (
  <div className="text-center py-8">
    <p className="text-gray-600 dark:text-gray-400 text-lg">No results found</p>
    <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
      Try adjusting your search query
    </p>
  </div>
);
