import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface SearchBoxProps {
  onSubmit: (query: string) => void;
  placeholder?: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function DefaultSearchBox({
  onSubmit,
  placeholder = "Find that TPS report, Bob's extension, or the elusive stapler...",
  searchQuery,
  setSearchQuery,
}: SearchBoxProps) {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(searchQuery);
  };

  return (
    <div className="h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-3xl px-4">
        <form onSubmit={handleSearch} className="relative">
          <textarea
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 pr-16 text-gray-900 border rounded-md outline-none dark:bg-[#1e1e1e] dark:border-gray-700 dark:text-gray-100 bg-white border-gray-300 transition-colors duration-300 resize-none ring-0"
            rows={3}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 size-10 bg-indigo-600 dark:bg-white text-white dark:text-indigo-600 rounded-full hover:bg-indigo-700 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-white focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105"
            aria-label="Search"
          >
            <MagnifyingGlassIcon className="size-5 mx-auto" />
          </button>{" "}
        </form>
      </div>
    </div>
  );
}
