import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  // Fetch classes from the backend
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get("http://localhost:4242/admin/api/admin/classes");
        setClasses(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch classes.");
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  // Handle deleting a class
  const handleDeleteClass = async (classId) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;

    try {
      await axios.delete(`http://localhost:4242/admin/api/admin/classes/${classId}`);
      setClasses((prevClasses) => prevClasses.filter((cls) => cls.id !== classId));
    } catch (err) {
      setError("Failed to delete class.");
    }
  };

  // Open modal for adding a new class
  const openAddClassModal = () => {
    setEditingClass(null);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing class
  const openEditClassModal = (cls) => {
    setEditingClass(cls);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Classes</h1>

      {/* Add Class Button */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={openAddClassModal}
      >
        Add New Class
      </button>

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Loading State */}
      {loading && <p>Loading classes...</p>}

      {/* Classes Table */}
      {!loading && (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Teacher</th>
              <th className="py-2 px-4 border-b">Students</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls.id}>
                <td className="py-2 px-4 border-b">{cls.name}</td>
                <td className="py-2 px-4 border-b">{cls.teacher_name || "Unassigned"}</td>
                <td className="py-2 px-4 border-b">{cls.student_count}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => openEditClassModal(cls)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDeleteClass(cls.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Class Modal */}
      {isModalOpen && (
        <ClassModal
          editingClass={editingClass}
          onClose={() => setIsModalOpen(false)}
          onSave={(newClass) => {
            if (editingClass) {
              // Update existing class
              setClasses((prevClasses) =>
                prevClasses.map((cls) => (cls.id === editingClass.id ? newClass : cls))
              );
            } else {
              // Add new class
              setClasses((prevClasses) => [...prevClasses, newClass]);
            }
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

// Class Modal Component
function ClassModal({ editingClass, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: editingClass?.name || "",
    teacherId: editingClass?.teacher_id || "",
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
      if (editingClass) {
        // Update existing class
        response = await axios.put(`http://localhost:4242/admin/api/admin/classes/${editingClass.id}`, formData);
      } else {
        // Add new class
        response = await axios.post("http://localhost:4242/admin/api/admin/classes", formData);
      }
      onSave(response.data.class); // Pass the updated/created class back to the parent
    } catch (err) {
      alert("Error saving class.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">{editingClass ? "Edit Class" : "Add Class"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Teacher ID</label>
            <input
              type="number"
              name="teacherId"
              value={formData.teacherId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter teacher's ID"
            />
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
