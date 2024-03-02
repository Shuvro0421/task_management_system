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
    const [keyword, setKeyword] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');
    const email = user?.email;

    useEffect(() => {
        setLoading(true);
        axios.get(`https://task-management-system-server-6a11.onrender.com/assign-tasks`)
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
        axios.get(`https://task-management-system-server-6a11.onrender.com/users/${email}`)
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

    // Apply filters
    const filteredTasks = tasks.filter(task => {
        return (
            task.userId === id &&
            task.title.toLowerCase().includes(keyword.toLowerCase()) &&
            (dueDate ? task.dueDate === dueDate : true) &&
            (priority ? task.priority === priority : true) &&
            (category ? task.category === category : true) &&
            (status ? task.status === status : true)
        );
    });

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleStatusChange = (taskId, status) => {
        axios.post(`https://task-management-system-server-6a11.onrender.com/assign-tasks/${taskId}`, { status })
            .then(response => {
                if (response.data.success) {
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

    // Function to determine the color based on due date proximity
    const getDueDateColor = (dueDate) => {
        const today = new Date();
        const taskDueDate = new Date(dueDate);
        if (taskDueDate < today) {
            return 'text-gray-500'; // Past due date
        } else {
            const differenceInTime = taskDueDate.getTime() - today.getTime();
            const differenceInDays = differenceInTime / (1000 * 3600 * 24);
            return differenceInDays < 3 ? 'text-red-500' : ''; // Less than 3 days to due date
        }
    };

    return (
        <div className='font-semibold mt-10 text-blue-400'>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <h1 className='text-3xl font-semibold text-blue-400 my-5'>Task Status Tracking</h1>
                    <div className="mb-4 space-y-2">
                        <input type="text" placeholder="Search by title" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="border border-blue-400 outline-none rounded-md p-2 mr-2" />
                        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="border outline-none border-blue-400 rounded-md p-2 mr-2" />
                        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="border border-blue-400 outline-none rounded-md p-2 mr-2">
                            <option value="">Select Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border outline-none border-blue-400 rounded-md p-2 mr-2">
                            <option value="">Select Category</option>
                            <option value="Category A">Category A</option>
                            <option value="Category B">Category B</option>
                            <option value="Category C">Category C</option>
                            <option value="Category D">Category D</option>
                        </select>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border outline-none border-blue-400 rounded-md p-2 mr-2">
                            <option value="">Select Status</option>
                            <option value="To-Do">To-Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    {currentTasks.length === 0 ? (
                        <div className='text-blue-400 text-left'>No match found</div>
                    ) : (
                        <div>
                            <div className='grid md:grid-cols-3 grid-cols-1 lg:grid-cols-4 gap-5'>
                                {currentTasks.map(task => (
                                    <div className={`p-5 rounded-lg shadow-2xl ${getDueDateColor(task.dueDate)}`} key={task._id}>
                                        <h1 className='text-xl text-blue-400'>{task.title}</h1>
                                        <h1 className='h-28 overflow-auto text-gray-800'>{task.description}</h1>
                                        <div className='text-xs flex lg:items-center items-start gap-2 lg:flex-row flex-col justify-between my-2'>
                                            <h1>Due date: <span className='text-gray-800'>{task.dueDate}</span></h1>
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
                                {Array.from({ length: Math.ceil(filteredTasks.length / tasksPerPage) }).map((_, index) => (
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
