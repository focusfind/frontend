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
    const response = await fetch("${URL}/spots");
    const data = await response.json();
    setSpots(data);
  };

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
