/**
 * Input Module
 * 
 * A simple module that displays context information and the current MobX state.
 * Demonstrates:
 * - Using React Context (useAppContext)
 * - Accessing MobX store (useStore)
 * - Observer pattern with MobX React Lite
 * - Styled components (imported from separate file)
 */

import React from 'react';
import { observer } from 'mobx-react-lite';
import { useAppContext } from '../../context/AppContext';
import { useStore } from '../../context/StoreContext';
import { Container, Title, InfoText, StateText } from './InputModule.styled';

/**
 * InputModule Component
 * 
 * The observer() wrapper makes this component reactive to MobX changes.
 * When store.text changes, only this component re-renders (if it uses that value).
 */
const InputModule: React.FC = observer(() => {
  // Access the app context
  const appContext = useAppContext();
  
  // Access the MobX store
  const store = useStore();

  return (
    <Container>
      <Title>📄 Input Module - Context Information</Title>
      <InfoText><strong>Locale:</strong> {appContext.context.locale}</InfoText>
      <InfoText><strong>Currency:</strong> {appContext.context.currency}</InfoText>
      <InfoText><strong>Device Type:</strong> {appContext.context.device.type}</InfoText>
      <InfoText><strong>Auth State:</strong> {appContext.context.identity.authState}</InfoText>
      <StateText>Current State: {store.text}</StateText>
    </Container>
  );
});

export default InputModule;
