import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function TeacherAttendance() {
  const { classId } = useParams();
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch students and attendance records for the selected class and date
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(`http://localhost:4242/teacher/api/teacher/attendance/${classId}`, {
          params: { date },
        });
        setStudents(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch attendance.");
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [classId, date]);

  // Handle saving attendance
  const handleSaveAttendance = async () => {
    try {
      await axios.post(`http://localhost:4242/teacher/api/teacher/attendance/${classId}`, {
        date,
        attendanceRecords: students.map((student) => ({
          studentId: student.student_id,
          status: student.status || "absent",
        })),
      });
      alert("Attendance saved successfully!");
    } catch (err) {
      setError("Failed to save attendance.");
    }
  };

  if (loading) return <p>Loading attendance...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Mark Attendance</h1>
      <p>Class: Grade 10A</p>

      {/* Date Selector */}
      <div className="mb-4">
        <label htmlFor="date" className="block text-sm font-medium mb-1">
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 border rounded w-full"
        />
      </div>

      {/* Attendance Table */}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Student Name</th>
            <th className="py-2 px-4 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.student_id}>
              <td className="py-2 px-4 border-b">{student.student_name}</td>
              <td className="py-2 px-4 border-b">
                <select
                  value={student.status || "absent"}
                  onChange={(e) =>
                    setStudents((prev) =>
                      prev.map((s) =>
                        s.student_id === student.student_id
                          ? { ...s, status: e.target.value }
                          : s
                      )
                    )
                  }
                  className="px-3 py-2 border rounded"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Save Button */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        onClick={handleSaveAttendance}
      >
        Save Attendance
      </button>
    </div>
  );
}

export default TeacherAttendance;
