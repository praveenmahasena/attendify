import {fetchAdmin} from "../postgres/admin.js";
import connection from "../postgres/connect.js";
import {JWT} from "../util/jwt.js";
import {comparePassword} from "../util/password.js";

export async function adminLogin(req, res) {
  try {
    const admin = await fetchAdmin(req.body.email, "admin");
    // handle password verification
    const jwt_cookie = await JWT(admin[0].email);
    res.status(200);
    res.cookie("cookie", jwt_cookie, {
      httpOnly :
          true, // Prevents client-side JavaScript from accessing the cookie
      sameSite : "strict", // Protects against CSRF attacks
      maxAge :
          3 * 24 * 60 * 60 * 1000, // Cookie expiration: 3 days in milliseconds
    });
    res.json({message : "logged in"});
  } catch (err) {
    console.log(err);
  }
}

export async function overView(req, res) {
  try {
    // Total Users
    const totalUsersResult = await connection.query(
        "SELECT COUNT(*) FROM Users",
    );
    const totalUsers = parseInt(totalUsersResult.rows[0].count);

    // Active Classes
    const activeClassesResult = await connection.query(
        "SELECT COUNT(*) FROM Classes",
    );
    const activeClasses = parseInt(activeClassesResult.rows[0].count);

    // Attendance Rate
    const attendanceRateResult = await connection.query(`
      SELECT
        ROUND(AVG(CASE WHEN status = 'present' THEN 1 ELSE 0 END) * 100, 2) AS attendance_rate
      FROM Attendance
    `);
    const attendanceRate = parseFloat(
        attendanceRateResult.rows[0].attendance_rate || 0,
    );

    // Absent Today
    const absentTodayResult = await connection.query(`
      SELECT COUNT(*)
      FROM Attendance
      WHERE date = CURRENT_DATE AND status = 'absent'
    `);
    const absentToday = parseInt(absentTodayResult.rows[0].count);

    res.json({
      totalUsers,
      activeClasses,
      attendanceRate,
      absentToday,
    });
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    res.status(500).json({error : "An error occurred while fetching data."});
  }
}

export async function active(req, res) {
  try {
    const result = await connection.query(`
      SELECT
        u.name AS user_name,
        a.date,
        a.status,
        c.name AS class_name
      FROM Attendance a
      JOIN Users u ON a.student_id = u.id
      JOIN Classes c ON a.class_id = c.id
      ORDER BY a.date DESC
      LIMIT 10
    `);

    const recentActivity = result.rows.map(
        (row) => ({
          action : `${row.user_name} marked attendance for ${row.class_name}`,
          timestamp : row.date,
        }));

    res.json(recentActivity);
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    res.status(500).json({error : "An error occurred while fetching data."});
  }
}

export async function attendance(req, res) {
  try {
    const result = await connection.query(`
      SELECT
        date,
        ROUND(AVG(CASE WHEN status = 'present' THEN 1 ELSE 0 END) * 100, 2) AS attendance_rate
      FROM Attendance
      GROUP BY date
      ORDER BY date ASC
    `);

    const attendanceTrends =
        result.rows.map((row) => ({
                          date : row.date.toISOString().split(
                              "T")[0], // Format date as YYYY-MM-DD
                          attendanceRate : parseFloat(row.attendance_rate),
                        }));

    res.json(attendanceTrends);
  } catch (error) {
    console.error("Error fetching attendance trends:", error);
    res.status(500).json({error : "An error occurred while fetching data."});
  }
}

export async function performance(req, res) {
  try {
    const result = await connection.query(`
      SELECT
        c.name AS class_name,
        ROUND(AVG(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) * 100, 2) AS attendance_rate
      FROM Attendance a
      JOIN Classes c ON a.class_id = c.id
      GROUP BY c.name
    `);

    const classPerformance =
        result.rows.map((row) => ({
                          className : row.class_name,
                          attendanceRate : parseFloat(row.attendance_rate),
                        }));

    res.json(classPerformance);
  } catch (error) {
    console.error("Error fetching class performance:", error);
    res.status(500).json({error : "An error occurred while fetching data."});
  }
}

export async function roles(req, res) {
  try {
    const result = await connection.query(`
      SELECT role, COUNT(*) AS count
      FROM Users
      GROUP BY role
    `);

    const userRoles = result.rows.map((row) => ({
                                        role : row.role,
                                        count : parseInt(row.count),
                                      }));

    res.json(userRoles);
  } catch (error) {
    console.error("Error fetching user roles distribution:", error);
    res.status(500).json({error : "An error occurred while fetching data."});
  }
}

export async function adminUser(req,res){
    console.log('came:while')
  try {
    const result = await connection.query("SELECT id, name, email, role FROM Users");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
}

export async function adminAddUsers(req,res){
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await connection.query(
      "INSERT INTO Users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, role]
    );
    res.json({ message: "User added successfully", user: result.rows[0] });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "An error occurred while adding the user." });
  }
}


export async function adminUserUpdate(req,res){
 const { id } = req.params;
  const { name, email, role } = req.body;

  try {
    const result = await connection.query(
      "UPDATE Users SET name = $1, email = $2, role = $3 WHERE id = $4 RETURNING *",
      [name, email, role, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json({ message: "User updated successfully", user: result.rows[0] });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "An error occurred while updating the user." });
  }
}

export async function adminUserDelete(req,res){
  const { id } = req.params;
  try {
    const result = await connection.query("DELETE FROM Users WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "An error occurred while deleting the user." });
  }
}



export async function getAllClasses(req,res){
  try {
    const result = await pool.query(`
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
}

export async function addClasses(req,res){
  const { name, teacherId } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO Classes (name, teacher_id) VALUES ($1, $2) RETURNING *",
      [name, teacherId]
    );
    res.json({ message: "Class added successfully", class: result.rows[0] });
  } catch (error) {
    console.error("Error adding class:", error);
    res.status(500).json({ error: "An error occurred while adding the class." });
  }
}


export async function updateClasses(req,res){
 const { id } = req.params;
  const { name, teacherId } = req.body;

  try {
    const result = await pool.query(
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
}

export async function deleteClasses(req,res){
  const { id } = req.params;

  try {
    // Remove associated students from the Students table
    await pool.query("DELETE FROM Students WHERE class_id = $1", [id]);
    // Delete the class
    const result = await pool.query("DELETE FROM Classes WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Class not found." });
    }
    res.json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("Error deleting class:", error);
    res.status(500).json({ error: "An error occurred while deleting the class." });
  }
}



export async function assignstudentclass(req,res){
    const { id } = req.params;
    const { userId } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO Students (user_id, class_id) VALUES ($1, $2) RETURNING *",
      [userId, id]
    );
    res.json({ message: "Student assigned to class successfully", student: result.rows[0] });
  } catch (error) {
    console.error("Error assigning student to class:", error);
    res.status(500).json({ error: "An error occurred while assigning the student." });
  }
}

export async function deleteStudentFromClass(req,res){
  const { id, userId } = req.params;

  try {
    const result = await pool.query(
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
}
