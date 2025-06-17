const db = require('../db');

exports.findByUserId = async (userId) => {
  const [rows] = await db.query('SELECT * FROM dogs WHERE user_id = ?', [userId]);
  return rows;
};

exports.create = async ({
  user_id,
  dog_name,
  dog_gender,
  dog_desexed,
  is_representative,
  dog_type,
  dog_weight,
  dog_age,
  dog_char,
  dog_img,
  is_public,
}) => {
  const [result] = await db.query(
    `INSERT INTO dogs (
      user_id, dog_name, dog_gender, dog_desexed, is_representative,
      dog_type, dog_weight, dog_age, dog_char, dog_img, is_public
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user_id,
      dog_name,
      dog_gender,
      dog_desexed,
      is_representative || false,
      dog_type,
      dog_weight,
      dog_age,
      dog_char,
      dog_img,
      is_public ?? true,
    ]
  );
  return result.insertId;
};
