import React from 'react';
import styled from 'styled-components';
import companyLogo from '../assets/pclog.jpeg';

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const LogoImage = styled.img`
  width: ${props => props.size || '72px'};
  height: ${props => props.size || '72px'};
  border-radius: 20px;
  object-fit: cover;
  background: #fff;
  box-shadow: none;
  margin-bottom: 10px;
`;

const Subtitle = styled.div`
  font-size: 22px;
  color: #222;
  font-weight: 700;
  letter-spacing: 1px;
  margin-top: 4px;
  font-family: 'Arial Rounded MT Bold', 'Arial', sans-serif;
`;

function ArtisticLogo({ size = '72px', showSubtitle = true }) {
  return (
    <LogoWrapper>
      <LogoImage src={companyLogo} alt="PiMiBahasa Logo" size={size} />
      {showSubtitle && (
        <Subtitle>PiMiBahasa</Subtitle>
      )}
    </LogoWrapper>
  );
}

export default ArtisticLogo; 