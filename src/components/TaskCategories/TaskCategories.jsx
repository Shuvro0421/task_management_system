import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../AuthProvider/AuthProvider';
import useTitle from '../hooks/useTitle';

const TaskCategories = () => {
    useTitle('Task Categories');
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true); // New loading state
    const [currentPage, setCurrentPage] = useState(1); // State to track current page
    const tasksPerPage = 5; // Number of tasks to display per page
    const { user } = useContext(AuthContext);
    const email = user?.email;

    useEffect(() => {
        setLoading(true); // Set loading state to true before fetching tasks
        // Fetch tasks from '/tasks/email'
        axios.get(`http://localhost:5000/tasks/${email}`)
            .then(response => {
                setTasks(response.data);
                setLoading(false); // Set loading state to false after fetching tasks
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
                setLoading(false); // Set loading state to false if there's an error
            });
    }, [email]); // Include email in the dependency array

    const handleCategoryChange = (taskId, category) => {
        axios.post(`http://localhost:5000/tasks/${taskId}/category`, { category })
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
    const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='font-semibold mt-10'>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <h1 className='text-3xl font-semibold text-blue-400 my-5'>Task Categories</h1>
                    <div className='grid md:grid-cols-3 grid-cols-1 lg:grid-cols-4 gap-5'>
                        {currentTasks.map(task => (
                            <div className='p-5 rounded-lg shadow-2xl' key={task?._id}>
                                <h1 className='text-xl text-blue-400'>{task?.title}</h1>
                                <h1 className='h-28 overflow-auto'>{task?.description}</h1>
                                <div className='text-xs flex lg:items-center items-start gap-2 lg:flex-row flex-col justify-between my-2'>
                                    <h1><span className='text-blue-400 mr-1'>Due date:</span> {task?.dueDate}</h1>
                                    <h1><span className='text-blue-400 mr-1'>Priority:</span>
                                        {/* Apply conditional classes based on priority value */}
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
                    <ul className="pagination flex items-center justify-center gap-3 mt-10 my-5">
                        {Array.from({ length: Math.ceil(tasks.length / tasksPerPage) }).map((_, index) => (
                            <li key={index} className="page-item">
                                <button
                                    onClick={() => paginate(index + 1)}
                                    className={`page-link ${currentPage === index + 1 ? 'bg-blue-400 px-2 rounded-md  text-white font-semibold' : 'text-blue-400 active:scale-95 duration-150 ease-in-out transition-transform'}`} // Apply bg-blue-400 if the button corresponds to the current page
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
