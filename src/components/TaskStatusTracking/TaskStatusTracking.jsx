import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../AuthProvider/AuthProvider';
import useTitle from '../hooks/useTitle';

const TaskStatusTracking = () => {
    useTitle('Task Status Tracking');
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const [userUserId, setUserUserId] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 5;
    const email = user?.email;

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:5000/assign-tasks`)
            .then(response => {
                setTasks(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
                setLoading(false);
            });
    }, [email]);

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:5000/users/${email}`)
            .then(response => {
                setUserUserId(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching user:', error);
                setLoading(false);
            });
    }, [email]);

    const id = userUserId[0]?._id;

    const filteredTasks = tasks.filter(task => task.userId === id);

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleStatusChange = (taskId, status) => {
        axios.post(`http://localhost:5000/assign-tasks/${taskId}`, { status })
            .then(response => {
                if (response.data.success) {
                    // Update the task status in the frontend
                    setTasks(tasks.map(task => task._id === taskId ? { ...task, status: status || null } : task));
                    console.log(response.data.message);
                } else {
                    console.error(response.data.message);
                }
            })
            .catch(error => {
                console.error('Error updating status:', error);
            });
    };



    return (
        <div className='font-semibold mt-10'>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <h1 className='text-3xl font-semibold text-blue-400 my-5'>Task Categories</h1>
                    {currentTasks.length === 0 ? (
                        <div className='text-blue-400 text-center'>No task assigned</div>
                    ) : (
                        <div>
                            <div className='grid md:grid-cols-3 grid-cols-1 lg:grid-cols-4 gap-5'>
                                {currentTasks.map(task => (
                                    <div className='p-5 rounded-lg shadow-2xl' key={task._id}>
                                        <h1 className='text-xl text-blue-400'>{task.title}</h1>
                                        <h1 className='h-28 overflow-auto'>{task.description}</h1>
                                        <div className='text-xs flex lg:items-center items-start gap-2 lg:flex-row flex-col justify-between my-2'>
                                            <h1><span className='text-blue-400 mr-1'>Due date:</span> {task.dueDate}</h1>
                                            <h1><span className='text-blue-400 mr-1'>Priority:</span>
                                                <span className={task.priority === 'low' ? 'text-green-400' : task.priority === 'medium' ? 'text-yellow-400' : 'text-red-400'}>
                                                    {task.priority}
                                                </span>
                                            </h1>
                                        </div>
                                        <div className='flex justify-between items-center'>
                                            <div>
                                                <h1 className='text-sm text-blue-400'>{task.category ? task.category : 'No category selected'}</h1>
                                            </div>
                                            <div>
                                                <select className='text-sm outline-none text-blue-400' onChange={(e) => handleStatusChange(task._id, e.target.value)}>
                                                    <option value="" disabled selected>{task?.status ? task.status : 'Select Status'}</option>
                                                    <option value="To-Do">To-Do</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Completed">Completed</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <ul className="pagination flex items-center justify-center gap-3 mt-10 my-5">
                                {Array.from({ length: Math.ceil(tasks.length / tasksPerPage) }).map((_, index) => (
                                    <li key={index} className="page-item">
                                        <button
                                            onClick={() => paginate(index + 1)}
                                            className={`page-link ${currentPage === index + 1 ? 'bg-blue-400 px-2 rounded-md  text-white font-semibold' : 'text-blue-400 active:scale-95 duration-150 ease-in-out transition-transform'}`}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TaskStatusTracking;
