const Loader = ({ display }: { display: boolean }) => {
  let circleCommonClasses = "h-8 w-8 border-4 border-gray-800 rounded-full";

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen bg-gray-700/40 items-center justify-center z-50 cursor-default ${
        display ? "flex" : "hidden"
      }`}>
      <div className={`${circleCommonClasses} mr-1 animate-bounce`}></div>
      <div className={`${circleCommonClasses} mr-1 animate-bounce200`}></div>
      <div className={`${circleCommonClasses} animate-bounce400`}></div>
    </div>
  );
};

export default Loader;
