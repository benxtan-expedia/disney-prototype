/**
 * DisneyMapModule Styled Components
 *
 * All styled elements for the DisneyMapModule component.
 * This separation keeps styles organized and makes them reusable.
 */

import styled, { keyframes } from "styled-components";

export const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  /* Remove focus outline on clicked markers */
  gmp-advanced-marker:focus,
  gmp-advanced-marker:focus-visible,
  [role="button"]:focus,
  [role="button"]:focus-visible {
    outline: none !important;
  }

  button,
  button:hover,
  button:focus,
  button:focus-visible {
    margin: 0;
    padding: 0;
    border: 0;
    outline: none;
  }

  #filter-panel {
    position: absolute;
    left: -420px;
    width: 420px;
    height: 100%;
    background-color: #d9d9d9;
    z-index: 10;
    text-align: left;
    padding: 20px;
    color: #07164a;
  }

  #filter-panel-close-button {
    position: absolute;
    display: block;
    margin: 90% 420px 10px;
    padding: 20px 25px 20px 0px;
    top: -50px;
    border-radius: 10px;
    background-color: #d9d9d9;
  }

  .filter-section {
    border-radius: 8px;
    background-color: #ffffff;
    margin: 20px;
    padding: 1px 10px 20px 10px;
  }

  .filter-buttons-section {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  .filter-button {
    flex: 1;
  }

  .filter-section button {
    display: block;
    margin: 0 auto;
    border: 2px solid #07164a;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    opacity: 0.5;
  }

  .filter-section button.selected {
    opacity: 1;
  }

  .filter-section button img {
    display: block;
    margin: 0 auto;
  }

  .filter-section label {
    display: block;
    margin-top: 5px;
    text-align: center;
    color: #07164a;
    font-size: 12px;
    white-space: nowrap;
  }
`;

const markerPop = keyframes`
  0% {
    transform: scale(0) translateY(-50%);
    opacity: 0;
  }
  70% {
    transform: scale(1.2) translateY(-50%);
  }
  100% {
    transform: scale(1) translateY(-50%);
    opacity: 1;
  }
`;

export const MarkerContainer = styled.div<{ $delay?: number }>`
  font-size: 24px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: pointer;

  /* Apply the animation */
  animation: ${markerPop} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;

  /* Add staggered delay if passed as a prop */
  animation-delay: ${(props) => props.$delay || 0}s;

  /* Initial state to prevent flicker before animation starts */
  opacity: 0;
`;
