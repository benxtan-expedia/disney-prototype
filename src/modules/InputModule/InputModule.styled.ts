/**
 * InputModule Styled Components
 * 
 * All styled elements for the InputModule component.
 * This separation keeps styles organized and makes them reusable.
 */

import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  margin: 20px 0;
  background: #f5f5f5;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
`;

export const Title = styled.h3`
  color: #333;
  margin-bottom: 15px;
`;

export const InfoText = styled.p`
  color: #666;
  margin: 8px 0;
  font-size: 14px;
`;

export const StateText = styled.p`
  color: #1976d2;
  font-weight: bold;
  margin-top: 15px;
  padding: 10px;
  background: white;
  border-radius: 4px;
`;
