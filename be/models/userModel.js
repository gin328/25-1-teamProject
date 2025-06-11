const db = require('../db');

exports.findAll = async () => {
  const [rows] = await db.query('SELECT * FROM users');
  return rows;
};
