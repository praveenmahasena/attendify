import React, { useEffect, useState } from "react";
import axios from "axios";

function TeacherClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch classes from the backend
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get("http://localhost:4242/teacher/api/teacher/classes", {
          params: { teacherId: 1 }, // Replace with actual teacher ID from authentication
        });
        setClasses(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch classes.");
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  if (loading) return <p>Loading classes...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">My Classes</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by class name..."
        className="w-full px-3 py-2 border rounded mb-4"
      />

      {/* Classes Table */}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Class Name</th>
            <th className="py-2 px-4 border-b">Students</th>
            <th className="py-2 px-4 border-b">Attendance Rate</th>
            <th className="py-2 px-4 border-b">Absent Today</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => (
            <tr key={cls.id}>
              <td className="py-2 px-4 border-b">{cls.name}</td>
              <td className="py-2 px-4 border-b">{cls.student_count}</td>
              <td className="py-2 px-4 border-b">{cls.attendance_rate}%</td>
              <td className="py-2 px-4 border-b">{cls.absent_today}</td>
              <td className="py-2 px-4 border-b space-x-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={() => alert(`Mark attendance for ${cls.name}`)}
                >
                  Mark
                </button>
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded"
                  onClick={() => alert(`View reports for ${cls.name}`)}
                >
                  View Reports
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TeacherClasses;
