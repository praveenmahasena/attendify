import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function StudentProfile() {
  // Get student ID from URL params
  const { studentId } = useParams();

  // State Variables
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    class_name: "",
  }); // Holds the fetched profile data
  const [isEditing, setIsEditing] = useState(false); // Tracks whether the user is in edit mode
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  }); // Holds the form data during editing
  const [loading, setLoading] = useState(true); // Tracks whether data is being loaded
  const [error, setError] = useState(null); // Stores any error messages

  // Fetch profile data from the backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/student/profile/${studentId}`);
        setProfile(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch profile data.");
        setLoading(false);
      }
    };
    fetchProfile();
  }, [studentId]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle saving profile updates
  const handleSave = async () => {
    try {
      const response = await axios.put(`/api/student/profile/${studentId}`, formData);
      setProfile({
        name: response.data.user.name,
        email: response.data.user.email,
        class_name: profile.class_name, // Class name doesn't change
      });
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  // Loading State
  if (loading) return <p>Loading profile...</p>;

  // Error State
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Student Profile</h1>

      {/* Profile Details */}
      {!isEditing && (
        <div>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Class:</strong> {profile.class_name}</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        </div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <div>
          <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
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
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default StudentProfile;
