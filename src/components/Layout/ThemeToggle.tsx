import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import styled from 'styled-components';

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  border: none;
  background-color: ${props => props.theme.isDark ? '#334155' : '#f1f5f9'};
  color: ${props => props.theme.isDark ? '#94a3b8' : '#64748b'};
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  @media (min-width: 480px) {
    width: 2.25rem;
    height: 2.25rem;
  }
  
  @media (min-width: 640px) {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  &:hover {
    background-color: ${props => props.theme.isDark ? '#475569' : '#e2e8f0'};
    color: ${props => props.theme.isDark ? '#cbd5e1' : '#475569'};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.colors.accent};
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const Icon = styled.div`
  width: 1rem;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (min-width: 480px) {
    width: 1.125rem;
    height: 1.125rem;
  }
  
  @media (min-width: 640px) {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const SunIcon = styled(Sun)`
  width: 1rem;
  height: 1rem;
  
  @media (min-width: 480px) {
    width: 1.125rem;
    height: 1.125rem;
  }
  
  @media (min-width: 640px) {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const MoonIcon = styled(Moon)`
  width: 1rem;
  height: 1rem;
  
  @media (min-width: 480px) {
    width: 1.125rem;
    height: 1.125rem;
  }
  
  @media (min-width: 640px) {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <ToggleButton onClick={toggleTheme} aria-label="Toggle theme">
      <Icon>
        {isDark ? <SunIcon /> : <MoonIcon />}
      </Icon>
    </ToggleButton>
  );
};

export default ThemeToggle; 