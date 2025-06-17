import { useState, useEffect } from 'react'
import {
  AppBar, Tabs, Tab, Box, Typography, TextField, Button, Alert, Card, CardContent, CardActions, Avatar, Stack, Container, Paper, List, ListItem, ListItemAvatar, ListItemText, Divider, IconButton, InputAdornment, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel
} from '@mui/material'
import PetsIcon from '@mui/icons-material/Pets'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import KakaoMap from './components/Map'


const API_BASE = 'http://localhost:3000'

function TabPanel(props) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

export default function App() {
  const [tab, setTab] = useState(0)
  const [registerData, setRegisterData] = useState({
    email: '', password: '', nickname: '', village: '', dog_name: '', dog_gender: '', dog_desexed: false, dog_type: '', dog_weight: '', dog_age: '', dog_char: ''
  })
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [loginError, setLoginError] = useState('')
  const [registerError, setRegisterError] = useState('')
  const [location, setLocation] = useState(null)
  const [places, setPlaces] = useState([])
  const [placeError, setPlaceError] = useState('')
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null)
  const [showLoginPw, setShowLoginPw] = useState(false)
  const [showRegisterPw, setShowRegisterPw] = useState(false)

  // 회원가입 핸들러
  const handleRegister = async (e) => {
    e.preventDefault()
    setRegisterError('')
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || '회원가입 실패')
      setTab(0)
      setRegisterData({ email: '', password: '', nickname: '', village: '', dog_name: '', dog_gender: '', dog_desexed: false, dog_type: '', dog_weight: '', dog_age: '', dog_char: '' })
      alert('회원가입 성공! 이제 로그인 해주세요.')
    } catch (err) {
      setRegisterError(err.message)
    }
  }

  // 로그인 핸들러
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || '로그인 실패')
      setToken(data.token)
      setUser({ email: loginData.email })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify({ email: loginData.email }))
      setTab(2)
    } catch (err) {
      setLoginError(err.message)
    }
  }

  // 위치 기반 장소 추천 핸들러
  const handlePlaceSearch = async (e) => {
    e && e.preventDefault();
    setPlaceError('');
    setPlaces([]);
    if (!location || !location.lat || !location.lng) return; // lat/lng 없으면 요청 X
    try {
      const params = `lat=${location.lat}&lng=${location.lng}&radius=${location.radius}`;
      const res = await fetch(`${API_BASE}/places/nearby?${params}`);
      const data = await res.json();
      setPlaces(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setPlaceError(err.message);
    }
  }
  useEffect(() => {
    console.log('places 상태 변경:', places, '타입:', typeof places, Array.isArray(places));
  }, [places]);

  // 위치 자동 입력(브라우저 geolocation) + 자동 장소 추천
  const handleGetLocation = () => {
    console.log('handleGetLocation 호출됨');
    if (!navigator.geolocation) {
      alert('브라우저가 위치 정보를 지원하지 않습니다.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log('geolocation 성공', pos.coords);
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, radius: 2 });
        setTimeout(() => handlePlaceSearch(new Event('submit')), 100);
      },
      (err) => {
        console.log('geolocation 실패', err);
        alert('위치 정보를 가져올 수 없습니다.');
      }
    );
  }

  const handleLogout = () => {
    setToken('')
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setTab(0)
  }

  return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#E3F2FD',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 3,
            minHeight: 600,
            minWidth: 350,
            maxWidth: 500,
            width: '100%',
            margin: 'auto',
            boxShadow: '0 4px 24px 0 #b3e5fc33',
            bgcolor: '#fff'
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Avatar sx={{ bgcolor: '#E3F2FD', color: '#1976d2' }}>
              <PetsIcon sx={{ color: '#1976d2' }} />
            </Avatar>
            <Typography variant="h5" fontWeight={700} color="#1976d2">
              도그뮤티
            </Typography>
          </Stack>
          <AppBar position="static" color="default" sx={{ borderRadius: 2, boxShadow: 0, mb: 2, bgcolor: '#E3F2FD' }}>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="community tabs"
              TabIndicatorProps={{ style: { background: '#E3F2FD', height: 4, borderRadius: 2 } }}
            >
              <Tab label="로그인" sx={{ color: '#222', fontWeight: 600 }} />
              <Tab label="회원가입" sx={{ color: '#222', fontWeight: 600 }} />
              <Tab label="장소 추천" disabled={!token} sx={{ color: '#222', fontWeight: 600 }} />
            </Tabs>
          </AppBar>
          <TabPanel value={tab} index={0}>
            <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6" color="#222">로그인</Typography>
              <TextField label="이메일" required value={loginData.email} onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                InputLabelProps={{ style: { color: '#222' } }}
                inputProps={{ style: { color: '#222' } }}
                sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#222' }, backgroundColor: '#fff' } }}
                InputProps={{ sx: { backgroundColor: '#fff' } }}
              />
              <TextField label="비밀번호" type={showLoginPw ? 'text' : 'password'} required value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                InputLabelProps={{ style: { color: '#222' } }}
                inputProps={{ style: { color: '#222' } }}
                sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#222' }, backgroundColor: '#fff' } }}
                InputProps={{
                  sx: { backgroundColor: '#fff' },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowLoginPw(v => !v)} edge="end" tabIndex={-1}>
                        {showLoginPw ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <Button type="submit" variant="contained" sx={{ bgcolor: '#E3F2FD', color: '#222', fontWeight: 700, '&:hover': { bgcolor: '#b3e5fc' } }}>로그인</Button>
              {loginError && <Alert severity="error">{loginError}</Alert>}
            </Box>
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6" color="#222">회원가입</Typography>
              <TextField label="이메일" required value={registerData.email} onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
                InputLabelProps={{ style: { color: '#222' } }}
                inputProps={{ style: { color: '#222' } }}
                sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#222' }, backgroundColor: '#fff' } }}
                InputProps={{ sx: { backgroundColor: '#fff' } }}
              />
              <TextField label="비밀번호" type={showRegisterPw ? 'text' : 'password'} required value={registerData.password} onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
                InputLabelProps={{ style: { color: '#222' } }}
                inputProps={{ style: { color: '#222' } }}
                sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#222' }, backgroundColor: '#fff' } }}
                InputProps={{
                  sx: { backgroundColor: '#fff' },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowRegisterPw(v => !v)} edge="end" tabIndex={-1}>
                        {showRegisterPw ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <TextField label="닉네임" required value={registerData.nickname} onChange={e => setRegisterData({ ...registerData, nickname: e.target.value })}
                InputLabelProps={{ style: { color: '#222' } }}
                inputProps={{ style: { color: '#222' } }}
                sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#222' }, backgroundColor: '#fff' } }}
                InputProps={{ sx: { backgroundColor: '#fff' } }}
              />
              <TextField label="동네(시/구)" required value={registerData.village} onChange={e => setRegisterData({ ...registerData, village: e.target.value })}
                InputLabelProps={{ style: { color: '#222' } }}
                inputProps={{ style: { color: '#222' } }}
                sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#222' }, backgroundColor: '#fff' } }}
                InputProps={{ sx: { backgroundColor: '#fff' } }}
              />
              <TextField label="반려견 이름" required value={registerData.dog_name} onChange={e => setRegisterData({ ...registerData, dog_name: e.target.value })}
                InputLabelProps={{ style: { color: '#222' } }}
                inputProps={{ style: { color: '#222' } }}
                sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#222' }, backgroundColor: '#fff' } }}
                InputProps={{ sx: { backgroundColor: '#fff' } }}
              />
              <TextField label="반려견 성별" value={registerData.dog_gender} onChange={e => setRegisterData({ ...registerData, dog_gender: e.target.value })}
                InputLabelProps={{ style: { color: '#222' } }}
                inputProps={{ style: { color: '#222' } }}
                sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#222' }, backgroundColor: '#fff' } }}
                InputProps={{ sx: { backgroundColor: '#fff' } }}
              />
              <FormControl sx={{ my: 1 }}>
                <FormLabel sx={{ color: '#222', mb: 1 }}>중성화 여부</FormLabel>
                <RadioGroup
                  row
                  value={registerData.dog_desexed}
                  onChange={e => setRegisterData({ ...registerData, dog_desexed: Number(e.target.value) })}
                >
                  <FormControlLabel value={1} control={<Radio sx={{ color: '#222', '&.Mui-checked': { color: '#222' } }} />} label="예" sx={{ color: '#222' }} />
                  <FormControlLabel value={0} control={<Radio sx={{ color: '#222', '&.Mui-checked': { color: '#222' } }} />} label="아니요" sx={{ color: '#222' }} />
                </RadioGroup>
              </FormControl>
              <TextField label="견종" value={registerData.dog_type} onChange={e => setRegisterData({ ...registerData, dog_type: e.target.value })}
                InputLabelProps={{ style: { color: '#222' } }}
                inputProps={{ style: { color: '#222' } }}
                sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#222' }, backgroundColor: '#fff' } }}
                InputProps={{ sx: { backgroundColor: '#fff' } }}
              />
              <TextField label="체중(kg)" value={registerData.dog_weight} onChange={e => setRegisterData({ ...registerData, dog_weight: e.target.value })}
                InputLabelProps={{ style: { color: '#222' } }}
                inputProps={{ style: { color: '#222' } }}
                sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#222' }, backgroundColor: '#fff' } }}
                InputProps={{ sx: { backgroundColor: '#fff' } }}
              />
              <TextField label="나이" value={registerData.dog_age} onChange={e => setRegisterData({ ...registerData, dog_age: e.target.value })}
                InputLabelProps={{ style: { color: '#222' } }}
                inputProps={{ style: { color: '#222' } }}
                sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#222' }, backgroundColor: '#fff' } }}
                InputProps={{ sx: { backgroundColor: '#fff' } }}
              />
              <TextField label="성격" value={registerData.dog_char} onChange={e => setRegisterData({ ...registerData, dog_char: e.target.value })}
                InputLabelProps={{ style: { color: '#222' } }}
                inputProps={{ style: { color: '#222' } }}
                sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#222' }, backgroundColor: '#fff' } }}
                InputProps={{ sx: { backgroundColor: '#fff' } }}
              />
              <Button type="submit" variant="contained" sx={{ bgcolor: '#E3F2FD', color: '#222', fontWeight: 700, '&:hover': { bgcolor: '#b3e5fc' } }}>회원가입</Button>
              {registerError && <Alert severity="error">{registerError}</Alert>}
            </Box>
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" color="#222">위치 기반 반려견 동반 장소 추천</Typography>
              {user && <Button onClick={handleLogout} sx={{ color: '#222', fontWeight: 600 }}>로그아웃</Button>}
            </Box>
            <Box component="form" onSubmit={handlePlaceSearch} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
              <Button variant="outlined" sx={{ borderColor: '#E3F2FD', color: '#222', fontWeight: 700, '&:hover': { borderColor: '#b3e5fc', bgcolor: '#f5f6fa' } }} onClick={handleGetLocation}>내 위치로 장소 추천</Button>
            </Box>
            <Box sx={{ mb: 2, height: '400px' }}>
              <KakaoMap
                places={Array.isArray(places) ? places : []}
                center={
                  location && location.lat && location.lng
                    ? { lat: parseFloat(location.lat), lng: parseFloat(location.lng) }
                    : { lat: 37.5665, lng: 126.9780 }
                }
              />
            </Box>
            {placeError && <Alert severity="error">{placeError}</Alert>}
            <List>
              {places.map(place => (
                <div key={place.place_id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#E3F2FD', color: '#222' }}><PetsIcon /></Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<b style={{ color: '#222' }}>{place.name}</b>}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="#222">
                            {place.community_type} | {place.address}
                          </Typography><br />
                          <span style={{ color: '#222' }}>거리: {place.distance?.toFixed(2)}km | 평점: {place.average_score} | 조건: {place.condition || (place.need_leashes === 1 ? '목줄 필수' : '목줄 선택')}</span>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </div>
              ))}
            </List>
            {places.length === 0 && <Typography color="#222">추천 장소가 없습니다.</Typography>}
          </TabPanel>
        </Paper>
      </Box>
  )
}
