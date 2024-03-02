import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../AuthProvider/AuthProvider';
import useTitle from '../hooks/useTitle';

const TaskLists = () => {
    useTitle('Task Lists');
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 5;
    const [successMessage, setSuccessMessage] = useState('');
    const { user } = useContext(AuthContext);
    const email = user?.email;

    // Filter states
    const [keyword, setKeyword] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('');
    const [category, setCategory] = useState('');

    // State to manage modal visibility and task data
    const [showModal, setShowModal] = useState(false);
    const [selectedTaskData, setSelectedTaskData] = useState(null);
    const [updatedTaskData, setUpdatedTaskData] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: '',
        category: ''
    });

    useEffect(() => {
        setLoading(true);
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
                return prevSelectedTasks.filter(id => id !== taskId);
            } else {
                return [...prevSelectedTasks, taskId];
            }
        });
    };

    const handleCreateList = () => {
        const selectedTasksInfo = tasks.filter(task => selectedTasks.includes(task._id));
        setSuccessMessage('');
        axios.post('http://localhost:5000/lists', { tasks: selectedTasksInfo })
            .then(response => {
                console.log('List created successfully:', response.data);
                setSelectedTasks([]);
                setSuccessMessage('List created successfully!');
            })
            .catch(error => {
                console.error('Error creating list:', error);
            });
    };
    const handleOpenModal = (task) => {
        setSelectedTaskData(task);
        setShowModal(true);
        // Set default values for the task in the modal
        setUpdatedTaskData({
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
            category: task.category
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTaskData(null);
        setUpdatedTaskData({
            title: '',
            description: '',
            dueDate: '',
            priority: '',
            category: ''
        });
    };

    const handleUpdateTaskDataChange = (e) => {
        const { name, value } = e.target;
        setUpdatedTaskData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleUpdateTask = () => {
        axios.put(`http://localhost:5000/tasks/${selectedTaskData._id}`, updatedTaskData)
            .then(response => {
                console.log('Task updated successfully:', response.data);
                // Update the task in the local state with the updated data
                setTasks(prevTasks => {
                    return prevTasks.map(task => {
                        if (task._id === selectedTaskData._id) {
                            return {
                                ...task,
                                ...updatedTaskData
                            };
                        }
                        return task;
                    });
                });
                handleCloseModal();
            })
            .catch(error => {
                console.error('Error updating task:', error);
            });
    };

    // Apply filters
    let filteredTasks = tasks.filter(task => {
        return (
            task.title.toLowerCase().includes(keyword.toLowerCase()) &&
            (dueDate ? task.dueDate === dueDate : true) &&
            (priority ? task.priority === priority : true) &&
            (category ? task.category === category : true)
        );
    });

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <div className='font-semibold mt-10 text-blue-400'>
                <h1 className='text-3xl font-semibold my-5'>Task Lists</h1>
                {/* Filter options */}
                <div className="mb-4 space-y-2">
                    <input type="text" placeholder="Search by keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="border outline-none border-blue-400 rounded-md p-2 mr-2" />
                    <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="border border-blue-400 rounded-md p-2 mr-2" />
                    <select value={priority} onChange={(e) => setPriority(e.target.value)} className="border outline-none border-blue-400 rounded-md p-2 mr-2">
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
                {/* Task list */}
                <div className='grid md:grid-cols-3 grid-cols-1 lg:grid-cols-4 gap-5'>
                    {currentTasks.length > 0 ? (
                        currentTasks.map(task => (
                            <div
                                className={`p-5 rounded-lg cursor-pointer shadow-2xl ${selectedTasks.includes(task._id) ? 'bg-blue-100' : ''}`}
                                key={task._id}
                                onClick={() => handleTaskSelect(task._id)}
                            >
                                <h1 className='text-xl'>{task.title}</h1>
                                <h1 className='h-28 overflow-auto text-gray-800'>{task.description}</h1>
                                <div className='text-xs flex lg:items-center items-start gap-2 lg:flex-row flex-col justify-between my-2'>
                                    <h1>Due date: <span className='text-gray-800'>{task.dueDate}</span></h1>
                                    <h1><span>Priority:</span>
                                        <span className={task.priority === 'low' ? 'text-green-400' : task.priority === 'medium' ? 'text-yellow-400' : 'text-red-400'}>
                                            {task.priority}
                                        </span>
                                    </h1>
                                </div>
                                <h1 className='text-sm'>{task.category ? task.category : 'No category selected'}</h1>
                                {/* Button to open modal */}
                                <button onClick={(e) => { e.stopPropagation(); handleOpenModal(task); }} className="mt-2 bg-blue-400 transition-transform ease-in-out duration-150 active:scale-95 text-white py-2 px-4 rounded-md">Edit Task</button>
                            </div>
                        ))
                    ) : (
                        <div>No matches found.</div>
                    )}
                </div>
                <button onClick={handleCreateList} className={`my-5  w-1/2 md:w-1/3 lg:w-1/4 transition-transform ease-in-out duration-150 active:scale-95 ${selectedTasks.length === 0 ? 'bg-gray-400' : 'bg-blue-400'} text-white py-2 rounded-lg m-auto px-1`} disabled={selectedTasks.length === 0}>Create List</button>
                {successMessage && <p className="text-left mb-4">{successMessage}</p>}
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
            {/* Modal for editing task */}
            {showModal && selectedTaskData && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg w-96">
                        <h2 className="text-lg font-semibold mb-4 text-blue-400">Edit Task</h2>
                        <button></button>
                        <div className="flex flex-col space-y-2">
                            <input type="text" name="title" value={updatedTaskData.title} onChange={handleUpdateTaskDataChange} placeholder="Title" className="border border-blue-400 outline-none text-blue-400 font-semibold rounded-md p-2" />
                            <textarea name="description" value={updatedTaskData.description} onChange={handleUpdateTaskDataChange} placeholder="Description" rows={4} className="border border-blue-400 outline-none text-blue-400 font-semibold rounded-md p-2" />
                            <input type="date" name="dueDate" value={updatedTaskData.dueDate} onChange={handleUpdateTaskDataChange} className="border border-blue-400 outline-none text-blue-400 font-semibold rounded-md p-2" />
                            <select name="priority" value={updatedTaskData.priority} onChange={handleUpdateTaskDataChange} className="border border-blue-400 outline-none text-blue-400 font-semibold rounded-md p-2">
                                <option value="">Select Priority</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                            <select name="category" value={updatedTaskData.category} onChange={handleUpdateTaskDataChange} className="border border-blue-400 outline-none text-blue-400 font-semibold rounded-md p-2">
                                <option value="">Select Category</option>
                                <option value="Category A">Category A</option>
                                <option value="Category B">Category B</option>
                                <option value="Category C">Category C</option>
                                <option value="Category D">Category D</option>
                            </select>
                            <div className="flex justify-end">
                                <button onClick={handleCloseModal} className="mr-2 bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-transform ease-in-out duration-150 active:scale-95">Cancel</button>
                                <button onClick={handleUpdateTask} className="bg-blue-400 text-white py-2 px-4 rounded-md transition-transform ease-in-out duration-150 active:scale-95">Update Task</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TaskLists;
