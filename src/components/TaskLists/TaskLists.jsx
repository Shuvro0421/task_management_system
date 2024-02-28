import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../AuthProvider/AuthProvider';
import useTitle from '../hooks/useTitle';

const TaskLists = () => {
    useTitle('Task Lists')
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTasks, setSelectedTasks] = useState([]); // State to store selected tasks
    const { user } = useContext(AuthContext);
    const [successMessage, setSuccessMessage] = useState('');
    const email = user?.email;

    useEffect(() => {
        // Fetch tasks from '/tasks/email'
        axios.get(`http://localhost:5000/tasks/${email}`)
            .then(response => {
                setTasks(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
                setLoading(false);
            });
    }, [email]);

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
        setSuccessMessage('')
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

    return (
        <>
            {
                loading ? (
                    <div>Loading...</div>
                ) :
                    (
                        <div className='font-semibold'>
                            <div className='grid md:grid-cols-3 grid-cols-1 lg:grid-cols-4 gap-5'>
                                {tasks.map(task => (
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
                                        <h1 className='text-sm'>{task.category ? task.category : 'No category selected'}</h1>
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleCreateList} className={`my-5  w-1/2 md:w-1/3 lg:w-1/4 transition-transform ease-in-out duration-150 active:scale-95 ${selectedTasks.length === 0 ? 'bg-gray-400' : 'bg-blue-400'} text-white py-2 rounded-lg m-auto px-1`} disabled={selectedTasks.length === 0}>Create List</button>
                            {successMessage && <p className="text-blue-400 text-left mb-4">{successMessage}</p>}
                        </div>
                    )
            }
        </>

    );
};

export default TaskLists;
