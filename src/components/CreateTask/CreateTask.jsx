import React, { useState } from 'react';
import axios from 'axios';
import useTitle from '../hooks/useTitle';
import { useContext } from 'react';
import { AuthContext } from '../AuthProvider/AuthProvider';

const CreateTask = () => {
    useTitle('Create Task');
    const { user } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/tasks', {
                title,
                description,
                dueDate,
                priority,
                displayName: user.displayName,
                email: user.email
            });
            setSuccessMessage('Task created successfully!');
            setErrorMessage('');
            setTitle('');
            setDescription('');
            setDueDate('');
            setPriority('');
        } catch (error) {
            console.error('Error creating task:', error);
            setSuccessMessage('');
            setErrorMessage('Failed to create task. Please try again.');
        }
    };

    return (
        <div className="w-full mx-auto  font-semibold p-6 bg-blue-400 rounded-lg shadow-md">
            <h1 className="text-3xl text-white mb-4">Create Task</h1>
            {successMessage && <p className="text-white mb-4">{successMessage}</p>}
            {errorMessage && <p className="text-red-700 mb-4">{errorMessage}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-white mb-1">Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-white text-blue-400 focus:outline-none focus:bg-gray-100" />
                </div>
                <div>
                    <label className="block text-white mb-1">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-white text-blue-400 focus:outline-none focus:bg-gray-100"></textarea>
                </div>
                <div>
                    <label className="block text-white mb-1">Due Date</label>
                    <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-white text-blue-400 focus:outline-none focus:bg-gray-100" />
                </div>
                <div>
                    <label className="block text-white mb-1">Priority</label>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-white text-blue-400 focus:outline-none focus:bg-gray-100">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <button type="submit" className="w-full bg-blue-300 transition-transform ease-in-out duration-150 active:scale-95 py-2 rounded-lg text-white">Create Task</button>
            </form>
        </div>
    );
};

export default CreateTask;
