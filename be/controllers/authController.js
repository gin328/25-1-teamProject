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

  // 400: 필수 입력값 누락
  if (!email || !password || !nickname || !village || !dog_name) {
    return res.status(400).json({ message: '필수 입력값이 누락되었습니다.' });
  }

  try {
    const conn = await pool.getConnection();

    // 409: 이메일 중복 체크
    const [existingUser] = await conn.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    if (existingUser.length > 0) {
      conn.release();
      return res.status(409).json({ message: '이미 등록된 이메일입니다.' });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // users 테이블에 사용자 추가
    const [userResult] = await conn.query(
      `INSERT INTO users (email, passwd, nickname, village) VALUES (?, ?, ?, ?)`,
      [email, hashedPassword, nickname, village]
    );

    const userId = userResult.insertId;

    // dogs 테이블에 반려견 정보 추가
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

  // 400: 입력값 누락
  if (!email || !password) {
    return res.status(400).json({ message: '이메일과 비밀번호를 모두 입력하세요.' });
  }

  try {
    const conn = await pool.getConnection();

    // 사용자 조회
    const [rows] = await conn.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    if (rows.length === 0) {
      conn.release();
      return res.status(401).json({ message: '존재하지 않는 이메일입니다.' });
    }

    const user = rows[0];

    // 비밀번호 비교
    const isMatch = await bcrypt.compare(password, user.passwd);
    if (!isMatch) {
      conn.release();
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // JWT 토큰 발급
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
