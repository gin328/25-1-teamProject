require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

// 라우터 불러오기
const commentRoutes = require('./routes/commentRoutes');
const commentReactionRoutes = require('./routes/commentReactions');
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');
const articleReactRouter = require('./routes/articleReact');
const dogRoutes = require('./routes/dogs');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/articles/:articleId/reactions', articleReactRouter);
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/comment-reactions', commentReactionRoutes);
app.use('/api/dogs', dogRoutes);

app.get('/', (req, res) => {
  res.send('서버 정상 작동 중!');
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
