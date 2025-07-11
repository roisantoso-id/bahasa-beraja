import React from 'react';
import styled from 'styled-components';

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: 'Georgia', serif;
`;

const PiMiText = styled.div`
  font-size: ${props => props.size || '32px'};
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
  letter-spacing: 2px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    z-index: -1;
    border-radius: 8px;
    opacity: 0.1;
  }
`;

const Pi = styled.span`
  color: #6366f1;
  font-style: italic;
  font-weight: 900;
  text-shadow: 2px 2px 4px rgba(99, 102, 241, 0.3);
  transform: skew(-5deg);
  display: inline-block;
`;

const Mi = styled.span`
  color: #8b5cf6;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(139, 92, 246, 0.3);
  transform: skew(5deg);
  display: inline-block;
`;

const Dot = styled.span`
  color: #6366f1;
  font-size: ${props => (props.size || '32px') * 0.3}px;
  font-weight: 900;
  margin: 0 4px;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;

const Subtitle = styled.div`
  font-size: ${props => (props.size || '32px') * 0.4}px;
  color: #666;
  font-weight: 500;
  letter-spacing: 1px;
  margin-top: 4px;
  font-family: 'Arial', sans-serif;
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

function ArtisticLogo({ size = '32px', showSubtitle = true }) {
  return (
    <LogoWrapper>
      <LogoContainer>
        <PiMiText size={size}>
          <Pi>Pi</Pi>
          <Dot size={size}>•</Dot>
          <Mi>Mi</Mi>
        </PiMiText>
      </LogoContainer>
      {showSubtitle && (
        <Subtitle size={size}>Bahasa</Subtitle>
      )}
    </LogoWrapper>
  );
}

export default ArtisticLogo; 