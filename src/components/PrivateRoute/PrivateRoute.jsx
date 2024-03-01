import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthProvider/AuthProvider";



const PrivateRoute = ({ children }) => {

    const { user, loading } = useContext(AuthContext)
    const location = useLocation()
    console.log(location.pathname)

    if (loading) {
        return <div className="flex items-center justify-center my-40">
            <img className="w-96" src="https://i.ibb.co/618PjDM/octo-loader-unscreen.gif" alt="" />
        </div>
    }
    if (user) {
        return children
    }

    return <Navigate state={location.pathname} to={'/login'}></Navigate>
};

export default PrivateRoute;