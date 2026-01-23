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
      className={`dark:bg-neutral-900 h-full rounded-lg overflow-hidden flex flex-col shadow scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800
        ${isOver ? 'ring-4 ring-primary-300 ring-opacity-70 bg-primary-300' : ''}`}
    >
      <div className={`py-3 text-center dark:text-neutral-300 text-neutral-700 text-base md:text-sm font-medium`}>
        {title}
      </div>
      {/* When we nest one component inside another component we use children, a prop */}
      <div className="overflow-y-auto p-2 flex-grow scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-neutral-100 dark:scrollbar-thumb-neutral-600 dark:scrollbar-track-neutral-800">
        <div className="space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DroppableColumn; 
