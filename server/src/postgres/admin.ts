import connection from "./connect.js";

export async function fetchAdmin(email, role) {
  try {
    const {rows} = await connection.query(
        "SELECT name,email,role, password FROM Users WHERE email = $1 AND role = $2",
        [ email, role ],
    );
    return rows;
  } catch (err) {
    throw err;
  }
}
