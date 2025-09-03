"use client"
const SubtasksTab = ({ subTasks }) => {
    if (!subTasks || subTasks.length === 0) {
        return (
            <div className="p-3 text-center text-gray-500 dark:text-gray-400 text-sm">
            No subtasks available
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Title
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Description
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Priority
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Efforts
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {subTasks.map((subtask) => (
                        <tr key={subtask.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                {subtask.title || 'Untitled Subtask'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                                {subtask.description || '-'}
                            </td>
                            <td className="px-4 py-3 text-sm">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                                    ${subtask.status === 'completed' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' :
                                    subtask.status === 'in_progress' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400' :
                                    'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}>
                                    {subtask.status || 'not_started'}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                                {subtask.priority ? (
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                                        ${subtask.priority === '1' ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400' :
                                        subtask.priority === '2' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400' :
                                        'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'}`}>
                                        P{subtask.priority}
                                    </span>
                                ) : (
                                    <span className="text-gray-400 dark:text-gray-500">-</span>
                                )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                {subtask.efforts ? (
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{subtask.efforts} SP</span>
                                    </div>
                                ) : (
                                    <span className="text-gray-400 dark:text-gray-500">-</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SubtasksTab;