/**
 * DisneyMapModule
 *
 * A module that contains interactive buttons to modify MobX state.
 * Demonstrates:
 * - MobX actions (calling store.setText)
 * - Event handlers
 * - Styled components (imported from separate file)
 * - Observer pattern (re-renders when used observable changes)
 */

import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { Container } from "./DisneyMapModule.styled";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";
import pois from "../../pois.json";

/**
 * DisneyMapModule Component
 *
 * Contains CTA buttons that update the MobX store state.
 * The observer wrapper isn't strictly needed here since we're not reading observables,
 * but it's good practice for consistency.
 */
const DisneyMapModule = observer(() => {
  const [selectedPoi, setSelectedPoi] = useState(null);

  console.log("There are ", pois.length, " POIs.");
  console.log(pois);

  const getMarkerColor = (type: string) => {
    switch (type) {
      case "Attraction":
        return "#800080"; // Purple
      case "Disney Resorts Collection Hotel":
        return "#1e40af"; // Blue
      case "Transportation":
        return "#16a34a"; // Green
      case "Icon":
        return "#e11d48"; // Red
      default:
        return "#6b7280"; // Gray
    }
  };

  /*
  const mapStyles = [
    {
      featureType: "all",
      elementType: "geometry",
      stylers: [
        {
          color: "#63b5e5",
        },
      ],
    },
    {
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [
        {
          gamma: 0.01,
        },
        {
          lightness: 20,
        },
      ],
    },
    {
      featureType: "all",
      elementType: "labels.text.stroke",
      stylers: [
        {
          saturation: -31,
        },
        {
          lightness: -33,
        },
        {
          weight: 2,
        },
        {
          gamma: 0.8,
        },
      ],
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [
        {
          lightness: 30,
        },
        {
          saturation: -50,
        },
      ],
    },
    {
      featureType: "all",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [
        {
          saturation: 20,
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [
        {
          lightness: 20,
        },
        {
          saturation: -20,
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          lightness: 10,
        },
        {
          saturation: -30,
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [
        {
          saturation: 25,
        },
        {
          lightness: 25,
        },
      ],
    },
    {
      featureType: "water",
      elementType: "all",
      stylers: [
        {
          lightness: -20,
        },
      ],
    },
  ];
  */

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
          //styles={mapStyles}
          onCameraChanged={(ev: MapCameraChangedEvent) =>
            console.log(
              "camera changed:",
              ev.detail.center,
              "zoom:",
              ev.detail.zoom,
            )
          }
        >
          {pois.map((poi, index) => (
            <AdvancedMarker
              key={`${poi["Points of Interest"]}-${index}`}
              position={{ lat: poi.Latitude, lng: poi.Longitude }}
              title={poi["Points of Interest"]}
              onClick={() => setSelectedPoi(poi)}
            >
              {poi["Type of Interest"].toLowerCase().includes("hotel") ? (
                <div
                  style={{ fontSize: "24px", transform: "translateY(-50%)" }}
                >
                  🏨
                </div>
              ) : poi["Type of Interest"]
                  .toLowerCase()
                  .includes("attraction") ? (
                <div
                  style={{ fontSize: "24px", transform: "translateY(-50%)" }}
                >
                  🎢
                </div>
              ) : poi["Type of Interest"].toLowerCase().includes("icon") ? (
                <div
                  style={{ fontSize: "24px", transform: "translateY(-50%)" }}
                >
                  ⭐
                </div>
              ) : poi["Type of Interest"]
                  .toLowerCase()
                  .includes("fireworks") ? (
                <div
                  style={{ fontSize: "24px", transform: "translateY(-50%)" }}
                >
                  🎆
                </div>
              ) : poi["Type of Interest"]
                  .toLowerCase()
                  .includes("transportation") ? (
                <div
                  style={{ fontSize: "24px", transform: "translateY(-50%)" }}
                >
                  🚊
                </div>
              ) : poi["Type of Interest"]
                  .toLowerCase()
                  .includes("golf course") ? (
                <div
                  style={{ fontSize: "24px", transform: "translateY(-50%)" }}
                >
                  ⛳
                </div>
              ) : poi["Type of Interest"].toLowerCase().includes("pavilion") ? (
                <div
                  style={{ fontSize: "24px", transform: "translateY(-50%)" }}
                >
                  🎪
                </div>
              ) : poi["Type of Interest"]
                  .toLowerCase()
                  .includes("water slide") ? (
                <div
                  style={{ fontSize: "24px", transform: "translateY(-50%)" }}
                >
                  🌊
                </div>
              ) : (
                /* 📍 Case 3: Default Pin */
                <Pin
                  background={"#800080"}
                  borderColor={"#ffffff"}
                  glyphColor={"#ffffff"}
                />
              )}
            </AdvancedMarker>
          ))}

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
                {/* <small>{selectedPoi["Area within Location"]}</small> */}
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </Container>
  );
});

export default DisneyMapModule;
