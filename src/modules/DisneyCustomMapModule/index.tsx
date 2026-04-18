import { observer } from "mobx-react-lite";
import {
  MapContainer,
  ImageOverlay,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from "react-leaflet";
import L, { LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Container } from "./DisneyCustomMapModule.styled";

// ── Image dimensions (pixels) ──────────────────────────────────────────────
// Save the Disney World illustrated map to: /public/img/disney-map.jpg
// Update these values to match the actual image dimensions if different.
const IMAGE_W = 1536;
const IMAGE_H = 660;

const bounds: LatLngBoundsExpression = [
  [0, 0],
  [IMAGE_H, IMAGE_W],
];

// Allow 10% extra space beyond the image edges so POIs near the
// borders (e.g. Magic Kingdom) can be panned to a more central position.
const PAD_H = IMAGE_H * 0.1;
const PAD_W = IMAGE_W * 0.1;
const paddedBounds: LatLngBoundsExpression = [
  [-PAD_H, -PAD_W],
  [IMAGE_H + PAD_H, IMAGE_W + PAD_W],
];

// ── Coordinate helper ──────────────────────────────────────────────────────
// Leaflet CRS.Simple has its origin at bottom-left, so we flip the Y axis.
// Usage: px(pixelX, pixelY) where (0,0) is the top-left of the image.
const px = (x: number, y: number): [number, number] => [IMAGE_H - y, x];

// ── Marker icon factory ────────────────────────────────────────────────────
const createIcon = (emoji: string, color: string) =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: ${color};
        border: 3px solid white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        cursor: pointer;
        transition: transform 0.15s ease;
      ">${emoji}</div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -28],
  });

// ── Points of interest ─────────────────────────────────────────────────────
type POIType = "Theme Park" | "Water Park" | "Resort";

type POI = {
  name: string;
  description: string;
  type: POIType;
  position: [number, number];
  emoji: string;
  color: string;
};

// Pixel positions estimated from the Todd Bright / Disney 2011 illustration.
// Adjust x/y values to fine-tune marker placement after loading the image.
const POIS: POI[] = [
  {
    name: "Magic Kingdom",
    description:
      "Home of Cinderella Castle, Space Mountain, and classic Disney magic for the whole family.",
    type: "Theme Park",
    position: px(190, 155),
    emoji: "🏰",
    color: "#0063BE",
  },
  {
    name: "EPCOT",
    description:
      "Future World meets World Showcase — science, innovation, food, and cultures from around the globe.",
    type: "Theme Park",
    position: px(1085, 125),
    emoji: "🌍",
    color: "#0063BE",
  },
  {
    name: "Animal Kingdom",
    description:
      "Safari adventures, Pandora – The World of Avatar, and the iconic Tree of Life.",
    type: "Theme Park",
    position: px(215, 465),
    emoji: "🦁",
    color: "#2E7D32",
  },
  {
    name: "Hollywood Studios",
    description:
      "Star Wars: Galaxy's Edge, Toy Story Land, and thrilling movie-inspired experiences.",
    type: "Theme Park",
    position: px(915, 435),
    emoji: "🎬",
    color: "#B71C1C",
  },
  {
    name: "Blizzard Beach",
    description:
      "A ski-resort-themed water park featuring Summit Plummet — one of the world's fastest water slides.",
    type: "Water Park",
    position: px(545, 578),
    emoji: "❄️",
    color: "#1565C0",
  },
  {
    name: "Typhoon Lagoon",
    description:
      "A tropical water park with a massive wave pool, lazy river, and thrilling water slides.",
    type: "Water Park",
    position: px(1295, 488),
    emoji: "🌊",
    color: "#0097A7",
  },
  {
    name: "Fort Wilderness Resort",
    description:
      "Cabins, campsites, trail rides, and outdoor adventures in a lush forested setting.",
    type: "Resort",
    position: px(605, 218),
    emoji: "⛺",
    color: "#388E3C",
  },
];

// ── Badge class by type ────────────────────────────────────────────────────
const badgeClass: Record<POIType, string> = {
  "Theme Park": "",
  "Water Park": "water-park",
  Resort: "resort",
};

// ── Zoom out to fill width when popup is closed ────────────────────────────
const ResetOnPopupClose = () => {
  const map = useMap();
  useMapEvent("popupclose", () => {
    map.flyToBounds(bounds, { duration: 0.6 });
  });
  return null;
};

// ── Marker that flies to itself on click ───────────────────────────────────
const ZoomableMarker = ({ poi }: { poi: POI }) => {
  const map = useMap();

  const handleClick = () => {
    const ZOOM = 2;
    const [lat, lng] = poi.position;

    // In Leaflet CRS.Simple, 1 map unit = 2^zoom screen pixels.
    // Calculate how many map units fill half the container at the target zoom,
    // then clamp the fly-to center so the viewport stays within image bounds
    // without Leaflet doing its own clamping (which pushes the POI to the edge).
    const { x: containerW, y: containerH } = map.getSize();
    const scale = Math.pow(2, ZOOM);
    const halfW = containerW / 2 / scale;
    const halfH = containerH / 2 / scale;

    const centerLng = Math.max(halfW, Math.min(IMAGE_W - halfW, lng));
    const centerLat = Math.max(halfH, Math.min(IMAGE_H - halfH, lat));

    map.flyTo([centerLat, centerLng], ZOOM, { duration: 0.8 });
  };

  return (
    <Marker
      position={poi.position}
      icon={createIcon(poi.emoji, poi.color)}
      eventHandlers={{ click: handleClick }}
    >
      <Popup>
        <div className="poi-popup">
          <span className={`poi-type-badge ${badgeClass[poi.type]}`}>
            {poi.type}
          </span>
          <h3 className="poi-popup-title">{poi.name}</h3>
          <p className="poi-popup-desc">{poi.description}</p>
        </div>
      </Popup>
    </Marker>
  );
};

// ── Map component ──────────────────────────────────────────────────────────
const DisneyCustomMapContent = () => (
  <MapContainer
    crs={L.CRS.Simple}
    center={[IMAGE_H / 2, IMAGE_W / 2]}
    zoom={-0.2}
    minZoom={-0.2}
    maxZoom={3}
    maxBounds={paddedBounds}
    maxBoundsViscosity={1.0}
    style={{ width: "100%", height: "100%" }}
    scrollWheelZoom
    zoomControl
  >
    <ResetOnPopupClose />
    <ImageOverlay url="/img/disney-map.jpg" bounds={bounds} />

    {POIS.map((poi) => (
      <ZoomableMarker key={poi.name} poi={poi} />
    ))}
  </MapContainer>
);

// ── Module export ──────────────────────────────────────────────────────────
const DisneyCustomMapModule = observer(() => (
  <Container>
    <DisneyCustomMapContent />
  </Container>
));

export default DisneyCustomMapModule;
