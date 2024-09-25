import React, { useState, useRef, useEffect } from "react";
import MapView, { Region } from "react-native-maps";

export interface MapProps {
  style?: any,
  region: Region,
  onRegionChangeComplete: (region: Region) => void;
  children?: React.ReactNode;
}


export default function Map({ style, region, onRegionChangeComplete, children }: MapProps) {
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [spots, setSpots] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    fetchSpots();
  }, []);

  const fetchSpots = async () => {
    try {
      const response = await fetch(`${URL}/spots`);
      if (!response.ok) {
        throw new Error("Failed to fetch spots");
    }
    const data = await response.json();
    setSpots(data);
  } catch (error) {
    console.error("Error fetching spots:", error);
  }
  };

  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setSelectedSpot(coordinate);
    if (onLocationSelect) {
      onLocationSelect(coordinate);
    }
  };

  const handleSpotPress = (spot: any) => {
    setSelectedSpot(spot);
  };

  return (

  return (
    <MapView
      style={style}
      /* mapType="hybrid" */
      region={region}
      scrollEnabled={true}
      showsUserLocation={true}
      showsMyLocationButton={false}
      onRegionChangeComplete={onRegionChangeComplete}
    >
      {children}
    </MapView>
  );
}
