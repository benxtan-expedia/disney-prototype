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
  font-size: 28px;
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
