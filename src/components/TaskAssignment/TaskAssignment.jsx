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
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 5;
    const { user } = useContext(AuthContext);
    const email = user?.email;

    const [keyword, setKeyword] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('');
    const [category, setCategory] = useState('');

    

    useEffect(() => {
        axios.get(`http://localhost:5000/tasks`)
            .then(response => {
                setTasks(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
                setLoading(false);
            });

        axios.get('http://localhost:5000/users')
            .then(response => {
                const filteredUsers = response.data.filter(u => u.email !== email);
                setUsers(filteredUsers);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }, [email]);

    const filteredTasks = tasks.filter(task => {
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
        const selectedTaskDetails = tasks.filter(task => selectedTasks.includes(task._id));
        axios.post('http://localhost:5000/assign-tasks', {
            selectedTaskDetails: selectedTaskDetails,
            selectedUsers: selectedUsers,
            senderEmail: email
        })
            .then(response => {
                console.log('Tasks assigned successfully');
                setSuccessMessage('Tasks assigned successfully');
                setSelectedTasks([]);
                setSelectedUsers([]);
                setSelectAll(false);
            })
            .catch(error => {
                console.error('Error assigning tasks:', error);
            });
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='font-semibold mt-10 md:mt-0'>
            <h1 className='text-3xl font-semibold text-blue-400 my-5'>Task Assignment</h1>
            <div className="mb-4 space-y-2">
                <input type="text" placeholder="Search by keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="border outline-none border-blue-400  text-blue-400 rounded-md p-2 mr-2" />
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="border text-blue-400 border-blue-400 rounded-md p-2 mr-2" />
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="border outline-none  text-blue-400 border-blue-400 rounded-md p-2 mr-2">
                    <option value="">Select Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="border outline-none  text-blue-400 border-blue-400 rounded-md p-2 mr-2">
                    <option value="">Select Category</option>
                    <option value="Category A">Category A</option>
                    <option value="Category B">Category B</option>
                    <option value="Category C">Category C</option>
                    <option value="Category D">Category D</option>
                </select>
            </div>
            <div>
                <h3 className=''>Select users:</h3>
                <div className='flex gap-2'>
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
                        <div className='flex gap-2' key={user._id}>
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
                <div className='font-semibold mt-5'>
                    {currentTasks.length === 0 ? (
                        <div className='text-blue-400'>No match found.</div>
                    ) : (
                        <div className='grid md:grid-cols-3 grid-cols-1 lg:grid-cols-4 gap-5'>
                            {currentTasks.map(task => (
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
                    )}
                    <ul className="pagination flex items-center justify-center gap-3 mt-10">
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
            {successMessage && <div className="success-message text-blue-400 font-semibold">{successMessage}</div>}
            <button className='my-10 bg-blue-400 text-white py-2 px-1 rounded-lg transition-transform ease-in-out duration-150 active:scale-95' onClick={assignTasks}>Assign Tasks</button>
        </div>
    );
};

export default TaskAssignment;
