import EditTask from '../../Components/EditTask/EditTask';
import {use} from "react";

export default function EditTaskPage ({params}: {params: Promise<{id: string}>}) {
    const resolveParams = use(params);
    return (
        <EditTask taskId={resolveParams.id}/>
    )
}