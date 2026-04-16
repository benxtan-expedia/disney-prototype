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
import { AnimatePresence, motion } from "framer-motion";
import pois from "../../pois.json";

import filterIcon from "../../../public/img/filter.png";
import arrowLeftIcon from "../../../public/img/arrow-left.png";
import magicKingdomIcon from "../../../public/img/magic-kingdom.png";
import epcotIcon from "../../../public/img/epcot.png";
import hollywoodStudiosIcon from "../../../public/img/hollywood-studios.png";
import animalKingdomIcon from "../../../public/img/animal-kingdom.png";
import typhoonLagoonIcon from "../../../public/img/typhoon-lagoon.png";
import blizzardBeachIcon from "../../../public/img/blizzard-beach.png";
import hotelIcon from "../../../public/img/hotel.png";

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
  "wave pool": "🌊",
  stageshow: "🎭",
};

const PARKS = [
  { name: "Magic Kingdom", value: "magic-kingdom", icon: magicKingdomIcon },
  { name: "EPCOT", value: "epcot", icon: epcotIcon },
  {
    name: "Hollywood Studios",
    value: "hollywood-studios",
    icon: hollywoodStudiosIcon,
  },
  { name: "Animal Kingdom", value: "animal-kingdom", icon: animalKingdomIcon },
  { name: "Typhoon Lagoon", value: "typhoon-lagoon", icon: typhoonLagoonIcon },
  { name: "Blizzard Beach", value: "blizzard-beach", icon: blizzardBeachIcon },
];

const ACCOMODATION_TYPES = [
  { name: "Deluxe Hotels", value: "deluxe-hotels", icon: hotelIcon },
  { name: "Deluxe Villas", value: "deluxe-villas", icon: hotelIcon },
  {
    name: "Value Resort Hotels",
    value: "value-resort-hotels",
    icon: hotelIcon,
  },
];

const TRANSPORTATION_TYPES = [
  { name: "Monorail", value: "monorail", icon: hotelIcon },
];

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

    // Re-center
    const bounds = new google.maps.LatLngBounds();

    pois.forEach((poi) => {
      // Extend the boundaries to include this point
      bounds.extend(new google.maps.LatLng(poi.Latitude, poi.Longitude));
    });

    // Recenter and zoom the map to fit all points within these bounds
    map.fitBounds(bounds);

    // Return
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
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [selectedParks, setSelectedParks] = useState<string[]>(
    PARKS.map((p) => p.value)
  );
  const [showIcons, setShowIcons] = useState(true);
  const [showAttractions, setShowAttractions] = useState(true);
  const [showHotels, setShowHotels] = useState(true);
  const [showMonorail, setShowMonorail] = useState(true);

  //
  //console.log(pois);
  const uniqueIds = [
    //...new Set(pois.map((item) => item["Type of Interest"])),
    //...new Set(pois.map((item) => item["Area within Location"])),
    //...new Set(pois.map((item) => item["Theme Park or Location"])),
  ];
  //console.log(uniqueIds);

  /*
  // Unique Types of Interest:
  [
    "Area/Land",
    "Attraction",
    "Icon",
    "Parade",
    "Fireworks",
    "Disney Resorts Collection Hotel",
    "Transportation",
    "Monorail Station (connects TTC to Magic Kingdom, EPCOT, Grand Floridian, Contemporary, and Polynesian)",
    "Golf Course",
    "Tier 1/Official Hotel",
    "Icon/Attraction",
    "Pavilion",
    "Stageshow",
    "Transportation - Connects to Art of Animation/Pop Century, Disney's Hollywood Studios, Riviera, and EPCOT",
    "Outdoor Entertainment District where you can Shop, Dine, and Play! ",
    "Wave Pool",
    "Water Slide"
  ]
  */

  /*
  // Unique Theme Parks or Locations:
  [
    "Magic Kingdom Park",
    "Magic Kingdom Park Area",
    "Disney's Grand Floridian Resort & Spa",
    "Disney's Polynesian Village Resort",
    "Disney's Contemporary Resort",
    "Magic Kingdom Park Main Entrance",
    "EPCOT",
    "EPCOT ",
    "EPCOT Area",
    "EPCOT Main Entrance",
    "EPCOT International Gateway Entrance",
    "Disney's Hollywood Studios",
    "Disney's Riviera Resort",
    "Disney's Hollywood Studios Area",
    "Disney's Caribbean Beach Resort",
    "Disney's Art of Animation & Pop Century Resorts",
    "Disney's Hollywood Studios Main Entrance",
    "Disney's Hollywood Studios Resort Area",
    "Disney's Animal Kingdom Theme Park",
    "Disney's Animal Kingdom Theme Park Area",
    "Disney Springs",
    "Disney Springs Area ",
    "Disney's Typhoon Lagoon Water Park",
    "Disney's Blizzard Beach Water Park"
  ]
  */

  /*
  // Unique Areas within Locations:
  [
    "Main Street",
    "Adventureland",
    "Frontierland",
    "Liberty Square",
    "Fantasyland",
    "Storybook Circus",
    "Tomorrowland",
    "Frontierland, Libery Square, Main Street",
    "Above Cinderella Castle ",
    "N/A",
    "World Celebration",
    "The Land Pavilion, World Nature",
    "The Living Seas Pavilion, World Nature",
    "The Imagination Pavilion, World Nature",
    "World Discovery",
    "World Showplace",
    "Worldshowplace",
    "France, World Showplace",
    "Norway, World Showplace",
    "Hollywood BLVD",
    "Sunset BLVD",
    "Animation Courtyard",
    "Toy Story Land",
    "Star Wars: Galaxy's Edge",
    "Echo Lake",
    "Hollywood Hills Amphitheater",
    "Discovery Island",
    "Pandora: The World of Avatar",
    "Africa",
    "Asia"
  ]
  */

  const filteredPois = useMemo(() => {
    return pois.filter((poi) => {
      const name = poi["Points of Interest"].toLowerCase();
      const type = poi["Type of Interest"].toLowerCase();
      const park = poi["Theme Park or Location"].toLowerCase();

      if (!selectedParks.some((sp) => park.includes(sp.replace("-", " ")))) {
        return false;
      }

      if (showIcons && type.includes("icon")) return true;

      if (
        showAttractions &&
        (type.includes("attraction") ||
          type.includes("water slide") ||
          type.includes("wave pool"))
      ) {
        return true;
      }

      if (showHotels && type.includes("hotel")) return true;

      if (
        showMonorail &&
        name.includes("monorail") &&
        type.includes("transportation")
      ) {
        return true;
      }

      return false;
    });
  }, [selectedParks, showIcons, showAttractions, showHotels, showMonorail]);

  const handleParkToggle = (parkValue: string) => {
    setSelectedParks((prev) => {
      if (prev.includes(parkValue)) {
        if (prev.length === 1) return prev;
        return prev.filter((p) => p !== parkValue);
      }
      return [...prev, parkValue];
    });
  };

  const handleMarkerClick = useCallback((poi: any) => setSelectedPoi(poi), []);

  return (
    <Container>
      {/* UI Overlay */}

      <button
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 1,
          padding: "10px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontFamily: "sans-serif",
          borderRadius: "40px",
        }}
        onClick={() =>
          setIsFilterVisible((isFilterVisible) => !isFilterVisible)
        }
      >
        <img src={filterIcon} alt="Filter icon" />
      </button>

      <AnimatePresence>
        {isFilterVisible && (
          <motion.div
            id="filter-panel"
            key="modal"
            initial={{ left: "-420px" }}
            animate={{ left: "0px" }}
            exit={{ left: "-420px" }}
            transition={{ ease: "easeOut", duration: 0.2 }}
          >
            <button
              id="filter-panel-close-button"
              onClick={() =>
                setIsFilterVisible((isFilterVisible) => !isFilterVisible)
              }
            >
              <img src={arrowLeftIcon} alt="Close filter panel" />
            </button>

            <div className="filter-section">
              <h3>Disney World Parks</h3>
              <div className="filter-buttons-section">
                {PARKS.map((park, index) => (
                  <div className="filter-button" key={index}>
                    <button
                      className={selectedParks.includes(park.value) ? "selected" : ""}
                      onClick={() => handleParkToggle(park.value)}
                    >
                      <img src={park.icon} alt="Park icon" />
                    </button>
                    <label>{park.name}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3>Accomodation</h3>
              <div className="filter-buttons-section">
                {ACCOMODATION_TYPES.map((accomodation, index) => (
                  <div className="filter-button" key={index}>
                    <button
                      className={showHotels ? "selected" : ""}
                      onClick={() => setShowHotels(!showHotels)}
                    >
                      <img src={accomodation.icon} alt="Accomodation icon" />
                    </button>
                    <label>{accomodation.name}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3>Transportation</h3>
              <div className="filter-buttons-section">
                {TRANSPORTATION_TYPES.map((transportation, index) => (
                  <div className="filter-button" key={index}>
                    <button
                      className={showMonorail ? "selected" : ""}
                      onClick={() => setShowMonorail(!showMonorail)}
                    >
                      <img
                        src={transportation.icon}
                        alt="Transportation icon"
                      />
                    </button>
                    <label>{transportation.name}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter Checkboxes */}

            <div hidden>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Component */}

      <Map
        mapId={"29abc80053f0980f9e4443b2"}
        defaultZoom={15}
        minZoom={13}
        maxZoom={20}
        defaultCenter={{ lat: 28.419411, lng: -81.5812 }}
        mapTypeControl={false}
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
