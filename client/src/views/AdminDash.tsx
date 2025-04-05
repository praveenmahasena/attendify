import React, {useEffect, useState } from "react";
import axios from "axios";
import{
    LineChart, Line,     XAxis, YAxis,    CartesianGrid, Tooltip,
    Legend,    BarChart, Bar,   PieChart, Pie,           Cell,
} from "recharts";

export default function AdminDash() {
    const[overview, setOverview] = useState({});
    const[recentActivity, setRecentActivity] = useState([]);
    const[attendanceTrends, setAttendanceTrends] = useState([]);
    const[classPerformance, setClassPerformance] = useState([]);
    const[userRoles, setUserRoles] = useState([]);

    useEffect(
        () =>
    {
            // Fetch system overview
            axios.get("http://localhost:4242/admin/dashboard/overview",{withCredentials:true}).then((response) => {
                setOverview(response.data);
            }).catch(err=>{
                    console.log(err)
                });

            // Fetch recent activity
            axios.get("http://localhost:4242/admin/dashboard/activity",{withCredentials:true}).then((response) => {
                setRecentActivity(response.data);
            }).catch(err=>{
                    console.log(err)
                });

            // Fetch attendance trends
            axios.get("http://localhost:4242/admin/dashboard/attendance-trends",{withCredentials:true})
                .then((response) => { setAttendanceTrends(response.data); }).catch(err=>{
                    console.log(err)
                });

            // Fetch class performance
            axios.get("http://localhost:4242/admin/dashboard/class-performance",{withCredentials:true})
                .then((response) => { setClassPerformance(response.data); }).catch(err=>{
                    console.log(err)
                });

            // Fetch user roles distribution
            axios.get("http://localhost:4242/admin/dashboard/user-roles",{withCredentials:true}).then((response) => {
                setUserRoles(response.data);
            }).catch(err=>{
                    console.log(err)
                });
        },
        []);

     const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <div>
                    <span className="mr-4">Welcome, Admin</span>
                    <button className="bg-red-500 text-white px-4 py-2 rounded">
                        Logout
                    </button>
                </div>
            </div>

            {/* Overview Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold">Total Users</h2>
                    <p className="text-3xl">{overview.totalUsers}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold">Active Classes</h2>
                    <p className="text-3xl">{overview.activeClasses}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold">Attendance Rate</h2>
                    <p className="text-3xl">{overview.attendanceRate}%</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold">Absent Today</h2>
                    <p className="text-3xl">{overview.absentToday}</p>
                </div>
            </div>

            {/* Visualizations */}



      {/* Visualizations */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Attendance Trends</h2>
        <LineChart
          width={800}
          height={400}
          data={attendanceTrends}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="attendanceRate" stroke="#8884d8" />
        </LineChart>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Class Performance</h2>
        <BarChart
          width={800}
          height={400}
          data={classPerformance}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="className" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="attendanceRate" fill="#82ca9d" />
        </BarChart>
      </div>

            {/* Recent Activity */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                <ul>
                    {recentActivity.map((activity, index) => (
                        <li key={index} className="text-gray-700">
                            {activity.action} by {activity.user} at{" "}
                            {new Date(activity.timestamp).toLocaleString()}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Notifications */}
            <div>
                <h2 className="text-xl font-bold mb-4">Notifications</h2>
                <ul>
                    <li className="text-gray-700">5 students are absent today.</li>
                    <li className="text-gray-700">
                        Password reset requested by Teacher Jane.
                    </li>
                </ul>
            </div>
        </div>
    );
}
