import React, { useState, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { Container } from "./DisneyMapModule.styled";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer, Marker } from "@googlemaps/markerclusterer";
import pois from "../../pois.json";

/**
 * MarkersWithClustering Component
 * Handles the logic of grouping markers together.
 */
const MarkersWithClustering = ({ pois, onMarkerClick }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  // Initialize MarkerClusterer
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  // Update clusters when markers change
  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const next = { ...prev };
        delete next[key];
        return next;
      }
    });
  };

  return (
    <>
      {pois.map((poi, index) => {
        const key = `${poi["Points of Interest"]}-${index}`;
        return (
          <AdvancedMarker
            key={key}
            position={{ lat: poi.Latitude, lng: poi.Longitude }}
            ref={(marker) => setMarkerRef(marker, key)}
            onClick={() => onMarkerClick(poi)}
          >
            {poi["Type of Interest"].toLowerCase().includes("hotel") ? (
              <div style={{ fontSize: "24px", transform: "translateY(-50%)" }}>
                🏨
              </div>
            ) : poi["Type of Interest"].toLowerCase().includes("attraction") ? (
              <div style={{ fontSize: "24px", transform: "translateY(-50%)" }}>
                🎢
              </div>
            ) : poi["Type of Interest"].toLowerCase().includes("icon") ? (
              <div style={{ fontSize: "24px", transform: "translateY(-50%)" }}>
                ⭐
              </div>
            ) : poi["Type of Interest"].toLowerCase().includes("fireworks") ? (
              <div style={{ fontSize: "24px", transform: "translateY(-50%)" }}>
                🎆
              </div>
            ) : poi["Type of Interest"]
                .toLowerCase()
                .includes("transportation") ? (
              <div style={{ fontSize: "24px", transform: "translateY(-50%)" }}>
                🚊
              </div>
            ) : poi["Type of Interest"]
                .toLowerCase()
                .includes("golf course") ? (
              <div style={{ fontSize: "24px", transform: "translateY(-50%)" }}>
                ⛳
              </div>
            ) : poi["Type of Interest"].toLowerCase().includes("pavilion") ? (
              <div style={{ fontSize: "24px", transform: "translateY(-50%)" }}>
                🎪
              </div>
            ) : poi["Type of Interest"]
                .toLowerCase()
                .includes("water slide") ? (
              <div style={{ fontSize: "24px", transform: "translateY(-50%)" }}>
                🌊
              </div>
            ) : poi["Type of Interest"].toLowerCase().includes("stageshow") ? (
              <div style={{ fontSize: "24px", transform: "translateY(-50%)" }}>
                🎭
              </div>
            ) : (
              <Pin
                background={"#800080"}
                borderColor={"#ffffff"}
                glyphColor={"#ffffff"}
              />
            )}
          </AdvancedMarker>
        );
      })}
    </>
  );
};

/**
 * Main DisneyMapModule
 */
const DisneyMapModule = observer(() => {
  const [selectedPoi, setSelectedPoi] = useState(null);

  return (
    <Container>
      <APIProvider
        apiKey={"AIzaSyC302MUF9oeVaXLuVzIv-YCoLaX80r-9uc"}
        onLoad={() => console.log("Maps API has loaded.")}
      >
        <Map
          mapId={"29abc80053f0980f9e4443b2"}
          defaultZoom={15}
          minZoom={13}
          maxZoom={20}
          defaultCenter={{ lat: 28.419411, lng: -81.5812 }}
          restriction={{
            latLngBounds: {
              north: 28.44,
              south: 28.32,
              east: -81.4,
              west: -81.7,
            },
            strictBounds: false, // Set to true to physically stop the camera from leaving
          }}
        >
          {/* Use the new Clustering component here */}
          <MarkersWithClustering
            pois={pois}
            onMarkerClick={(poi) => setSelectedPoi(poi)}
          />

          {selectedPoi && (
            <InfoWindow
              position={{
                lat: selectedPoi.Latitude,
                lng: selectedPoi.Longitude,
              }}
              onCloseClick={() => setSelectedPoi(null)}
            >
              <div style={{ color: "#000" }}>
                <h3 style={{ margin: 0 }}>
                  {selectedPoi["Points of Interest"]}
                </h3>
                <p style={{ margin: "5px 0" }}>
                  {selectedPoi["Theme Park or Location"]}
                </p>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </Container>
  );
});

export default DisneyMapModule;
