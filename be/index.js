require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const commentRoutes = require('./routes/commentRoutes');
const cors = require('cors');
const commentReactionRoutes = require('./routes/commentReactions');


app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우터 등록
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');

app.use('/auth', authRoutes);
app.use('/articles', articleRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/comment-reactions', commentReactionRoutes);


app.get('/', (req, res) => {
  res.send('서버 정상 작동 중!');
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});


