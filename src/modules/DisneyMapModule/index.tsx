import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { Container, MarkerContainer } from "./DisneyMapModule.styled";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer, DefaultRenderer } from "@googlemaps/markerclusterer";
import pois from "../../pois.json";

const DISNEY_COLORS = {
  small: "#0063be",
  medium: "#002147",
  large: "#eb0028",
};

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
 * Custom Renderer to apply Disney styling
 */
const disneyRenderer = {
  render: ({
    count,
    position,
  }: {
    count: number;
    position: google.maps.LatLng;
  }) => {
    // Determine color based on cluster size
    let color = DISNEY_COLORS.small;
    if (count > 10) color = DISNEY_COLORS.medium;
    if (count > 50) color = DISNEY_COLORS.large;

    // Create the SVG
    const svg = window.btoa(`
      <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50">
        <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2"/>
        <text x="50%" y="50%" fill="white" font-size="10" font-family="Arial" font-weight="bold" dy=".3em" text-anchor="middle">${count}</text>
      </svg>`);

    // Create the marker element
    const img = document.createElement("img");
    img.src = `data:image/svg+xml;base64,${svg}`;
    img.style.filter = "drop-shadow(0px 2px 4px rgba(0,0,0,0.3))";
    img.style.cursor = "pointer";

    return new google.maps.marker.AdvancedMarkerElement({
      position,
      content: img,
    });
  },
};

/**
 * MarkersWithClustering Component
 * Handles the logic of grouping markers together.
 */
const MarkersWithClustering = ({ pois, onMarkerClick }) => {
  const map = useMap();
  const clusterer = useRef<MarkerClusterer | null>(null);
  const markerInstances = useRef<
    Record<string, google.maps.marker.AdvancedMarkerElement>
  >({});

  // 1. Initialize Clusterer
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({
        map,
        renderer: disneyRenderer,
      });
    }
  }, [map]);

  // 2. The "Sync" Effect
  // This runs whenever 'pois' changes (via filtering)
  useEffect(() => {
    if (!clusterer.current) return;

    // Give React a tiny beat to finish the Ref assignments
    const timer = setTimeout(() => {
      const currentMarkers = Object.values(markerInstances.current);
      clusterer.current?.clearMarkers();
      clusterer.current?.addMarkers(currentMarkers);
      clusterer.current?.render();
    }, 50);

    return () => clearTimeout(timer);
  }, [pois]);

  const setMarkerRef = (
    marker: google.maps.marker.AdvancedMarkerElement | null,
    key: string,
  ) => {
    if (marker) {
      markerInstances.current[key] = marker;
    } else {
      // Logic for when a marker is removed (filtered out)
      if (markerInstances.current[key]) {
        markerInstances.current[key].map = null;
        delete markerInstances.current[key];
      }
    }
  };

  const renderedMarkers = useMemo(() => {
    return pois.map((poi, index) => {
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
          <MarkerContainer $delay={(index % 10) * 0.05}>
            {emoji || "📍"}
          </MarkerContainer>
        </AdvancedMarker>
      );
    });
  }, [pois, onMarkerClick]); // Only re-generate if POIs actually change

  return <>{renderedMarkers}</>;
};

const DisneyMapContent = observer(() => {
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [showIcons, setShowIcons] = useState(true);
  const [showAttractions, setShowAttractions] = useState(true);
  const [showHotels, setShowHotels] = useState(true);

  const filteredPois = useMemo(() => {
    return pois.filter((poi) => {
      const type = poi["Type of Interest"].toLowerCase();
      if (showIcons && type.includes("icon")) return true;
      if (showAttractions && type.includes("attraction")) return true;
      if (showHotels && type.includes("hotel")) return true;
      return false;
    });
  }, [showIcons, showAttractions, showHotels]); // Only recalculate when checkboxes change

  const handleMarkerClick = useCallback((poi) => setSelectedPoi(poi), []);

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
          onMarkerClick={handleMarkerClick}
        />

        {selectedPoi && (
          <InfoWindow
            position={{
              lat: selectedPoi.Latitude,
              lng: selectedPoi.Longitude,
            }}
            onCloseClick={() => setSelectedPoi(null)}
          >
            <div style={{ color: "#000", paddingBottom: "16px" }}>
              <h3 style={{ marginTop: 0 }}>
                {selectedPoi["Points of Interest"]}
              </h3>
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
