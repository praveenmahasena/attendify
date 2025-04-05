import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StudentDash() {
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data from the backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("http://localhost:4242/student/api/student/dashboard", {
          params: { studentId: 1 }, // Replace with actual student ID from authentication
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
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      <p>Welcome, Student Name</p>

      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Total Days</h2>
          <p className="text-3xl">{dashboardData.totalDays}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Present</h2>
          <p className="text-3xl">{dashboardData.daysPresent}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Absent</h2>
          <p className="text-3xl">{dashboardData.daysAbsent}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Late</h2>
          <p className="text-3xl">{dashboardData.daysLate}</p>
        </div>
      </div>

      {/* Attendance Rate */}
      <div className="mb-8">
        <h2 className="text-xl font-bold">Attendance Rate</h2>
        <p className="text-3xl">{dashboardData.attendanceRate}%</p>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-4 mb-8">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">View Profile</button>
      </div>

      {/* Attendance History */}
      <h2 className="text-xl font-bold mb-4">Attendance History</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Class Name</th>
          </tr>
        </thead>
        <tbody>
          {dashboardData.attendanceHistory.map((record) => (
            <tr key={record.date}>
              <td className="py-2 px-4 border-b">{record.date}</td>
              <td className="py-2 px-4 border-b">{record.status}</td>
              <td className="py-2 px-4 border-b">{record.class_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
