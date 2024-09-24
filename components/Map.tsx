import React, { useState } from "react";
import MapView, { Region } from "react-native-maps";


export interface MapProps {
  style?: any,
  region: Region,
  onRegionChangeComplete: (region: Region) => void;
  children?: React.ReactNode;
}


export default function Map({ style, region, onRegionChangeComplete, children }: MapProps) {
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
