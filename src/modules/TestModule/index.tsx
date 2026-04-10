/**
 * Test Module
 * 
 * A demonstration module showing useEffect lifecycle hook.
 * Demonstrates:
 * - useEffect hook (component lifecycle)
 * - Side effects in functional components
 * - Cleanup functions
 * - Conditional rendering based on state
 * - Styled components (imported from separate file)
 */

import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useAppContext } from '../../context/AppContext';
import { Container, Title, InfoText, StatusBadge, TimerText } from './TestModule.styled';

/**
 * TestModule Component
 * 
 * Demonstrates the useEffect hook which is the equivalent of lifecycle methods
 * in class components (componentDidMount, componentDidUpdate, componentWillUnmount).
 * 
 * useEffect(() => { ... }, []) runs once on mount
 * useEffect(() => { ... }, [dep]) runs when dep changes
 * useEffect(() => { return cleanup }, []) runs cleanup on unmount
 */
const TestModule: React.FC = observer(() => {
  const appContext = useAppContext();
  const [mounted, setMounted] = useState(false);
  const [timer, setTimer] = useState(0);

  // Effect runs once on mount (empty dependency array)
  useEffect(() => {
    console.log('TestModule mounted');
    setMounted(true);

    // Start a timer to demonstrate continuous effects
    const intervalId = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    // Cleanup function runs on unmount
    return () => {
      console.log('TestModule will unmount');
      clearInterval(intervalId);
    };
  }, []); // Empty array means "run only once on mount"

  return (
    <Container>
      <Title>🧪 Test Module - Lifecycle Demo</Title>
      <InfoText>
        This module demonstrates the useEffect hook for lifecycle management.
        <StatusBadge $isActive={mounted}>
          {mounted ? 'ACTIVE' : 'INITIALIZING'}
        </StatusBadge>
      </InfoText>
      <InfoText><strong>Page Name:</strong> {appContext.pageName}</InfoText>
      <InfoText><strong>View Size:</strong> {appContext.viewSize}</InfoText>
      <InfoText><strong>Line of Business:</strong> {appContext.lineOfBusiness}</InfoText>
      <TimerText>⏱️ Component active for: {timer} seconds</TimerText>
      <InfoText style={{ marginTop: '10px', fontSize: '12px', fontStyle: 'italic' }}>
        This timer demonstrates useEffect with cleanup. Check the console for mount/unmount logs.
      </InfoText>
    </Container>
  );
});

export default TestModule;
