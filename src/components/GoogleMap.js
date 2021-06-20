import { Loader } from '@googlemaps/js-api-loader';
import styled from 'styled-components';

const GoogleMap = () => {
  let map, infoWindow;

  const mapOptions = {
    center: {
      lat: 51.509865,
      lng: -0.118092,
    },
    zoom: 11,
    // mapTypeId: 'roadmap',
    gestureHandling: 'greedy',
  };

  const loader = new Loader({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    version: 'weekly',
    libraries: ['places'],
  });

  loader
    .load()
    .then((google) => {
      map = new google.maps.Map(document.getElementById('map'), mapOptions);

      infoWindow = new google.maps.InfoWindow();

      let placesService = new google.maps.places.PlacesService(map);

      map.addListener('click', (event) => {
        if (event.placeId) {
          //   event.stop();
          placesService.getDetails(
            { placeId: event.placeId },
            (place, status) => {
              console.log(place);
            }
          );
        }
      });

      const input = document.getElementById('location-input');
      const searchBox = new google.maps.places.SearchBox(input);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
      // Bias the SearchBox results towards current map's viewport.
      map.addListener('bounds_changed', () => {
        searchBox.setBounds(map.getBounds());
      });
      let markers = [];

      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();

        if (places.length === 0) {
          return;
        }
        markers.forEach((marker) => {
          marker.setMap(null);
        });
        markers = [];
        const bounds = new google.maps.LatLngBounds();
        places.forEach((place) => {
          if (!place.geometry || !place.geometry.location) {
            console.log('Returned place contains no geometry');
            return;
          }
          const icon = {
            url: place.icon,
            size: new google.maps.Size(30, 30),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25),
          };
          markers.push(
            new google.maps.Marker({
              map,
              icon,
              title: place.name,
              position: place.geometry.location,
            })
          );

          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });
    })
    .catch((e) => {
      console.error(e);
    });

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          infoWindow.setPosition(pos);
          //   infoWindow.setContent('Your location');
          //   infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        },
        { timeout: 10000 }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(
        browserHasGeolocation
          ? 'Error: Geolocation service failed.'
          : "Error: Your browser doesn't support geolocation."
      );
      infoWindow.open(map);
    }
  };

  return (
    <MapContainer>
      <MapWrapper id='map' />
      <LocationInput
        onClick={(e) => (e.target.value = '')}
        autoFocus
        id='location-input'
      />
      <GoToMyLocationButton onClick={handleGetLocation}>
        Go to my area
      </GoToMyLocationButton>
    </MapContainer>
  );
};

export default GoogleMap;

const MapContainer = styled.div``;

const MapWrapper = styled.div`
  height: 600px;
  width: 600px;
`;

const LocationInput = styled.input`
  outline: none;
`;

const GoToMyLocationButton = styled.button``;
