/**
 * ButtonModule Styled Components
 * 
 * All styled elements for the ButtonModule component.
 * This separation keeps styles organized and makes them reusable.
 */

import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  margin: 20px 0;
  background: #e3f2fd;
  border-radius: 8px;
  border: 2px solid #90caf9;
`;

export const Title = styled.h3`
  color: #1565c0;
  margin-bottom: 15px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

export const StyledButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  background: ${props => props.variant === 'secondary' ? '#ff6b6b' : '#4caf50'};
  color: white;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    background: ${props => props.variant === 'secondary' ? '#ff5252' : '#45a049'};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const Description = styled.p`
  color: #555;
  margin-bottom: 15px;
  font-size: 14px;
`;
