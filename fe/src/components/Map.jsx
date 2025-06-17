import React from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

const KakaoMap = ({ places, center }) => {
  console.log('KakaoMap 렌더링', { places, center });
  return (
    <Map
      center={center || { lat: 37.5665, lng: 126.9780 }}
      style={{ width: '100%', height: '400px' }}
      level={3}
    >
      {places && places.map(place => {
        const lat = Number(place.lat);
        const lng = Number(place.lng);
        console.log('마커 위치:', lat, lng, place);
        if (isNaN(lat) || isNaN(lng)) {
          console.error('Invalid coordinates:', place);
          return null;
        }
        return (
          <MapMarker
            key={place.place_id}
            position={{ lat, lng }}
            title={place.name}
          />
        );
      })}
    </Map>
  );
};

export default KakaoMap;

