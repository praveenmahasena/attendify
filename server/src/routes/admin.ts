import cvs from 'json2csv'
import {Router} from 'express'
import connection from '../postgres/connect.js'
import { adminLogin, overView, active, attendance, performance,roles,adminUser } from '../handlers/admin.js'
import {adminAddUsers,adminUserUpdate,adminUserDelete} from '../handlers/admin.js'

const admin=Router()

admin.post('/login',adminLogin)
admin.get('/dashboard/overview',overView)
admin.get('/dashboard/activity',active)
admin.get('/dashboard/attendance-trends',attendance)
admin.get('/dashboard/class-performance',performance)
admin.get('/dashboard/user-roles',roles)
admin.get('/admin/users',adminUser) // done
admin.post('/admin/users',adminAddUsers) //done
admin.put('/admin/userupdate/:id',adminUserUpdate) //done
admin.delete('/admin/userdelete/:id',adminUserDelete) //done


admin.get("/api/admin/classes", async (req, res) => {
  try {
    const result = await connection.query(`
      SELECT
        c.id,
        c.name,
        u.name AS teacher_name,
        COUNT(s.user_id) AS student_count
      FROM Classes c
      LEFT JOIN Users u ON c.teacher_id = u.id
      LEFT JOIN Students s ON c.id = s.class_id
      GROUP BY c.id, c.name, u.name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ error: "An error occurred while fetching classes." });
  }
});

admin.post("/api/admin/classes", async (req, res) => {
  const { name, teacherId } = req.body;

  try {
    const result = await connection.query(
      "INSERT INTO Classes (name, teacher_id) VALUES ($1, $2) RETURNING *",
      [name, teacherId]
    );
    res.json({ message: "Class added successfully", class: result.rows[0] });
  } catch (error) {
    console.error("Error adding class:", error);
    res.status(500).json({ error: "An error occurred while adding the class." });
  }
});


admin.put("/api/admin/classes/:id", async (req, res) => {
  const { id } = req.params;
  const { name, teacherId } = req.body;

  try {
    const result = await connection.query(
      "UPDATE Classes SET name = $1, teacher_id = $2 WHERE id = $3 RETURNING *",
      [name, teacherId, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Class not found." });
    }
    res.json({ message: "Class updated successfully", class: result.rows[0] });
  } catch (error) {
    console.error("Error updating class:", error);
    res.status(500).json({ error: "An error occurred while updating the class." });
  }
});

admin.delete("/api/admin/classes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Remove associated students from the Students table
    await connection.query("DELETE FROM Students WHERE class_id = $1", [id]);

    // Delete the class
    const result = await connection.query("DELETE FROM Classes WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Class not found." });
    }
    res.json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("Error deleting class:", error);
    res.status(500).json({ error: "An error occurred while deleting the class." });
  }
});

admin.post("/api/admin/classes/:id/students", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const result = await connection.query(
      "INSERT INTO Students (user_id, class_id) VALUES ($1, $2) RETURNING *",
      [userId, id]
    );
    res.json({ message: "Student assigned to class successfully", student: result.rows[0] });
  } catch (error) {
    console.error("Error assigning student to class:", error);
    res.status(500).json({ error: "An error occurred while assigning the student." });
  }
});

admin.delete("/api/admin/classes/:id/students/:userId", async (req, res) => {
  const { id, userId } = req.params;

  try {
    const result = await connection.query(
      "DELETE FROM Students WHERE class_id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found in this class." });
    }
    res.json({ message: "Student unassigned from class successfully" });
  } catch (error) {
    console.error("Error unassigning student from class:", error);
    res.status(500).json({ error: "An error occurred while unassigning the student." });
  }
});



admin.get("/api/admin/attendance/export", async (req, res) => {
    const json2csv = cvs.parse
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
    `);

    const fields = ["date", "class_name", "student_name", "status"];
    const csv = json2csv(result.rows, { fields });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=attendance.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error exporting attendance:", error);
    res.status(500).json({ error: "An error occurred while exporting attendance." });
  }
});


admin.delete("/api/admin/attendance/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await connection.query("DELETE FROM Attendance WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Attendance record not found." });
    }
    res.json({ message: "Attendance deleted successfully" });
  } catch (error) {
    console.error("Error deleting attendance:", error);
    res.status(500).json({ error: "An error occurred while deleting attendance." });
  }
});


admin.put("/api/admin/attendance/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await connection.query(
      "UPDATE Attendance SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Attendance record not found." });
    }
    res.json({ message: "Attendance updated successfully", attendance: result.rows[0] });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ error: "An error occurred while updating attendance." });
  }
});


admin.post("/api/admin/attendance", async (req, res) => {
  const { studentId, classId, date, status } = req.body;

  try {
    const result = await connection.query(
      "INSERT INTO Attendance (student_id, class_id, date, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [studentId, classId, date, status]
    );
    res.json({ message: "Attendance marked successfully", attendance: result.rows[0] });
  } catch (error) {
    console.error("Error adding attendance:", error);
    res.status(500).json({ error: "An error occurred while marking attendance." });
  }
});


admin.get("/api/admin/attendance", async (req, res) => {
  const { startDate, endDate, classId, studentId } = req.query;

  try {
    let query = `
      SELECT
        a.id,
        a.date,
        c.name AS class_name,
        u.name AS student_name,
        a.status
      FROM Attendance a
      JOIN Classes c ON a.class_id = c.id
      JOIN Users u ON a.student_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (startDate) {
      query += " AND a.date >= $1";
      params.push(startDate);
    }
    if (endDate) {
      query += " AND a.date <= $2";
      params.push(endDate);
    }
    if (classId) {
      query += " AND a.class_id = $3";
      params.push(classId);
    }
    if (studentId) {
      query += " AND a.student_id = $4";
      params.push(studentId);
    }

    const result = await connection.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: "An error occurred while fetching attendance." });
  }
});


admin.get("/api/admin/reports/trends", async (req, res) => {
  const { startDate, endDate, granularity } = req.query; // granularity: 'day', 'week', 'month'

  try {
    let query = `
      SELECT
        TO_CHAR(date, $1) AS period,
        ROUND(AVG(CASE WHEN status = 'present' THEN 1 ELSE 0 END) * 100, 2) AS attendance_rate
      FROM Attendance
      WHERE date >= $2 AND date <= $3
      GROUP BY period
      ORDER BY period ASC
    `;
    const params = [granularity === "month" ? "YYYY-MM" : granularity === "week" ? "YYYY-IW" : "YYYY-MM-DD", startDate, endDate];

    const result = await connection.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching attendance trends:", error);
    res.status(500).json({ error: "An error occurred while fetching attendance trends." });
  }
});


admin.get("/api/admin/reports/class-performance", async (req, res) => {
  try {
    const result = await connection.query(`
      SELECT
        c.name AS class_name,
        ROUND(AVG(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) * 100, 2) AS attendance_rate
      FROM Attendance a
      JOIN Classes c ON a.class_id = c.id
      GROUP BY c.name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching class performance:", error);
    res.status(500).json({ error: "An error occurred while fetching class performance." });
  }
});


admin.get("/api/admin/reports/student/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await connection.query(`
      SELECT
        a.date,
        c.name AS class_name,
        a.status
      FROM Attendance a
      JOIN Classes c ON a.class_id = c.id
      WHERE a.student_id = $1
      ORDER BY a.date ASC
    `, [id]);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching student attendance:", error);
    res.status(500).json({ error: "An error occurred while fetching student attendance." });
  }
});

admin.get("/api/admin/reports/export", async (req, res) => {
    const json2csv= cvs.parse
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
    `);

    const fields = ["date", "class_name", "student_name", "status"];
    const csv = json2csv(result.rows, { fields });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=attendance_report.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error exporting attendance report:", error);
    res.status(500).json({ error: "An error occurred while exporting attendance report." });
  }
});

export default admin
