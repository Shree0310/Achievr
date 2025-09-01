import { diffWords } from 'diff';

const DiffChecker = ({ oldText, newText }) => {
  const differences = diffWords(oldText, newText);
  
  return (
    <div className="font-mono text-sm">
      {differences.map((part, index) => (
        <span
          key={index}
          className={`
            ${part.added ? 'bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100' : ''}
            ${part.removed ? 'bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100 line-through' : ''}
            ${!part.added && !part.removed ? 'text-gray-700 dark:text-gray-300' : ''}
          `}
        >
          {part.value}
        </span>
      ))}
    </div>
  );
};

export default DiffChecker;