const db = require('../db');

const Place = {
  // 반경 내 장소 조회 (단위: km)
  findNearby: async (lat, lng, radius) => {
    const conn = await db.getConnection();
    try {
      const query = `
        SELECT *, (
          6371 * acos(
            cos(radians(?)) *
            cos(radians(lat)) *
            cos(radians(lng) - radians(?)) +
            sin(radians(?)) *
            sin(radians(lat))
          )
        ) AS distance
        FROM place
        HAVING distance < ?
        ORDER BY distance
        LIMIT 50;
      `;
      const [rows] = await conn.query(query, [lat, lng, lat, radius]);
      return rows;
    } finally {
      conn.release();
    }
  }
};

module.exports = Place; 