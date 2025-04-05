import React from "react";
import Root from "./views/Root";
import Home from "./views/Home";
import AdminLogin from "./views/AdminLogin";
import AdminDash from "./views/AdminDash";
import AdminUsers from "./views/AdminUsersPage";
import AdminClassesPage from "./views/AdminClassesPage";
import AdminAttendance from "./views/AdminAttendance";
import AdminReports from "./views/AdminReports";
import TeacherDash from "./views/TeacherDash";
import TeacherClasses from "./views/TeacherClasses";
import TeacherReport from "./views/TeacherReport";
import StudentDash from "./views/StudentDash";
import StudentProfile from "./views/StudentProfile";
import StudentAttendance from "./views/StudentAttendance";

import {createBrowserRouter, RouterProvider} from "react-router-dom";

const router = createBrowserRouter([
    {
        path : "/",
        element : <Root />,
        children : [
            {
                index : true,
                element : <Home />,
            },
            {
                path : "admin/login",
                element : <AdminLogin />,
            },{
                path : "admin/dash",
                element : <AdminDash />,
            },{
                path : "admin/users",
                element : <AdminUsers />,
            },{
                path:'admin/classes',
                element:<AdminClassesPage/>
            },{
                path:'admin/attendance',
                element:<AdminAttendance/>
            },{
                path:'/admin/reports',
                element:<AdminReports/>
            },{
                path:'teacher/dashboard',
                element:<TeacherDash/>,
            },{
                path:'teacher/classes',
                element:<TeacherClasses/>,
            },{
                path:'teacher/report',
                element:<TeacherReport/>,
            },{
                path:'student/dash',
                element:<StudentDash/>,
            },{
                path:'student/profile/:studentId',
                element:<StudentProfile/>,
            },{
                path:'student/attendance/:studentId',
                element:<StudentAttendance/>,
            }
        ],
    },
]);

export default function App() {
    return (<><RouterProvider router = {router} /></>);
}
