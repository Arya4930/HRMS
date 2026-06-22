import bcrypt from "bcryptjs";
import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "password",
  database: "hrms",
});

export async function findUserByEmail(email) {
  const result = await pool.query(
    `SELECT userid, name, email, password
     FROM users
     WHERE email = $1`,
    [email.toLowerCase().trim()]
  );

  return result.rows[0] || null;
}

export async function createUser({ userid, name, email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (userid, name, email, password)
     VALUES ($1, $2, $3, $4)
     RETURNING userid, name, email`,
    [userid.trim(), name.trim(), email.toLowerCase().trim(), hashedPassword]
  );

  return result.rows[0];
}

export function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  const { password, ...safeUser } = user;
  return safeUser;
}

export async function isPasswordCorrect(password, hashedPassword) {
  if (hashedPassword?.startsWith("$2")) {
    return bcrypt.compare(password, hashedPassword);
  }

  return password === hashedPassword;
}
