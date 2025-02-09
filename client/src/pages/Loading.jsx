export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <h2 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
          Welcome to ChahtraStay
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Finding you the best student accommodations with ease and comfort.
        </p>
      </div>
    </div>
  );
}