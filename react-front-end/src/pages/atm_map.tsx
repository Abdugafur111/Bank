import Heading from "../components/Heading";
import React, { useState } from "react";
import {
  GoogleMap,
  Autocomplete,
  useJsApiLoader,
  Marker,
} from "@react-google-maps/api";

import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import "../CSS/renderMap.css";
import Locations from "../interfaces/locations";

const ATM_Map = () => {
  const [map, setMap] = useState<google.maps.Map>();
  const [lat, setLat] = useState<number>(37.338207);
  const [lng, setLng] = useState<number>(-121.88633);
  const [locations, setLocations] = useState<Locations[]>([]);
  const [address, setAddress] = useState<string>("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyClqDksKQNGEfh-S74_V9thhNuUtmZ9i28",
    libraries: ["places", "geometry"],
  });

  if (!isLoaded) {
    return <Skeleton variant="rectangular" width={210} height={118} />;
  }

  const componentDidMount = async () => {
    try {
      const pos: { coords: { longitude: number; latitude: number } } =
        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

      return {
        long: pos.coords.longitude,
        lat: pos.coords.latitude,
      };
    } catch (error) {
      return null;
    }
  };

  const useCurrentLocation = async () => {
    const pos = await componentDidMount();

    if (pos) {
      setLat(pos.lat);
      setLng(pos.long);
    }
  };

  const loadMap = async (map: google.maps.Map, lat: number, lng: number) => {
    setMap(map);

    const center = {
      lat: lat,
      lng: lng,
    };
    console.log(center);
    const request = {
      location: center,
      radius: 10,
      query: "Chase ATM",
    };
    const service = new google.maps.places.PlacesService(
      map as google.maps.Map
    );
    service.textSearch(request, callback);

    function callback(
      results: google.maps.places.PlaceResult[] | null,
      status: google.maps.places.PlacesServiceStatus
    ) {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const newLocations: Locations[] = [];
        for (let i = 0; i < results.length; i++) {
          const name = results[i].formatted_address;
          const location = results[i].geometry?.location;
          if (location) {
            newLocations.push({
              name: name as string,
              location: {
                lat: location.lat(),
                lng: location.lng(),
              },
            });
          }
        }
        setLocations(newLocations);
        console.log(newLocations);
      }
    }
  };

  const handleSearchedLocation = (event: React.FormEvent, location: string) => {
    event.preventDefault();
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: location }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const newLat = results[0].geometry.location.lat();
        const newLng = results[0].geometry.location.lng();
        setLat(newLat);
        console.log(newLat);
        setLng(newLng);
        console.log(newLng);
        map?.setCenter({ lat: newLat, lng: newLng });
        map?.setZoom(12);
        console.log(lat, lng);
        setLocations([]);
        loadMap(map as google.maps.Map, newLat, newLng);
      } 
    });
  };

  return (
    <>
      <Heading headingName="ATM Map" />

      <Box
        sx={{
          height: "50vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          mt: 4, pb: 4,
          p: 2,
        }}
      >
        <Container>
          <Box
            component={"form"}
            onSubmit={(e: React.FormEvent) => {
              handleSearchedLocation(
                e,
                (e.currentTarget as HTMLFormElement)["searchedLocationField"]
                  .value
              );
            }}
          >
            <Grid
              container
              gap="2"
              sx={{
                minWidth: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Grid item xs={8}>
                <Autocomplete>
                  <TextField
                    autoFocus
                    id="searchedLocationField"
                    name="searchedLocationField"
                    sx={{
                      border: "2px solid purple",
                      borderRadius: "5px",
                      width: "100%",
                    }}
                  >
                    Location
                  </TextField>
                </Autocomplete>
              </Grid>
              <Grid item xs={4}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Button type="submit" size="large" variant="contained">
                    Submit
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <GoogleMap
            mapContainerClassName="map-container"
            center={lat && lng ? { lat: lat, lng: lng } : undefined}
            zoom={12}
            onLoad={(map) => {
              useCurrentLocation();
              loadMap(map, lat, lng);
            }}
            //remove street view
            options={{
              streetViewControl: false,
              fullscreenControl: false,
              mapTypeControl: false,
              zoomControl: false,
            }}
          >
            {locations.map((location) => (
              <Marker
                key={location.name}
                position={{
                  lat: location.location.lat,
                  lng: location.location.lng,
                }}
                onClick={() => {
                  console.log(location.name);
                  setAddress(location.name);
                }}
              />
            ))}
          </GoogleMap>
          <Typography variant="h5" sx={{ mt: 2, textAlign: "center" }}>
            {address}
          </Typography>

          
            
          
        </Container>
      </Box>
      
    </>
  );
};

export default ATM_Map;
