const Dog = require('../models/dogModel');

// GET /api/dogs?user_id=8
exports.getDogsByUser = async (req, res) => {
  const userId = req.query.user_id;
  if (!userId) {
    return res.status(400).json({ error: 'user_id가 필요합니다.' });
  }

  try {
    const dogs = await Dog.findByUserId(userId);
    res.json(dogs);
  } catch (err) {
    console.error('반려견 조회 실패:', err);
    res.status(500).json({ error: '반려견 조회 실패' });
  }
};

// POST /api/dogs
exports.createDog = async (req, res) => {
  const {
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
  } = req.body;

  try {
    const dogId = await Dog.create({
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
    });
    res.status(201).json({ message: '반려견 등록 완료', dog_id: dogId });
  } catch (err) {
    console.error('반려견 등록 실패:', err);
    res.status(500).json({ error: '반려견 등록 실패' });
  }
};
