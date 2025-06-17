import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import KakaoMap from '../components/Map';
// ... existing imports ...

const PlaceRecommendation = () => {
  const [places, setPlaces] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  // ... existing state ...

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          // 위치 정보 못 가져오면 기본값(서울시청) 사용
          setCurrentLocation({ lat: 37.5665, lng: 126.9780 });
        }
      );
    } else {
      setCurrentLocation({ lat: 37.5665, lng: 126.9780 });
    }
  }, []);

  useEffect(() => {
    if (currentLocation) {
      console.log('currentLocation:', currentLocation);
      fetchNearbyPlaces(currentLocation.lat, currentLocation.lng);
    }
  }, [currentLocation]);

  useEffect(() => {
    console.log('places:', places);
  }, [places]);

  const fetchNearbyPlaces = async (lat, lng) => {
    try {
      const response = await fetch(`http://localhost:3000/places/nearby?lat=${lat}&lng=${lng}&radius=2`);
      const data = await response.json();
      setPlaces(data);
    } catch (error) {
      console.error('Error fetching nearby places:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          주변 반려동물 동반 장소
        </Typography>
        
        {/* 지도 표시 */}
        <Box sx={{ mb: 4 }}>
          <KakaoMap 
            places={places} 
            center={currentLocation}
          />
          <pre>{JSON.stringify(places, null, 2)}</pre>
        </Box>

        {/* 기존 장소 목록 */}
        <Box sx={{ mt: 4 }}>
          {/* ... existing place list code ... */}
        </Box>
      </Box>
    </Container>
  );
};

export default PlaceRecommendation; 