import { useState } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthProvider/AuthProvider";
import axios from 'axios'; // Import Axios
import useTitle from "../hooks/useTitle";

const Register = () => {
    useTitle('Register')
    const { createUser, updateProfileInfo } = useContext(AuthContext)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')

    const handleRegister = async (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const image = form.image.value;
        const email = form.email.value;
        const password = form.password.value;
        const user = { name, image, email, password };
        setError('');
        setSuccess('');

        try {
            // Validation checks for password
            if (password.length < 6) {
                setError('Password should be at least 6 characters');
                return;
            } else if (!/[A-Z]/.test(password)) {
                setError('Password should contain 1 uppercase letter');
                return;
            } else if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/"'`|]/.test(password)) {
                setError('Password should contain 1 special character');
                return;
            }

            // Create user
            const createUserResult = await createUser(email, password);
            console.log('registered successfully', createUserResult.user);
            setSuccess('registered successfully!');

            // Update user profile
            await updateProfileInfo(name, image);
            console.log('User profile updated successfully');

            // Post user data to /users using Axios
            await axios.post('https://task-management-system-server-psi.vercel.app', { name, email });

            form.reset();
        } catch (error) {
            console.error(error);
            user ? setError('User already exists') : setError(error.message || 'An error occurred');
        }
    };

    return (
        <div className="hero min-h-screen " style={{ backgroundImage: 'url(https://i.ibb.co/L5SPmVD/task-tracker-cover-1200x675.png)' }}>
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content text-center text-neutral-content">
                <div className="max-w-md">
                    <div className="hero ">
                        <div className="hero-content md:w-96 mt-14 flex-col lg:flex-row-reverse">
                            <div className="card flex-shrink-0 w-full text-black max-w-sm shadow-2xl bg-slate-900 bg-opacity-25 backdrop-blur-md">
                                <div>
                                    <h1 className='text-white text-xl font-semibold mt-5'>Task Management Sign up</h1>
                                </div>
                                <form onSubmit={handleRegister} className="card-body">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-white font-semibold">Name</span>
                                        </label>
                                        <input name="name" type="text" placeholder="name" className="input input-bordered" required />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-white font-semibold">Image</span>
                                        </label>
                                        <input name="image" type="text" placeholder="image url" className="input input-bordered" />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-white font-semibold">Email</span>
                                        </label>
                                        <input name="email" type="email" placeholder="email" className="input input-bordered" required />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-white font-semibold">Password</span>
                                        </label>
                                        <input name="password" type="password" placeholder="password" className="input input-bordered" required />
                                        <p className="text-blue-500 font-semibold mt-2">{success}</p>
                                        <p className="text-red-500 font-semibold mt-2">{error}</p>
                                        <label className="label">
                                            <p className="text-white">Back to <Link to={'/login'} className="text-blue-500 font-semibold">Login</Link></p>
                                        </label>
                                    </div>
                                    <div className="form-control mt-6">
                                        <input className="btn text-white bg-blue-500 hover:text-blue-500 hover:bg-white border-none  normal-case" type="submit" value="Register" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
