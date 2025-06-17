import React, { useState, useEffect } from 'react';
import KakaoMap from '../components/Map';

const PlaceRecommendation = () => {
  const [places, setPlaces] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          setCurrentLocation({ lat: 37.5665, lng: 126.9780 }); // 서울시청
        }
      );
    } else {
      setCurrentLocation({ lat: 37.5665, lng: 126.9780 });
    }
  }, []);

  useEffect(() => {
    if (currentLocation) {
      fetchNearbyPlaces(currentLocation.lat, currentLocation.lng);
    }
  }, [currentLocation]);

  useEffect(() => {
    console.log('places:', places);
  }, [places]);

  const fetchNearbyPlaces = async (lat, lng) => {
    try {
      const response = await fetch(
        `/places/nearby?lat=${lat}&lng=${lng}&radius=2`
      );
      const data = await response.json();
      setPlaces(data);
    } catch (error) {
      console.error('Error fetching nearby places:', error);
    }
  };

  return (
    <div>
      <h2>위치 기반 반려견 동반 장소 추천</h2>
      <KakaoMap places={places} center={currentLocation} />
      <pre>{JSON.stringify(places, null, 2)}</pre>
    </div>
  );
};

export default PlaceRecommendation;