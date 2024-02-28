import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './components/Home/Home.jsx';
import Body from './components/Body/Body';
import ErrorPage from './components/ErrorPage/ErrorPage';
import AuthProvider from './components/AuthProvider/AuthProvider';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import CreateTask from './components/CreateTask/CreateTask';
import TaskCategories from './components/TaskCategories/TaskCategories';
import TaskLists from './components/TaskLists/TaskLists';




const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <Home />,
    children: [
      {
        path: "/",
        element: <PrivateRoute><Body /></PrivateRoute>,
        children:[
          {
            path:'/',
            element: <CreateTask></CreateTask>
          },
          {
            path:'/taskCategories',
            element: <TaskCategories></TaskCategories>
          },
          {
            path:'/taskLists',
            element: <TaskLists></TaskLists>
          },
        ]
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />
      },
    ]
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
)
