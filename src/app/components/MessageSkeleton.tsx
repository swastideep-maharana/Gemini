export default function MessageSkeleton() {
  return (
    <div className="flex justify-start">
      <div className="max-w-sm lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl rounded-bl-md bg-gray-100 dark:bg-gray-700 animate-pulse">
        <div className="space-y-2">
          <div className="bg-gray-300 dark:bg-gray-600 h-4 w-3/4 rounded"></div>
          <div className="bg-gray-300 dark:bg-gray-600 h-4 w-1/2 rounded"></div>
          <div className="bg-gray-300 dark:bg-gray-600 h-4 w-2/3 rounded"></div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="bg-gray-300 dark:bg-gray-600 h-3 w-12 rounded"></div>
        </div>
      </div>
    </div>
  );
}
