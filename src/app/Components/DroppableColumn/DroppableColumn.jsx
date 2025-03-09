 'use client'

import { useDroppable } from "@dnd-kit/core";

const DroppableColumn = ({ id, title, tasks, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div 
      ref={setNodeRef}
      className={`bg-[#C1C1C1] h-[400px] sm:h-[450px] md:h-[500px] lg:h-[calc(100vh-220px)] rounded-lg overflow-hidden flex flex-col ${isOver ? 'ring-2 ring-blue-500 ring-opacity-70' : ''}`}
    >
      <p className="py-3 text-center text-gray-700 text-base md:text-lg font-medium border-b border-gray-300">
        {title}
      </p>
      <div className="overflow-y-auto p-2 flex-grow">
        {children}
      </div>
    </div>
  );
};

export default DroppableColumn;