export const Cooking = () => {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex space-x-3 animate-bounce">
          <div className="w-3 h-3 bg-gray-900 rounded-full dark:bg-white"></div>
          <div className="w-3 h-3 bg-gray-900 rounded-full dark:bg-white"></div>
          <div className="w-3 h-3 bg-gray-900 rounded-full dark:bg-white"></div>
        </div>
        <p className="text-gray-900 dark:text-white">Bot is cooking...</p>
        <span className="text-gray-900 dark:text-white">It may take some time</span>
      </div>
    );
  };
  