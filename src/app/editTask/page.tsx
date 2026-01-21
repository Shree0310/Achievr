import EditTask from '../Components/EditTask/EditTask';
import Navbar from '../Components/Navbar/Navbar';

export default function EditTaskPage () {
    return (
        <div className="div">
            <Navbar></Navbar>
            <EditTask taskToEdit></EditTask>
        </div>
    )
}