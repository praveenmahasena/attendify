import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminReports() {
  const [trends, setTrends] = useState([]);
  const [classPerformance, setClassPerformance] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    granularity: "day",
  });

  // Fetch attendance trends based on filters
  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await axios.get("http://localhost:4242/admin/api/admin/reports/trends", { params: filters });
        setTrends(response.data);
      } catch (err) {
        console.error("Error fetching attendance trends:", err);
      }
    };

    fetchTrends();
  }, [filters]);

  // Fetch class performance
  useEffect(() => {
    const fetchClassPerformance = async () => {
      try {
        const response = await axios.get("http://localhost:4242/admin/api/admin/reports/class-performance");
        setClassPerformance(response.data);
      } catch (err) {
        console.error("Error fetching class performance:", err);
      }
    };

    fetchClassPerformance();
  }, []);

  // Handle downloading CSV
  const handleExport = async () => {
    try {
      const response = await axios.get("http://localhost:4242/admin/api/admin/reports/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "attendance_report.csv");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("Error exporting attendance report:", err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Attendance Reports</h1>

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
        <select
          value={filters.granularity}
          onChange={(e) => setFilters({ ...filters, granularity: e.target.value })}
          className="px-3 py-2 border rounded"
        >
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
        </select>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleExport}
        >
          Export Report
        </button>
      </div>

      {/* Attendance Trends */}
      <h2 className="text-xl font-bold mt-6 mb-4">Attendance Trends</h2>
      <LineChart
        width={800}
        height={400}
        data={trends}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="attendance_rate" stroke="#8884d8" />
      </LineChart>

      {/* Class Performance */}
      <h2 className="text-xl font-bold mt-6 mb-4">Class Performance</h2>
      <BarChart
        width={800}
        height={400}
        data={classPerformance}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="class_name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="attendance_rate" fill="#82ca9d" />
      </BarChart>
    </div>
  );
}
