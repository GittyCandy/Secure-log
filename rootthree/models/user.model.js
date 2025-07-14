import { getPool } from '../config/database.js';

export default class User {
  static async create({ name, email, password, is_buyer = false, is_seller = false, is_admin = false }) {
    const pool = getPool();
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, is_buyer, is_seller, is_admin) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, password, is_buyer, is_seller, is_admin]
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

  static async getAllUsers() {
    const pool = getPool();
    const [rows] = await pool.query('SELECT id, name, email, is_buyer, is_seller, is_admin FROM users');
    return rows;
  }
}