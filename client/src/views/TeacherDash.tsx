import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TeacherDash() {
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data from the backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("http://localhost:4242/teacher/api/teacher/dashboard", {
          params: { teacherId: 1 }, // Replace with actual teacher ID from authentication
        });
        setDashboardData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch dashboard data.");
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
      <p>Welcome, Teacher Name</p>

      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Total Classes</h2>
          <p className="text-3xl">{dashboardData.totalClasses}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Attendance Rate</h2>
          <p className="text-3xl">{dashboardData.attendanceRate}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Absent Today</h2>
          <p className="text-3xl">{dashboardData.absentToday}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-4 mb-8">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Mark Attendance</button>
        <button className="bg-green-500 text-white px-4 py-2 rounded">View Reports</button>
      </div>

      {/* Assigned Classes */}
      <h2 className="text-xl font-bold mb-4">Assigned Classes</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Class Name</th>
            <th className="py-2 px-4 border-b">Students</th>
            <th className="py-2 px-4 border-b">Attendance Rate</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {dashboardData.assignedClasses.map((cls) => (
            <tr key={cls.id}>
              <td className="py-2 px-4 border-b">{cls.name}</td>
              <td className="py-2 px-4 border-b">{cls.student_count}</td>
              <td className="py-2 px-4 border-b">{cls.attendance_rate}%</td>
              <td className="py-2 px-4 border-b">
                <button className="bg-yellow-500 text-white px-2 py-1 rounded">Mark</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Recent Activity */}
      <h2 className="text-xl font-bold mt-6 mb-4">Recent Activity</h2>
      <ul>
        <li className="text-gray-700">Marked attendance for Grade 10A at 10:00 AM.</li>
        <li className="text-gray-700">Enrolled new student in Grade 10B.</li>
      </ul>
    </div>
  );
}
