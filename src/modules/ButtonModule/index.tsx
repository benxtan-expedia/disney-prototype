/**
 * Button Module
 * 
 * A module that contains interactive buttons to modify MobX state.
 * Demonstrates:
 * - MobX actions (calling store.setText)
 * - Event handlers
 * - Styled components (imported from separate file)
 * - Observer pattern (re-renders when used observable changes)
 */

import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../context/StoreContext';
import { Container, Title, ButtonGroup, StyledButton, Description } from './ButtonModule.styled';

/**
 * ButtonModule Component
 * 
 * Contains CTA buttons that update the MobX store state.
 * The observer wrapper isn't strictly needed here since we're not reading observables,
 * but it's good practice for consistency.
 */
const ButtonModule: React.FC = observer(() => {
  const store = useStore();

  const handleButton1Click = () => {
    store.setText('🎉 You clicked Button 1! The state has changed.');
  };

  const handleButton2Click = () => {
    store.setText('🚀 Button 2 was clicked! MobX is updating the UI reactively.');
  };

  const handleResetClick = () => {
    store.setText('Hello World! Click a button to change this text.');
  };

  return (
    <Container>
      <Title>🎯 Button Module - Interactive Controls</Title>
      <Description>
        Click the buttons below to update the MobX state. 
        Watch how the text in the Input Module changes instantly!
      </Description>
      <ButtonGroup>
        <StyledButton onClick={handleButton1Click} variant="primary">
          Click Me - Button 1
        </StyledButton>
        <StyledButton onClick={handleButton2Click} variant="primary">
          Click Me - Button 2
        </StyledButton>
        <StyledButton onClick={handleResetClick} variant="secondary">
          Reset Text
        </StyledButton>
      </ButtonGroup>
    </Container>
  );
});

export default ButtonModule;
