import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminUserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:4242/admin/admin/users");
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch users.");
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle deleting a user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:4242/admin/admin/userdelete/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (err) {
      setError("Failed to delete user.");
    }
  };

  // Open modal for adding a new user
  const openAddUserModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing user
  const openEditUserModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      {/* Add User Button */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={openAddUserModal}
      >
        Add New User
      </button>

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Loading State */}
      {loading && <p>Loading users...</p>}

      {/* Users Table */}
      {!loading && (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Role</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b">{user.id}</td>
                <td className="py-2 px-4 border-b">{user.name}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.role}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => openEditUserModal(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* User Modal */}
      {isModalOpen && (
        <UserModal
          editingUser={editingUser}
          onClose={() => setIsModalOpen(false)}
          onSave={(newUser) => {
            if (editingUser) {
              // Update existing user
              setUsers((prevUsers) =>
                prevUsers.map((user) => (user.id === editingUser.id ? newUser : user))
              );
            } else {
              // Add new user
              setUsers((prevUsers) => [...prevUsers, newUser]);
            }
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

// User Modal Component
function UserModal({ editingUser, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: editingUser?.name || "",
    email: editingUser?.email || "",
    role: editingUser?.role || "student",
    password: "",
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
      if (editingUser) {
        // Update existing user
        response = await axios.put(`http://localhost:4242/admin/admin/userupdate/${editingUser.id}`, formData);
      } else {
        // Add new user
        response = await axios.post("http://localhost:4242/admin/admin/users", formData);
      }
      onSave(response.data.user); // Pass the updated/created user back to the parent
    } catch (err) {
      alert("Error saving user.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">{editingUser ? "Edit User" : "Add User"}</h2>
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
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {!editingUser && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
          )}
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
