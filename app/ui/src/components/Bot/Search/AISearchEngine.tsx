import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { NoResult, SearchResult, SkeletonSearchResult } from "./SearchResult";
import { ISearchResult } from "./types";

type Props = {
  onSubmit: (query: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  data: ISearchResult;
};

export default function AISearchEngine({
  onSubmit,
  searchQuery,
  setSearchQuery,
  isLoading,
  data,
}: Props) {
  return (
    <div className="max-w-5xl mt-12 mx-auto p-4 min-h-screen">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(searchQuery);
        }}
        className="flex mb-8"
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter your search query..."
          className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 dark:bg-white text-white dark:text-indigo-600 rounded-r-lg hover:bg-indigo-700 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
        >
          <MagnifyingGlassIcon className="w-5 h-5" />
        </button>
      </form>

      <motion.div className="space-y-6">
        {isLoading && (
          <>
            <SkeletonSearchResult />
            <SkeletonSearchResult />
            <SkeletonSearchResult />
          </>
        )}
        {!isLoading && data.length === 0 && <NoResult />}
        {!isLoading &&
          data.length > 0 &&
          data.map((result, idx) => (
            <SearchResult
              key={idx}
              context={result?.result?.pageContent}
              source={result?.result?.source}
              icon={<MagnifyingGlassIcon className="size-4" />}
              score={+result?.score}
            />
          ))}
      </motion.div>
    </div>
  );
}
