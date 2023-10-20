import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LocationsStyles.css';

const Locations = () => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locationInfo, setLocationInfo] = useState('');
  const [map, setMap] = useState(null);

  const apiKey = 'AIzaSyDeAtQ_8ji3u9sP0RMH7VLGHNsb9RlLMng';
  

  useEffect(() => {
    loadMap();
  }, []);

  const loadMap = () => {
    if (window.google) {
      const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 },
        zoom: 2,
      });

      setMap(mapInstance);
    } else {
      console.error('Google Maps API not loaded.');
    }
  };

  const fetchLocationInfo = async () => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );
      const data = response.data;

      if (data.status === 'OK') {
        const results = data.results;
        if (results.length > 0) {
          const addressComponents = results[0].address_components;
          const city = addressComponents.find((component) =>
            component.types.includes('locality')
          );
          const state = addressComponents.find((component) =>
            component.types.includes('administrative_area_level_1')
          );

          if (city && state) {
            setLocationInfo(`City: ${city.long_name}, State: ${state.short_name}`);
            console.log(city, state);

    
            if (map) {
              const location = results[0].geometry.location;
              map.panTo(location);

              new window.google.maps.Marker({
                position: location,
                map: map,
                title: `City: ${city.long_name}, State: ${state.short_name}`,
              });
            }
          } else {
            setLocationInfo('City and/or State information not found.');
          }
        } else {
          setLocationInfo('No results found.');
        }
      } else {
        setLocationInfo('Geocoding API request failed.');
      }
    } catch (error) {
      console.error('Error   data:', error);
    }
  };

  return (
    <div className="container">
      <div>
        <h1>Location Info</h1>
        <div>
          <label>Latitude: </label>
          <input type="text" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
        </div>
        <div>
          <label>Longitude: </label>
          <input type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
        </div>
        <button onClick={fetchLocationInfo}>Get Location Info</button>
        <div>{locationInfo}</div>
      </div>
      <div id="map" style={{ height: '300px', marginTop: '20px' }}></div>
    </div>
  );
};

export default Locations;
