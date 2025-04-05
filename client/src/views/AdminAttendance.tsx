import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ startDate: "", endDate: "", classId: "", studentId: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Fetch attendance records based on filters
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get("http://localhost:4242/admin/api/admin/attendance", { params: filters });
        setAttendance(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch attendance.");
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [filters]);

  // Handle downloading CSV
  const handleExport = async () => {
    try {
      const response = await axios.get("http://localhost:4242/admin/api/admin/attendance/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "attendance.csv");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      setError("Failed to export attendance.");
    }
  };

  // Open modal for marking/editing attendance
  const openEditModal = (record) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Attendance</h1>

      {/* Filters */}
      <div className="flex space-x-4 mb-4">
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          placeholder="Start Date"
          className="px-3 py-2 border rounded"
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          placeholder="End Date"
          className="px-3 py-2 border rounded"
        />
        <input
          type="number"
          value={filters.classId}
          onChange={(e) => setFilters({ ...filters, classId: e.target.value })}
          placeholder="Class ID"
          className="px-3 py-2 border rounded"
        />
        <input
          type="number"
          value={filters.studentId}
          onChange={(e) => setFilters({ ...filters, studentId: e.target.value })}
          placeholder="Student ID"
          className="px-3 py-2 border rounded"
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleExport}
        >
          Export Attendance
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Loading State */}
      {loading && <p>Loading attendance...</p>}

      {/* Attendance Table */}
      {!loading && (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Class</th>
              <th className="py-2 px-4 border-b">Student</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record) => (
              <tr key={record.id}>
                <td className="py-2 px-4 border-b">{record.date}</td>
                <td className="py-2 px-4 border-b">{record.class_name}</td>
                <td className="py-2 px-4 border-b">{record.student_name}</td>
                <td className="py-2 px-4 border-b">{record.status}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={() => openEditModal(record)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Attendance Modal */}
      {isModalOpen && (
        <AttendanceModal
          editingRecord={editingRecord}
          onClose={() => setIsModalOpen(false)}
          onSave={(newRecord) => {
            setAttendance((prevRecords) =>
              prevRecords.map((record) => (record.id === editingRecord.id ? newRecord : record))
            );
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

// Attendance Modal Component
function AttendanceModal({ editingRecord, onClose, onSave }) {
  const [formData, setFormData] = useState({
    status: editingRecord?.status || "present",
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (editingRecord) {
        // Update existing attendance record
        response = await axios.put(`http://localhost:4242/admin/api/admin/attendance/${editingRecord.id}`, formData);
      } else {
        // Add new attendance record
        response = await axios.post("http://localhost:4242/admin/api/admin/attendance", formData);
      }
      onSave(response.data.attendance); // Pass the updated/created record back to the parent
    } catch (err) {
      alert("Error saving attendance.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">{editingRecord ? "Edit Attendance" : "Mark Attendance"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
