import { useState, useEffect, useRef } from "react";
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

const POI_ICONS = {
  hotel: "🏨",
  attraction: "🎢",
  icon: "⭐",
  fireworks: "🎆",
  transportation: "🚊",
  "golf course": "⛳",
  pavilion: "🎪",
  "water slide": "🌊",
  stageshow: "🎭",
};

/**
 * MarkersWithClustering Component
 * Handles the logic of grouping markers together.
 */
const MarkersWithClustering = ({ pois, onMarkerClick }) => {
  const map = useMap();
  const clusterer = useRef(null);
  const markerInstances = useRef({});
  const [markersLoaded, setMarkersLoaded] = useState(0);

  // 1. Initialize Clusterer
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  // 2. Sync Clusterer whenever markers are added or filtered
  useEffect(() => {
    if (!clusterer.current) return;

    const currentMarkers = Object.values(markerInstances.current);

    // Clear and re-add
    clusterer.current.clearMarkers();
    clusterer.current.addMarkers(currentMarkers);

    // Force the clusterer to recalculate and draw
    clusterer.current.render();
  }, [pois, markersLoaded]);

  // 3. Ref Callback Logic
  const setMarkerRef = (marker, key) => {
    if (marker) {
      if (markerInstances.current[key]) return; // Prevent loop
      markerInstances.current[key] = marker;

      // Update count to trigger the clusterer effect once all are in
      setMarkersLoaded((prev) => prev + 1);
    } else {
      if (markerInstances.current[key]) {
        markerInstances.current[key].map = null;
        delete markerInstances.current[key];
        setMarkersLoaded((prev) => Math.max(0, prev - 1));
      }
    }
  };

  return (
    <>
      {pois.map((poi, index) => {
        const key = `${poi["Points of Interest"]}-${index}`;
        const typeStr = poi["Type of Interest"].toLowerCase();
        const iconKey = Object.keys(POI_ICONS).find((k) => typeStr.includes(k));
        const emoji = POI_ICONS[iconKey];

        return (
          <AdvancedMarker
            key={key}
            position={{ lat: poi.Latitude, lng: poi.Longitude }}
            ref={(el) => setMarkerRef(el, key)}
            onClick={() => onMarkerClick(poi)}
          >
            {emoji ? (
              <div style={{ fontSize: "24px", transform: "translateY(-50%)" }}>
                {emoji}
              </div>
            ) : (
              <Pin
                background="#800080"
                borderColor="#ffffff"
                glyphColor="#ffffff"
              />
            )}
          </AdvancedMarker>
        );
      })}
    </>
  );
};

const DisneyMapContent = observer(() => {
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [showIcons, setShowIcons] = useState(true);
  const [showAttractions, setShowAttractions] = useState(true);
  const [showHotels, setShowHotels] = useState(true);

  const filteredPois = pois.filter(
    (poi) =>
      (showIcons && poi["Type of Interest"].toLowerCase().includes("icon")) ||
      (showAttractions &&
        poi["Type of Interest"].toLowerCase().includes("attraction")) ||
      (showHotels && poi["Type of Interest"].toLowerCase().includes("hotel")),
  );

  return (
    <Container>
      {/* UI Overlay */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 1,
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Filter Checkboxes */}

        <input
          type="checkbox"
          id="iconsFilter"
          checked={showIcons}
          onChange={(e) => setShowIcons(e.target.checked)}
          style={{ cursor: "pointer" }}
        />
        <label htmlFor="iconsFilter" style={{ cursor: "pointer" }}>
          Icons
        </label>

        <input
          type="checkbox"
          id="attractionsFilter"
          checked={showAttractions}
          onChange={(e) => setShowAttractions(e.target.checked)}
          style={{ cursor: "pointer" }}
        />
        <label htmlFor="attractionsFilter" style={{ cursor: "pointer" }}>
          Attractions
        </label>

        <input
          type="checkbox"
          id="hotelFilter"
          checked={showHotels}
          onChange={(e) => setShowHotels(e.target.checked)}
          style={{ cursor: "pointer" }}
        />
        <label htmlFor="hotelFilter" style={{ cursor: "pointer" }}>
          Hotels
        </label>
      </div>

      {/* Map Component */}

      <Map
        mapId={"29abc80053f0980f9e4443b2"}
        defaultZoom={15}
        minZoom={13}
        maxZoom={20}
        defaultCenter={{ lat: 28.419411, lng: -81.5812 }}
      >
        <MarkersWithClustering
          pois={filteredPois}
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
              <h3>{selectedPoi["Points of Interest"]}</h3>
              <div>{selectedPoi["Theme Park or Location"]}</div>
              <div>{selectedPoi["Area within Location"]}</div>
              <div>{selectedPoi["Type of Interest"]}</div>
            </div>
          </InfoWindow>
        )}
      </Map>
    </Container>
  );
});

/**
 * Main DisneyMapModule
 */
const DisneyMapModule = observer(() => {
  return (
    <Container>
      <APIProvider
        apiKey={"AIzaSyC302MUF9oeVaXLuVzIv-YCoLaX80r-9uc"}
        onLoad={() => console.log("Maps API has loaded.")}
      >
        <DisneyMapContent />
      </APIProvider>
    </Container>
  );
});

export default DisneyMapModule;
