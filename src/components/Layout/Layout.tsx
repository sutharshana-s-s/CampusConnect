import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useTheme } from '../../contexts/ThemeContext';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingContent = styled.div`
  text-align: center;
  padding: 2rem;
`;

const Spinner = styled.div`
  width: 3rem;
  height: 3rem;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto 1rem;
`;

const LoadingText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
  font-weight: 500;
`;

const LayoutContainer = styled.div`
  background-color: ${props => props.theme.colors.background};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden; /* Prevent horizontal scrolling */
  width: 100%;
`;

const HeaderSection = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 90;
  background-color: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  overflow: hidden; /* Prevent header overflow */
`;

const ContentSection = styled.div`
  display: flex;
  flex: 1;
  margin-top: 4rem; /* Height of navbar */
  overflow-x: hidden; /* Prevent horizontal scrolling */
  width: 100%;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 0.5rem;
  margin-left: 4rem; /* Always collapsed in desktop */
  transition: margin-left 0.15s ease; /* Faster transition */
  overflow-x: hidden; /* Prevent horizontal scrolling */
  min-width: 0; /* Allow shrinking */
  
  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 0;
    padding: 0.5rem;
  }
  
  @media (min-width: 480px) {
    padding: 0.75rem;
  }
  
  @media (min-width: 640px) {
    padding: 1rem;
  }
  
  @media (min-width: 1024px) {
    padding: 1.5rem;
  }
  
  @media (min-width: 1280px) {
    padding: 2rem;
  }
`;

const Main = styled.main`
  min-height: calc(100vh - 5rem);
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  overflow-x: hidden; /* Prevent horizontal scrolling */
  
  @media (min-width: 640px) {
    min-height: calc(100vh - 5.5rem);
  }
  
  @media (max-width: 480px) {
    min-height: calc(100vh - 4.5rem);
  }
`;

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark } = useTheme();

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <LayoutContainer>
      <HeaderSection>
        <Navbar 
          isSidebarOpen={sidebarOpen} 
          toggleSidebar={toggleSidebar}
        />
      </HeaderSection>

      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar}
      />

      <ContentSection>
        <MainContent>
          <Main>
            <Outlet />
          </Main>
        </MainContent>
      </ContentSection>

      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'shadow-lg',
          duration: 4000,
        }}
      />
    </LayoutContainer>
  );
};

export default Layout;
