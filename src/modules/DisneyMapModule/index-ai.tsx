/**
 * DisneyMapModule
 *
 * A module that displays Disney POIs from a JSON file using Google Maps.
 * Includes marker clustering and custom emoji-based markers.
 */

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { observer } from "mobx-react-lite";
import { Container } from "./DisneyMapModule.styled";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  MapCameraChangedEvent,
  useMap,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer, Marker } from "@googlemaps/markerclusterer";

import poisJson from "../../pois.json";

// 1. Define the TypeScript interface for your JSON data
interface DisneyPOI {
  "Points of Interest": string;
  "Theme Park or Location": string;
  "Area within Location": string;
  "Type of Interest": string;
  Latitude: number;
  Longitude: number;
}

const pois = poisJson as DisneyPOI[];

/**
 * Helper Component: MarkerContent
 * Renders the specific emoji or Pin based on the POI type.
 */
const MarkerContent = ({ type }: { type: string }) => {
  const lowerType = type.toLowerCase();
  const style = { fontSize: "24px", transform: "translateY(-50%)" };

  if (lowerType.includes("hotel")) return <div style={style}>🏨</div>;
  if (lowerType.includes("attraction")) return <div style={style}>🎢</div>;
  if (lowerType.includes("icon")) return <div style={style}>⭐</div>;
  if (lowerType.includes("fireworks")) return <div style={style}>🎆</div>;
  if (lowerType.includes("transportation")) return <div style={style}>🚊</div>;
  if (lowerType.includes("golf course")) return <div style={style}>⛳</div>;
  if (lowerType.includes("pavilion")) return <div style={style}>🎪</div>;
  if (lowerType.includes("water slide")) return <div style={style}>🌊</div>;

  return (
    <Pin
      background={"#800080"}
      borderColor={"#ffffff"}
      glyphColor={"#ffffff"}
    />
  );
};

/**
 * Helper Component: ClusteredMarkers
 * Handles the logic of adding markers to the Google Maps Clusterer.
 */
const ClusteredMarkers = ({
  points,
  onMarkerClick,
}: {
  points: DisneyPOI[];
  onMarkerClick: (poi: DisneyPOI) => void;
}) => {
  const map = useMap();
  const clusterer = useRef<MarkerClusterer | null>(null);

  // Use a Ref to track marker instances to avoid infinite re-render loops
  const markerInstances = useRef<{ [key: string]: Marker }>({});

  // Initialize the clusterer
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  // Callback to handle marker mounting/unmounting
  const setMarkerRef = useCallback((marker: Marker | null, key: string) => {
    if (marker) {
      markerInstances.current[key] = marker;
    } else {
      delete markerInstances.current[key];
    }

    // Update the clusterer
    if (clusterer.current) {
      clusterer.current.clearMarkers();
      clusterer.current.addMarkers(Object.values(markerInstances.current));
    }
  }, []);

  return (
    <>
      {points.map((poi, index) => {
        const key = `${poi["Points of Interest"]}-${index}`;
        return (
          <AdvancedMarker
            key={key}
            // Tiny jitter logic so identical coordinates can be un-clustered by the user
            position={{
              lat: poi.Latitude + index * 0,
              lng: poi.Longitude + index * 0,
            }}
            title={poi["Points of Interest"]}
            onClick={() => onMarkerClick(poi)}
            ref={(marker) => setMarkerRef(marker, key)}
          >
            <MarkerContent type={poi["Type of Interest"]} />
          </AdvancedMarker>
        );
      })}
    </>
  );
};

/**
 * Main Component: DisneyMapModule
 */
const DisneyMapModule = observer(() => {
  const [selectedPoi, setSelectedPoi] = useState<DisneyPOI | null>(null);

  return (
    <Container>
      <APIProvider
        apiKey={"AIzaSyC302MUF9oeVaXLuVzIv-YCoLaX80r-9uc"}
        onLoad={() => console.log("Maps API has loaded.")}
      >
        <Map
          mapId={"29abc80053f0980f9e4443b2"} // REQUIRED for AdvancedMarker
          defaultZoom={15}
          defaultCenter={{ lat: 28.419411, lng: -81.5812 }}
          onCameraChanged={(ev: MapCameraChangedEvent) =>
            console.log(
              "camera changed:",
              ev.detail.center,
              "zoom:",
              ev.detail.zoom,
            )
          }
        >
          <ClusteredMarkers
            points={pois}
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
                <small>{selectedPoi["Area within Location"]}</small>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </Container>
  );
});

export default DisneyMapModule;
