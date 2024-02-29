import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../AuthProvider/AuthProvider';
import useTitle from '../hooks/useTitle';

const TaskAssignment = () => {
    useTitle('Task Lists');
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [users, setUsers] = useState([]); // State to store users
    const [selectedUsers, setSelectedUsers] = useState([]); // State to store selected users
    const [selectAll, setSelectAll] = useState(false); // State to track Select All checkbox
    const [successMessage, setSuccessMessage] = useState('');
    const { user } = useContext(AuthContext);
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

        // Fetch users
        axios.get('http://localhost:5000/users')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
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

    const handleUserSelect = (userId) => {
        setSelectedUsers(prevSelectedUsers => {
            if (prevSelectedUsers.includes(userId)) {
                return prevSelectedUsers.filter(id => id !== userId);
            } else {
                return [...prevSelectedUsers, userId];
            }
        });
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map(user => user._id));
        }
        setSelectAll(prev => !prev);
    };

    const assignTasks = () => {
        // Gather details of selected tasks
        const selectedTaskDetails = tasks.filter(task => selectedTasks.includes(task._id));
    
        // Make a POST request to the server
        axios.post('http://localhost:5000/assign-tasks', {
            selectedTaskDetails: selectedTaskDetails,
            selectedUsers: selectedUsers,
            senderEmail: user.email
        })
        .then(response => {
            console.log('Tasks assigned successfully');
            setSuccessMessage('Tasks assigned successfully');
            // Optionally, you can reset selectedTasks and selectedUsers state
            setSelectedTasks([]);
            setSelectedUsers([]);
            setSelectAll(false); // Reset Select All checkbox
        })
        .catch(error => {
            console.error('Error assigning tasks:', error);
        });
    };
    return (
        <div className='font-semibold'>
            {successMessage && <div className="success-message text-blue-400 font-semibold">{successMessage}</div>}
            <div>
                <h3 className=''>Select users:</h3>
                <div>
                    <input
                        type="checkbox"
                        id="select-all"
                        checked={selectAll}
                        onChange={toggleSelectAll}
                    />
                    <label htmlFor="select-all">Select All</label>
                </div>
                <div className='h-20 custom-scrollbar overflow-auto'>
                    {users.map(user => (
                        <div key={user._id}>
                            <input
                                type="checkbox"
                                id={`user-${user._id}`}
                                value={user.id}
                                checked={selectedUsers.includes(user._id)}
                                onChange={() => handleUserSelect(user._id)}
                            />
                            <label htmlFor={`user-${user._id}`}>{user.name}</label>
                        </div>
                    ))}
                </div>
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className='font-semibold mt-10'>
                    <div className='grid md:grid-cols-3 grid-cols-1 lg:grid-cols-4 gap-5'>
                        {tasks.map(task => (
                            <div
                                key={task._id}
                                className={`p-5 rounded-lg cursor-pointer shadow-2xl ${selectedTasks.includes(task._id) ? 'bg-blue-100' : ''}`}
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
                </div>
            )}
            <button className='my-10 bg-blue-400 text-white py-2 px-1 rounded-lg transition-transform ease-in-out duration-150 active:scale-95' onClick={assignTasks}>Assign Tasks</button>
        </div>
    );
};

export default TaskAssignment;
