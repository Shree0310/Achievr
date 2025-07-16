"use client";

const Toast = () => {
  return (
    <>
      <div className="top-5 right-5 fixed z-30 flex-col gap-5">
        <div
          className={`bg-white border-l-green-700 border-l-4 rounded-lg p-4 shadow-lg
                         border-neutral-400 min-w-80 max-w-96 min-h-32 max-h-44 cursor-pointer relative`}>
          <div className="font-semibold text-lg">
            New comment added to task 001
          </div>
          <div className="font-light text-neutral-500 text-sm">
            Comment Title
          </div>
        </div>
      </div>
    </>
  );
};
export default Toast;
