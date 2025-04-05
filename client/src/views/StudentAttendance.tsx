import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function StudentAttendance() {
  // Get student ID from URL params
  const { studentId } = useParams();

  // State Variables
  const [attendanceData, setAttendanceData] = useState({
    totalDays: 0,
    daysPresent: 0,
    daysAbsent: 0,
    daysLate: 0,
    attendanceRate: "0.00",
    attendanceHistory: [],
  }); // Holds the fetched attendance data
  const [loading, setLoading] = useState(true); // Tracks whether data is being loaded
  const [error, setError] = useState(null); // Stores any error messages

  // Fetch attendance data from the backend
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(`http://localhost:4242/student/api/student/attendance/${studentId}`);
        setAttendanceData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch attendance data.");
        setLoading(false);
      }
    };
    fetchAttendanceData();
  }, [studentId]);

  // Loading State
  if (loading) return <p>Loading attendance data...</p>;

  // Error State
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">My Attendance</h1>

      {/* Attendance Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Total Days</h2>
          <p className="text-3xl">{attendanceData.totalDays}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Present</h2>
          <p className="text-3xl">{attendanceData.daysPresent}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Absent</h2>
          <p className="text-3xl">{attendanceData.daysAbsent}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Late</h2>
          <p className="text-3xl">{attendanceData.daysLate}</p>
        </div>
      </div>

      {/* Attendance Rate */}
      <div className="mb-8">
        <h2 className="text-xl font-bold">Attendance Rate</h2>
        <p className="text-3xl">{attendanceData.attendanceRate}%</p>
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
          {attendanceData.attendanceHistory.map((record) => (
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

export default StudentAttendance;
