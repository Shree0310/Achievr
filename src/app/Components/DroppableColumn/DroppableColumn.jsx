'use client'

import { useDroppable } from "@dnd-kit/core";

const DroppableColumn = ({ id, title, children, }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div 
    // It is the node of the HTML element that we are turning into a droppable area
      ref={setNodeRef}
      data-column-id={id}
      className={`column-gradient h-full rounded-lg overflow-hidden flex flex-col shadow 
        ${isOver ? 'ring-4 ring-primary-300 ring-opacity-70 bg-primary-300' : ''}`}
    >
      <p className="py-3 text-center text-gray-800 text-base md:text-lg font-medium border-b border-gray-200">
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