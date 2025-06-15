const db = require('../db');

exports.findAll = async () => {
  const [rows] = await db.query('SELECT * FROM users');
  return rows;
};

exports.findById = async (user_id) => {
  const [rows] = await db.query(
    'SELECT nickname FROM users WHERE user_id = ?',
    [user_id]
  );
  return rows[0];
};
