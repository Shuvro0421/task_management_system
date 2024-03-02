import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../AuthProvider/AuthProvider';
import useTitle from '../hooks/useTitle';

const TaskCategories = () => {
    useTitle('Task Categories');
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 5;
    const { user } = useContext(AuthContext);
    const email = user?.email;

    // Filter states
    const [keyword, setKeyword] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        setLoading(true);
        axios.get(`https://task-management-system-server-6a11.onrender.com/tasks/${email}`)
            .then(response => {
                setTasks(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
                setLoading(false);
            });
    }, [email]);

    // Apply filters
    let filteredTasks = tasks.filter(task => {
        return (
            task.title.toLowerCase().includes(keyword.toLowerCase()) &&
            (dueDate ? task.dueDate === dueDate : true) &&
            (priority ? task.priority === priority : true) &&
            (category ? task.category === category : true)
        );
    });

    const handleCategoryChange = (taskId, category) => {
        axios.post(`https://task-management-system-server-6a11.onrender.com/tasks/${taskId}/category`, { category })
            .then(response => {
                // Update the tasks state or handle success
                console.log(response?.data);
            })
            .catch(error => {
                console.error('Error updating category:', error);
            });
    };

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='font-semibold mt-10 text-blue-400'>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    {/* Task list */}
                    <h1 className='text-3xl font-semibold text-blue-400 my-5'>Task Categories</h1>
                    {/* Filter options */}
                    <div className="mb-4 space-y-2">
                        <input type="text" placeholder="Search by keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="border border-blue-400 rounded-md  outline-none p-2 mr-2" />
                        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="border border-blue-400 rounded-md p-2 mr-2" />
                        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="border outline-none d border-blue-400 rounded-md p-2 mr-2">
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
                    </div>

                    {currentTasks.length > 0 ? (
                        <div className='grid md:grid-cols-3 grid-cols-1 lg:grid-cols-4 gap-5'>
                            {currentTasks.map(task => (
                                <div className='p-5 rounded-lg shadow-2xl' key={task?._id}>
                                    <h1 className='text-xl'>{task?.title}</h1>
                                    <h1 className='h-28 overflow-auto text-gray-800'>{task?.description}</h1>
                                    <div className='text-xs flex lg:items-center items-start gap-2 lg:flex-row flex-col justify-between my-2'>
                                        <h1>Due date: <span className='text-gray-800'>{task?.dueDate}</span></h1>
                                        <h1><span>Priority:</span>
                                            <span className={task.priority === 'low' ? 'text-green-400' : task.priority === 'medium' ? 'text-yellow-400' : 'text-red-400'}>
                                                {task?.priority}
                                            </span>
                                        </h1>
                                    </div>
                                    <select className='text-sm outline-none text-blue-400' onChange={(e) => handleCategoryChange(task._id, e.target.value)}>
                                        <option value="" disabled selected>{task?.category ? task.category : 'Select Category'}</option>
                                        <option value="Category A">Category A</option>
                                        <option value="Category B">Category B</option>
                                        <option value="Category C">Category C</option>
                                        <option value="Category D">Category D</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-blue-400">No matches found.</div>
                    )}
                    {/* Pagination */}
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
    );
};

export default TaskCategories;
