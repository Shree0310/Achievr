'use client'

import { useDroppable } from "@dnd-kit/core";

const DroppableColumn = ({ id, title, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div 
    // It is the node of the HTML element that we are turning into a droppable area
      ref={setNodeRef}
      data-column-id={id}
      className={`dark:bg-neutral-900 h-full rounded-lg overflow-hidden flex flex-col shadow 
        ${isOver ? 'ring-4 ring-primary-300 ring-opacity-70 bg-primary-300' : ''}`}
    >
      <div className={`py-3 text-center dark:text-neutral-300 text-neutral-700 text-base md:text-sm font-medium`}>
        {title}
      </div>
      {/* When we nest one component inside another component we use children, a prop */}
      <div className="overflow-y-auto p-2 flex-grow">
        <div className="space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DroppableColumn; 
