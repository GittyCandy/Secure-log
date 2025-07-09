import { getPool } from '../config/database.js';

export default class User {
  static async create({ name, email, password }) {
    const pool = getPool();
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );
    return this.findById(result.insertId);
  }

static async findByEmail(email) {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0] || null;
}

  static async findById(id) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  }
}