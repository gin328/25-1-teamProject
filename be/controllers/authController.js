const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/index'); // DB 연결 설정
const saltRounds = 10;

// 회원가입 컨트롤러
exports.registerUser = async (req, res) => {
  const {
    email,
    password,
    nickname,
    village,
    dog_name,
    dog_gender,
    dog_desexed,
    dog_type,
    dog_weight,
    dog_age,
    dog_char
  } = req.body;

  if (!email || !password || !nickname || !village || !dog_name) {
    return res.status(400).json({ message: '필수 입력값이 누락되었습니다.' });
  }

  try {
    const conn = await pool.getConnection();

    const [existingUser] = await conn.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    if (existingUser.length > 0) {
      conn.release();
      return res.status(409).json({ message: '이미 등록된 이메일입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [userResult] = await conn.query(
      `INSERT INTO users (email, passwd, nickname, village) VALUES (?, ?, ?, ?)`,
      [email, hashedPassword, nickname, village]
    );

    const userId = userResult.insertId;

    await conn.query(
      `INSERT INTO dogs 
        (user_id, dog_name, dog_gender, dog_desexed, dog_type, dog_weight, dog_age, dog_char) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        dog_name,
        dog_gender,
        dog_desexed,
        dog_type,
        dog_weight,
        dog_age,
        dog_char
      ]
    );

    conn.release();
    return res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (err) {
    console.error('회원가입 오류:', err);
    return res.status(500).json({ message: '서버 내부 오류입니다.' });
  }
};

// 로그인 컨트롤러
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: '이메일과 비밀번호를 모두 입력하세요.' });
  }

  try {
    const conn = await pool.getConnection();

    const [rows] = await conn.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    if (rows.length === 0) {
      conn.release();
      return res.status(401).json({ message: '존재하지 않는 이메일입니다.' });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.passwd);
    if (!isMatch) {
      conn.release();
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    conn.release();
    return res.status(200).json({ message: '로그인 성공', token });
  } catch (err) {
    console.error('로그인 오류:', err);
    return res.status(500).json({ message: '서버 내부 오류입니다.' });
  }
};

// ✅ 현재 로그인한 유저 정보 조회 (지역 포함)
exports.getMyInfo = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: '토큰 없음' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const conn = await pool.getConnection();
    const [rows] = await conn.query(
      'SELECT user_id, email, nickname, village FROM users WHERE user_id = ?',
      [userId]
    );
    conn.release();

    if (rows.length === 0) {
      return res.status(404).json({ message: '사용자 정보를 찾을 수 없습니다.' });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error('유저 정보 조회 실패:', err);
    res.status(500).json({ message: '서버 오류로 사용자 정보를 불러올 수 없습니다.' });
  }
};
