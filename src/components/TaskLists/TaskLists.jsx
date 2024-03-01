import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../AuthProvider/AuthProvider';
import useTitle from '../hooks/useTitle';

const TaskLists = () => {
    useTitle('Task Lists');
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTasks, setSelectedTasks] = useState([]); // State to store selected tasks
    const [currentPage, setCurrentPage] = useState(1); // State to track current page
    const tasksPerPage = 5; // Number of tasks to display per page
    const [successMessage, setSuccessMessage] = useState('');
    const { user } = useContext(AuthContext);
    const email = user?.email;

    useEffect(() => {
        // Fetch tasks from '/tasks/email'
        setLoading(true); // Set loading state to true before fetching tasks
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

    const handleTaskSelect = (taskId) => {
        setSelectedTasks(prevSelectedTasks => {
            if (prevSelectedTasks.includes(taskId)) {
                return prevSelectedTasks.filter(id => id !== taskId); // Deselect task if already selected
            } else {
                return [...prevSelectedTasks, taskId]; // Select task if not already selected
            }
        });
    };

    const handleCreateList = () => {
        // Extract full task information based on selected task IDs
        const selectedTasksInfo = tasks.filter(task => selectedTasks.includes(task._id));
        setSuccessMessage('');
        // Send POST request to create a new list with selected tasks
        axios.post('http://localhost:5000/lists', { tasks: selectedTasksInfo })
            .then(response => {
                console.log('List created successfully:', response.data);
                // Optionally, you can clear the selected tasks state after creating the list
                setSelectedTasks([]);
                setSuccessMessage('List created successfully!');
            })
            .catch(error => {
                console.error('Error creating list:', error);
            });
    };

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className='font-semibold mt-10'>
                    <h1 className='text-3xl font-semibold text-blue-400 my-5'>Task Lists</h1>
                    <div className='grid md:grid-cols-3 grid-cols-1 lg:grid-cols-4 gap-5'>
                        {currentTasks.map(task => (
                            <div
                                className={`p-5 rounded-lg cursor-pointer shadow-2xl ${selectedTasks.includes(task._id) ? 'bg-blue-100' : ''}`}
                                key={task._id}
                                onClick={() => handleTaskSelect(task._id)}
                            >
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
                                <h1 className='text-sm text-blue-400'>{task.category ? task.category : 'No category selected'}</h1>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleCreateList} className={`my-5  w-1/2 md:w-1/3 lg:w-1/4 transition-transform ease-in-out duration-150 active:scale-95 ${selectedTasks.length === 0 ? 'bg-gray-400' : 'bg-blue-400'} text-white py-2 rounded-lg m-auto px-1`} disabled={selectedTasks.length === 0}>Create List</button>
                    {successMessage && <p className="text-blue-400 text-left mb-4">{successMessage}</p>}
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
        </>

    );
};

export default TaskLists;
