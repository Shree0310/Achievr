 "use client"

const { useDraggable } = require("@dnd-kit/core");
const { CSS } = require("@dnd-kit/utilities");
const { transform } = require("typescript");

 const Task = ({ task, id})=>{
    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id: id,
        data: {
            task
        }
    });

    const style = transform? {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 999 : 1,
      } : undefined;

    return(
        <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className='bg-white rounded-lg shadow-md p-3 mb-2 cursor-move hover:shadow-md transition-shadow touch-manipulation'>
            <p className='text-gray-500 font-medium'>
                {task.title || 'Untitled Task'}
            </p>
            <p className='text-gray-600 text-sm'>
                {task.description || 'No Description'}
            </p>

        </div>
    )
 }
 export default Task;