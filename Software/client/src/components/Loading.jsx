// Component for displaying a loading indicator
const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      {' '}
      {/* Center content vertically */}
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>{' '}
      {/* Animated spinner */}
      <p>Loading...</p>
    </div>
  );
};

export default Loading;
