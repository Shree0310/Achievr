import Navbar from '@/app/Components/Navbar/Navbar';
import EditTask from '../../Components/EditTask/EditTask';
import {use} from "react";

export default function EditTaskPage ({params}: {params: Promise<{id: string}>}) {
    const resolveParams = use(params);
    return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <EditTask taskId={resolveParams.id}/>
            </div>
    )
}