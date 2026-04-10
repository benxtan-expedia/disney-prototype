/**
 * TestModule Styled Components
 * 
 * All styled elements for the TestModule component.
 * This separation keeps styles organized and makes them reusable.
 */

import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  margin: 20px 0;
  background: #fff3e0;
  border-radius: 8px;
  border: 2px solid #ffb74d;
`;

export const Title = styled.h3`
  color: #e65100;
  margin-bottom: 15px;
`;

export const InfoText = styled.p`
  color: #666;
  margin: 8px 0;
  font-size: 14px;
`;

export const StatusBadge = styled.span<{ $isActive: boolean }>`
  display: inline-block;
  padding: 4px 12px;
  background: ${props => props.$isActive ? '#4caf50' : '#ff9800'};
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  margin-left: 10px;
`;

export const TimerText = styled.p`
  color: #e65100;
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
`;
