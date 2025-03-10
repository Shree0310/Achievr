'use client'

import { useDroppable } from "@dnd-kit/core";
import CreateTaskButton from "../CreateTaskButton/CreateTaskButton";

const DroppableColumn = ({ id, title, children, }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div 
    // It is the node of the HTML element that we are turning into a droppable area
      ref={setNodeRef}
      data-column-id={id}
      className={`bg-[#C1C1C1] h-[400px] sm:h-[450px] md:h-[500px] lg:h-[calc(100vh-220px)] 
        rounded-lg overflow-hidden flex flex-col 
        ${isOver ? 'ring-4 ring-blue-500 ring-opacity-70 bg-blue-100 bg-opacity-20' : ''}`}
    >
      <p className="py-3 text-center text-gray-700 text-base md:text-lg font-medium border-b border-gray-300">
        {title}
      </p>
      {/* When we nest one component inside another component we use children, a prop */}
      <div className="overflow-y-auto p-2 flex-grow">
        {children}
      </div>
    </div>
  );
};

export default DroppableColumn; 