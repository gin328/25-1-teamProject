import React, { useEffect, useState } from 'react';
import { MapContainer, MapMarker, MarkerClusterer } from 'react-kakao-maps-sdk';

const KakaoMap = ({ places, center }) => {
  const [map, setMap] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    // 현재 위치 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  return (
    <MapContainer
      center={center || { lat: 37.5665, lng: 126.9780 }} // 기본값: 서울시청
      style={{ width: '100%', height: '500px' }}
      level={3}
      onCreate={setMap}
    >
      {/* 현재 위치 마커 */}
      {currentLocation && (
        <MapMarker
          position={currentLocation}
          image={{
            src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
            size: { width: 24, height: 35 },
          }}
        />
      )}

      {/* 장소 마커들 */}
      <MarkerClusterer
        averageCenter={true}
        minLevel={6}
      >
        {places.map((place) => (
          <MapMarker
            key={place.id}
            position={{ lat: place.lat, lng: place.lng }}
            title={place.name}
            image={{
              src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerBlue.png',
              size: { width: 24, height: 35 },
            }}
          />
        ))}
      </MarkerClusterer>
    </MapContainer>
  );
};

export default KakaoMap; 