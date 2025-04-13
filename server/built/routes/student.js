import { Router } from "express";
import connection from "../postgres/connect.js";
const student = Router();
student.get("/api/student/dashboard", async (req, res) => {
    const { studentId } = req.query; // Assume the student ID is passed via query params
    try {
        // Fetch total attendance days
        const totalDaysResult = await connection.query("SELECT COUNT(*) FROM Attendance WHERE student_id = $1", [studentId]);
        const totalDays = parseInt(totalDaysResult.rows[0].count);
        // Fetch days present
        const daysPresentResult = await connection.query("SELECT COUNT(*) FROM Attendance WHERE student_id = $1 AND status = 'present'", [studentId]);
        const daysPresent = parseInt(daysPresentResult.rows[0].count);
        // Fetch days absent
        const daysAbsentResult = await connection.query("SELECT COUNT(*) FROM Attendance WHERE student_id = $1 AND status = 'absent'", [studentId]);
        const daysAbsent = parseInt(daysAbsentResult.rows[0].count);
        // Fetch days late
        const daysLateResult = await connection.query("SELECT COUNT(*) FROM Attendance WHERE student_id = $1 AND status = 'late'", [studentId]);
        const daysLate = parseInt(daysLateResult.rows[0].count);
        // Calculate attendance rate
        const attendanceRate = totalDays > 0 ? ((daysPresent / totalDays) * 100).toFixed(2) : "0.00";
        // Fetch attendance history
        const attendanceHistoryResult = await connection.query(`
      SELECT
        a.date,
        a.status,
        c.name AS class_name
      FROM Attendance a
      JOIN Classes c ON a.class_id = c.id
      WHERE a.student_id = $1
      ORDER BY a.date DESC
    `, [studentId]);
        res.json({
            totalDays,
            daysPresent,
            daysAbsent,
            daysLate,
            attendanceRate,
            attendanceHistory: attendanceHistoryResult.rows,
        });
    }
    catch (error) {
        console.error("Error fetching student dashboard data:", error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
});
student.put("/api/student/profile/:studentId", async (req, res) => {
    const { studentId } = req.params;
    const { name, email } = req.body;
    try {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format." });
        }
        // Update the student's profile in the database
        const result = await connection.query("UPDATE Users SET name = $1, email = $2 WHERE id = $3 RETURNING *", [name, email, studentId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Student not found." });
        }
        res.json({ message: "Profile updated successfully", user: result.rows[0] });
    }
    catch (error) {
        console.error("Error updating student profile:", error);
        res.status(500).json({ error: "An error occurred while updating profile data." });
    }
});
student.get("/api/student/profile/:studentId", async (req, res) => {
    const { studentId } = req.params;
    try {
        // Fetch the student's profile data
        const result = await connection.query(`
      SELECT
        u.id AS user_id,
        u.name,
        u.email,
        c.name AS class_name
      FROM Users u
      JOIN Students s ON u.id = s.user_id
      JOIN Classes c ON s.class_id = c.id
      WHERE u.id = $1
    `, [studentId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Student not found." });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error("Error fetching student profile:", error);
        res.status(500).json({ error: "An error occurred while fetching profile data." });
    }
});
student.get("/api/student/attendance/:studentId", async (req, res) => {
    const { studentId } = req.params;
    try {
        // Fetch total attendance days
        const totalDaysResult = await connection.query("SELECT COUNT(*) FROM Attendance WHERE student_id = $1", [studentId]);
        const totalDays = parseInt(totalDaysResult.rows[0].count);
        // Fetch days present
        const daysPresentResult = await connection.query("SELECT COUNT(*) FROM Attendance WHERE student_id = $1 AND status = 'present'", [studentId]);
        const daysPresent = parseInt(daysPresentResult.rows[0].count);
        // Fetch days absent
        const daysAbsentResult = await connection.query("SELECT COUNT(*) FROM Attendance WHERE student_id = $1 AND status = 'absent'", [studentId]);
        const daysAbsent = parseInt(daysAbsentResult.rows[0].count);
        // Fetch days late
        const daysLateResult = await connection.query("SELECT COUNT(*) FROM Attendance WHERE student_id = $1 AND status = 'late'", [studentId]);
        const daysLate = parseInt(daysLateResult.rows[0].count);
        // Calculate attendance rate
        const attendanceRate = totalDays > 0 ? ((daysPresent / totalDays) * 100).toFixed(2) : "0.00";
        // Fetch attendance history
        const attendanceHistoryResult = await connection.query(`
      SELECT
        a.date,
        a.status,
        c.name AS class_name
      FROM Attendance a
      JOIN Classes c ON a.class_id = c.id
      WHERE a.student_id = $1
      ORDER BY a.date DESC
    `, [studentId]);
        res.json({
            totalDays,
            daysPresent,
            daysAbsent,
            daysLate,
            attendanceRate,
            attendanceHistory: attendanceHistoryResult.rows,
        });
    }
    catch (error) {
        console.error("Error fetching student attendance data:", error);
        res.status(500).json({ error: "An error occurred while fetching attendance data." });
    }
});
export default student;
