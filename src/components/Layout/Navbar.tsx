import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Menu, User } from 'lucide-react';
import { signOut, clearUser } from '../../store/slices/authSlice';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import type { AppDispatch, RootState } from '../../store/store';
import styled from 'styled-components';

interface NavbarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4rem;
  background-color: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.75rem;
  z-index: 40;
  backdrop-filter: blur(8px);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden; /* Prevent content overflow */
  
  @media (min-width: 480px) {
    padding: 0 1rem;
  }
  
  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0; /* Allow shrinking */
  flex-shrink: 0;
  
  @media (min-width: 480px) {
    gap: 0.75rem;
  }
  
  @media (min-width: 640px) {
    gap: 1rem;
  }
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  color: ${props => props.theme.colors.textSecondary};
  border-radius: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
  
  @media (min-width: 769px) {
    display: none;
  }
  
  &:hover {
    background-color: ${props => props.theme.isDark ? '#334155' : '#f1f5f9'};
    color: ${props => props.theme.colors.text};
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const LogoLink = styled(Link)`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  flex: 1;
  
  @media (min-width: 480px) {
    font-size: 1.125rem;
  }
  
  @media (min-width: 640px) {
    font-size: 1.25rem;
  }
  
  &:hover {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
  
  @media (min-width: 480px) {
    gap: 0.5rem;
  }
  
  @media (min-width: 640px) {
    gap: 1rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  background-color: ${props => props.theme.isDark ? '#334155' : '#f8fafc'};
  
  @media (max-width: 640px) {
    display: none;
  }
`;

const MobileUserButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  color: ${props => props.theme.colors.textSecondary};
  border-radius: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
  
  @media (min-width: 641px) {
    display: none;
  }
  
  &:hover {
    background-color: ${props => props.theme.isDark ? '#334155' : '#f1f5f9'};
    color: ${props => props.theme.colors.text};
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const UserAvatar = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
`;

const UserName = styled.p`
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  font-size: 0.875rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserRole = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.75rem;
  margin: 0;
  text-transform: capitalize;
`;

const SignOutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  color: ${props => props.theme.colors.textSecondary};
  border-radius: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s ease;
  flex-shrink: 0;
  
  @media (min-width: 480px) {
    padding: 0.5rem 0.75rem;
  }
  
  @media (max-width: 640px) {
    gap: 0;
  }
  
  &:hover {
    background-color: ${props => props.theme.isDark ? '#334155' : '#f1f5f9'};
    color: ${props => props.theme.colors.text};
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const SignOutText = styled.span`
  @media (max-width: 640px) {
    display: none;
  }
`;

const Navbar: React.FC<NavbarProps> = ({ 
  isSidebarOpen, 
  toggleSidebar
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isDark } = useTheme();

  const handleSignOut = async () => {
    try {
      await dispatch(signOut()).unwrap();
      dispatch(clearUser());
      navigate('/auth');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <NavbarContainer>
      <LeftSection>
        <MenuButton onClick={toggleSidebar}>
          <Menu size={20} />
        </MenuButton>
        
        <LogoLink to="/dashboard">
          Campus Connect
        </LogoLink>
      </LeftSection>

      <RightSection>
        <ThemeToggle />
        
        <UserInfo>
          <UserAvatar>
            {user?.full_name?.charAt(0) || 'U'}
          </UserAvatar>
          <UserDetails>
            <UserName>{user?.full_name || 'User'}</UserName>
            <UserRole>{user?.role || 'student'}</UserRole>
          </UserDetails>
        </UserInfo>
        
        <MobileUserButton>
          <User size={20} />
        </MobileUserButton>
        
        <SignOutButton onClick={handleSignOut}>
          <LogOut size={16} />
          <SignOutText>Sign Out</SignOutText>
        </SignOutButton>
      </RightSection>
    </NavbarContainer>
  );
};

export default Navbar;