import styled from "styled-components";

export const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 80%;
  margin-top: 5%;

  .leaflet-container {
    background: white;
  }

  /* ── Leaflet popup overrides ── */
  .leaflet-popup-content-wrapper {
    border-radius: 14px;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.18);
    padding: 0;
    overflow: hidden;
    border: none;
  }

  .leaflet-popup-content {
    margin: 0;
    min-width: 240px;
    max-width: 280px;
  }

  .leaflet-popup-tip-container {
    margin-top: -1px;
  }

  .leaflet-popup-tip {
    background: white;
    box-shadow: none;
  }

  .leaflet-popup-close-button {
    top: 10px !important;
    right: 10px !important;
    color: #666 !important;
    font-size: 20px !important;
  }

  /* ── Popup card content ── */
  .poi-popup {
    padding: 18px 20px 20px;
    font-family: sans-serif;
  }

  .poi-type-badge {
    display: inline-block;
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: white;
    background: #0063be;
    border-radius: 20px;
    padding: 3px 9px;
    margin-bottom: 8px;
  }

  .poi-type-badge.water-park {
    background: #0097a7;
  }

  .poi-type-badge.resort {
    background: #4caf50;
  }

  .poi-popup-title {
    margin: 0 0 6px;
    font-size: 18px;
    font-weight: 700;
    color: #07164a;
    line-height: 1.2;
  }

  .poi-popup-desc {
    margin: 0;
    font-size: 13px;
    color: #555;
    line-height: 1.55;
  }

  /* ── Zoom controls ── */
  .leaflet-control-zoom {
    border: none !important;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15) !important;
    border-radius: 10px !important;
    overflow: hidden;
  }

  .leaflet-control-zoom-in,
  .leaflet-control-zoom-out {
    width: 36px !important;
    height: 36px !important;
    line-height: 36px !important;
    font-size: 18px !important;
    color: #07164a !important;
  }

  .leaflet-control-zoom-in:hover,
  .leaflet-control-zoom-out:hover {
    background: #f0f4ff !important;
  }
`;
