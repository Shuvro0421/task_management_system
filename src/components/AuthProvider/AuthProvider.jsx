import axios from "axios";
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import auth from "../../firebase.config";




export const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)


    const updateProfileInfo = (displayName = null, photoURL = null) => {
        return updateProfile(auth.currentUser, {
            displayName: displayName,
            photoURL: photoURL
        });
    }


    const createUser = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const signInUser = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, currentUser => {
            const userEmail = currentUser?.email || user?.email
            const loggedUser = { email: userEmail };
            setUser(currentUser)
            setLoading(false)
            // if user exist then issue a token
            if (currentUser) {

                axios.post('https://task-management-system-server-6a11.onrender.com/jwt', loggedUser, { withCredentials: true })
                    .then(res => {
                        console.log('token response', res.data);
                        // Handle token response here if needed
                    })
                    .catch(error => {
                        console.error('Error in axios request:', error);
                    });
            }
            else {
                axios.post('https://task-management-system-server-6a11.onrender.com/logout', loggedUser, {
                    withCredentials: true
                })
                    .then(res => {
                        console.log(res.data)
                    })
            }
        })
        return () => {
            unSubscribe()
        }
    }, [])

    const logOut = () => {
        setLoading(true)
        return signOut(auth)
    }
    const googleProvider = new GoogleAuthProvider()

    const handleGoogleSignIn = () => {
        signInWithPopup(auth, googleProvider)
            .then(result => {
                const loggedUser = result.user;
                setUser(loggedUser);
                setLoading(true);

                const userData = {
                    name: loggedUser.displayName,
                    email: loggedUser.email
                };

                axios.post('https://task-management-system-server-6a11.onrender.com/users', userData)
                    .then(res => {
                        console.log('User data stored successfully:', res.data);
                        setLoading(false);
                    })
                    .catch(error => {
                        console.error('Error storing user data:', error);
                        setLoading(false);
                    });
            })
            .catch(error => {
                console.error('Error signing in with Google:', error);
                setLoading(false);
            });
    }

    const authInfo = { createUser, signInUser, user, logOut, updateProfileInfo, handleGoogleSignIn, loading }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;