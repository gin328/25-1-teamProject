require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// 라우터 등록
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');
const commentRoutes = require('./routes/commentRoutes');
const placeRoutes = require('./routes/place');

app.use('/auth', authRoutes);
app.use('/articles', articleRoutes);
app.use('/api/comments', commentRoutes);
app.use('/places', placeRoutes);

app.get('/', (req, res) => {
  res.send('서버 정상 작동 중!');
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});


