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
    const [priority, setPriority] = useState(''); // Initial state set to an empty string
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (priority === '') {
            setErrorMessage('Please select a priority.');
            return;
        }
        try {
            await axios.post('https://task-management-system-server-6a11.onrender.com/tasks', {
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
        <div className="w-full mx-auto  font-semibold p-6 mt-10 md:mt-0  rounded-lg shadow-2xl">
            <h1 className="text-3xl text-blue-400 mb-4">Create Task</h1>
            {successMessage && <p className="text-blue-400 mb-4">{successMessage}</p>}
            {errorMessage && <p className="text-red-700 mb-4">{errorMessage}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-blue-400 mb-1">Title</label>
                    <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-white text-blue-400 focus:outline-none border-b-blue-400 border-2 border-transparent ease-in-out " />
                </div>
                <div>
                    <label className="block text-blue-400 mb-1">Description</label>
                    <textarea value={description} required onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-white text-blue-400 focus:outline-none border-b-blue-400 border-2 border-transparent"></textarea>
                </div>
                <div>
                    <label className="block text-blue-400 mb-1">Due Date</label>
                    <input type="date" value={dueDate} required onChange={(e) => setDueDate(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-white text-blue-400 focus:outline-none border-b-blue-400 border-2 border-transparent" />
                </div>
                <div>
                    <label className="block text-blue-400 mb-1">Priority</label>
                    <select value={priority} required onChange={(e) => setPriority(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-white text-blue-400 focus:outline-none border-b-blue-400 border-2 border-transparent">
                        <option value="" disabled>Select Priority</option> {/* Disabled option */}
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <button type="submit" className="w-full bg-blue-400 text-white transition-transform ease-in-out duration-150 active:scale-95 py-2 rounded-lg ">Create Task</button>
            </form>
        </div>
    );
};

export default CreateTask;
