const Place = require('../models/place');

const placeController = {
  // GET /places/nearby?lat=...&lng=...&radius=...
  getNearbyPlaces: async (req, res) => {
    const { lat, lng, radius } = req.query;
    if (!lat || !lng || !radius) {
      return res.status(400).json({ message: 'lat, lng, radius 쿼리 파라미터가 필요합니다.' });
    }
    try {
      const places = await Place.findNearby(Number(lat), Number(lng), Number(radius));
      res.json(places);
    } catch (err) {
      console.error('근처 장소 조회 오류:', err);
      res.status(500).json({ message: '서버 내부 오류입니다.' });
    }
  }
};

module.exports = placeController; 