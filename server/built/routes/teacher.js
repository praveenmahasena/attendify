import { Router } from "express";
import connection from "../postgres/connect.js";
const teacher = Router();
teacher.get("/api/teacher/dashboard", async (req, res) => {
    const { teacherId } = req.query; // Assume the teacher ID is passed via query params
    try {
        // Fetch total classes
        const totalClassesResult = await connection.query("SELECT COUNT(*) FROM Classes WHERE teacher_id = $1", [teacherId]);
        const totalClasses = parseInt(totalClassesResult.rows[0].count);
        // Fetch attendance rate
        const attendanceRateResult = await connection.query(`
      SELECT
        ROUND(AVG(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) * 100, 2) AS attendance_rate
      FROM Attendance a
      JOIN Classes c ON a.class_id = c.id
      WHERE c.teacher_id = $1
    `, [teacherId]);
        const attendanceRate = parseFloat(attendanceRateResult.rows[0].attendance_rate || 0);
        // Fetch absent today
        const absentTodayResult = await connection.query(`
      SELECT COUNT(*)
      FROM Attendance a
      JOIN Classes c ON a.class_id = c.id
      WHERE c.teacher_id = $1 AND a.date = CURRENT_DATE AND a.status = 'absent'
    `, [teacherId]);
        const absentToday = parseInt(absentTodayResult.rows[0].count);
        // Fetch assigned classes
        const assignedClassesResult = await connection.query(`
      SELECT
        c.id,
        c.name,
        COUNT(s.user_id) AS student_count,
        ROUND(AVG(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) * 100, 2) AS attendance_rate
      FROM Classes c
      LEFT JOIN Students s ON c.id = s.class_id
      LEFT JOIN Attendance a ON c.id = a.class_id
      WHERE c.teacher_id = $1
      GROUP BY c.id, c.name
    `, [teacherId]);
        res.json({
            totalClasses,
            attendanceRate,
            absentToday,
            assignedClasses: assignedClassesResult.rows,
        });
    }
    catch (error) {
        console.error("Error fetching teacher dashboard data:", error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
});
teacher.get("/api/teacher/classes", async (req, res) => {
    const { teacherId } = req.query; // Assume the teacher ID is passed via query params
    try {
        const result = await connection.query(`
      SELECT
        c.id,
        c.name,
        COUNT(s.user_id) AS student_count,
        ROUND(AVG(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) * 100, 2) AS attendance_rate,
        SUM(CASE WHEN a.date = CURRENT_DATE AND a.status = 'absent' THEN 1 ELSE 0 END) AS absent_today
      FROM Classes c
      LEFT JOIN Students s ON c.id = s.class_id
      LEFT JOIN Attendance a ON c.id = a.class_id
      WHERE c.teacher_id = $1
      GROUP BY c.id, c.name
    `, [teacherId]);
        res.json(result.rows);
    }
    catch (error) {
        console.error("Error fetching teacher classes:", error);
        res.status(500).json({ error: "An error occurred while fetching classes." });
    }
});
teacher.get("/api/teacher/attendance/:classId", async (req, res) => {
    const { classId } = req.params;
    const { date } = req.query;
    try {
        const result = await connection.query(`
      SELECT
        u.id AS student_id,
        u.name AS student_name,
        a.status
      FROM Students s
      JOIN Users u ON s.user_id = u.id
      LEFT JOIN Attendance a ON s.user_id = a.student_id AND a.class_id = $1 AND a.date = $2
      WHERE s.class_id = $1
    `, [classId, date]);
        res.json(result.rows);
    }
    catch (error) {
        console.error("Error fetching attendance:", error);
        res.status(500).json({ error: "An error occurred while fetching attendance." });
    }
});
teacher.post("/api/teacher/attendance/:classId", async (req, res) => {
    const { classId } = req.params;
    const { date, attendanceRecords } = req.body;
    try {
        // Delete existing attendance records for the class on the given date
        await connection.query("DELETE FROM Attendance WHERE class_id = $1 AND date = $2", [classId, date]);
        // Insert new attendance records
        for (const record of attendanceRecords) {
            await connection.query("INSERT INTO Attendance (student_id, class_id, date, status) VALUES ($1, $2, $3, $4)", [record.studentId, classId, date, record.status]);
        }
        res.json({ message: "Attendance saved successfully" });
    }
    catch (error) {
        console.error("Error saving attendance:", error);
        res.status(500).json({ error: "An error occurred while saving attendance." });
    }
});
teacher.get("/api/teacher/reports/export", async (req, res) => {
    const { teacherId, startDate, endDate } = req.query;
    try {
        const result = await connection.query(`
      SELECT
        a.date,
        c.name AS class_name,
        u.name AS student_name,
        a.status
      FROM Attendance a
      JOIN Classes c ON a.class_id = c.id
      JOIN Users u ON a.student_id = u.id
      WHERE c.teacher_id = $1 AND a.date >= $2 AND a.date <= $3
      ORDER BY a.date ASC
    `, [teacherId, startDate, endDate]);
        const fields = ["date", "class_name", "student_name", "status"];
        const jscsv = cvs(result.rows, { fields });
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=attendance_report.csv");
        res.send(jscsv);
    }
    catch (error) {
        console.error("Error exporting attendance report:", error);
        res.status(500).json({ error: "An error occurred while exporting attendance report." });
    }
});
teacher.get("/api/teacher/reports/class-performance", async (req, res) => {
    const { teacherId } = req.query;
    try {
        const result = await connection.query(`
      SELECT
        c.name AS class_name,
        ROUND(AVG(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) * 100, 2) AS attendance_rate
      FROM Attendance a
      JOIN Classes c ON a.class_id = c.id
      WHERE c.teacher_id = $1
      GROUP BY c.name
    `, [teacherId]);
        res.json(result.rows);
    }
    catch (error) {
        console.error("Error fetching class performance:", error);
        res.status(500).json({ error: "An error occurred while fetching class performance." });
    }
});
teacher.get("/api/teacher/reports/trends", async (req, res) => {
    const { teacherId, startDate, endDate, granularity } = req.query;
    try {
        let query = `
      SELECT
        TO_CHAR(a.date, $1) AS period,
        ROUND(AVG(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) * 100, 2) AS attendance_rate
      FROM Attendance a
      JOIN Classes c ON a.class_id = c.id
      WHERE c.teacher_id = $2 AND a.date >= $3 AND a.date <= $4
      GROUP BY period
      ORDER BY period ASC
    `;
        const params = [
            granularity === "month" ? "YYYY-MM" : granularity === "week" ? "IYYY-IW" : "YYYY-MM-DD",
            teacherId,
            startDate,
            endDate,
        ];
        const result = await connection.query(query, params);
        res.json(result.rows);
    }
    catch (error) {
        console.error("Error fetching attendance trends:", error);
        res.status(500).json({ error: "An error occurred while fetching attendance trends." });
    }
});
export default teacher;
