import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Users, Building, UtensilsCrossed, ShoppingBag, TrendingUp, Calendar, Bell } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import DashboardStats from '../components/Dashboard/DashboardStats';
import RecentActivity from '../components/Dashboard/RecentActivity';
import type { RootState } from '../store/store';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const WelcomeSection = styled.div`
  background: ${props => props.theme.isDark ? 'linear-gradient(135deg, #1e293b, #334155)' : 'linear-gradient(135deg, #3b82f6, #2563eb)'};
  border-radius: 1rem;
  padding: 2rem;
  color: white;
  position: relative;
  overflow: hidden;
`;

const WelcomeContent = styled.div`
  position: relative;
  z-index: 2;
`;

const WelcomeTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
  
  @media (min-width: 640px) {
    font-size: 2.5rem;
  }
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.125rem;
  opacity: 0.9;
  margin: 0;
  
  @media (min-width: 640px) {
    font-size: 1.25rem;
  }
`;

const WelcomeIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  
  @media (min-width: 640px) {
    top: 2rem;
    right: 2rem;
  }
`;

const IconContainer = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (min-width: 640px) {
    width: 5rem;
    height: 5rem;
  }
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const ActionCard = styled(Link)`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid ${props => props.theme.colors.border};
  
  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const ActionIcon = styled.div<{ color: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const ActionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.5rem 0;
`;

const ActionDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;
`;

const ActionLink = styled.div`
  display: flex;
  align-items: center;
  color: #3b82f6;
  font-weight: 500;
  font-size: 0.875rem;
  
  ${ActionCard}:hover & {
    color: #2563eb;
  }
`;

const LinkText = styled.span``;

const LinkIcon = styled(TrendingUp)`
  width: 1rem;
  height: 1rem;
  margin-left: 0.5rem;
  transition: transform 0.3s ease;
  
  ${ActionCard}:hover & {
    transform: translateX(4px);
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Card = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CardIcon = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
`;

const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EventItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: ${props => props.theme.isDark ? '#334155' : '#f8fafc'};
  border-radius: 0.5rem;
`;

const EventIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const EventInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const EventTitle = styled.h4`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.25rem 0;
`;

const EventDetails = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  margin: 0;
`;

const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NotificationItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background-color: ${props => props.theme.isDark ? '#334155' : '#f8fafc'};
  border-radius: 0.5rem;
`;

const NotificationIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const NotificationInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationTitle = styled.h4`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.25rem 0;
`;

const NotificationDetails = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;
`;

const UsersIcon = styled(Users)`
  width: 1.25rem;
  height: 1.25rem;
`;

const BuildingIcon = styled(Building)`
  width: 1.25rem;
  height: 1.25rem;
`;

const UtensilsCrossedIcon = styled(UtensilsCrossed)`
  width: 1.25rem;
  height: 1.25rem;
`;

const ShoppingBagIcon = styled(ShoppingBag)`
  width: 1.25rem;
  height: 1.25rem;
`;

const TrendingUpIcon = styled(TrendingUp)`
  width: 2.5rem;
  height: 2.5rem;
  color: white;
`;

const CalendarIcon = styled(Calendar)`
  width: 1.25rem;
  height: 1.25rem;
`;

const BellIcon = styled(Bell)`
  width: 1.25rem;
  height: 1.25rem;
`;

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { isDark } = useTheme();

  const quickActions = [
    {
      title: 'Join a Club',
      description: 'Discover and join student organizations',
      icon: <UsersIcon />,
      color: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      path: '/clubs'
    },
    {
      title: 'Order Food',
      description: 'Browse canteen menu and place orders',
      icon: <UtensilsCrossedIcon />,
      color: 'linear-gradient(135deg, #f59e0b, #d97706)',
      path: '/canteen'
    },
    {
      title: 'Hostel Services',
      description: 'Manage your hostel accommodations',
      icon: <BuildingIcon />,
      color: 'linear-gradient(135deg, #10b981, #059669)',
      path: '/hostel'
    },
    {
      title: 'Marketplace',
      description: 'Buy and sell items with other students',
      icon: <ShoppingBagIcon />,
      color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      path: '/marketplace'
    }
  ];

  const upcomingEvents = [
    { title: 'Photography Workshop', date: 'Tomorrow, 2:00 PM' },
    { title: 'Basketball Tournament', date: 'Friday, 4:00 PM' },
    { title: 'Coding Competition', date: 'Next Week, 10:00 AM' }
  ];

  return (
    <DashboardContainer>
      <WelcomeSection>
        <WelcomeContent>
          <WelcomeTitle>
            Welcome back, {user?.full_name}!
          </WelcomeTitle>
          <WelcomeSubtitle>
            Ready to make the most of your campus experience today?
          </WelcomeSubtitle>
          <WelcomeIcon>
            <IconContainer>
              <TrendingUpIcon />
            </IconContainer>
          </WelcomeIcon>
        </WelcomeContent>
      </WelcomeSection>

      <DashboardStats />

      <QuickActionsGrid>
        {quickActions.map((action, index) => (
          <ActionCard key={index} to={action.path}>
            <ActionIcon color={action.color}>
              {action.icon}
            </ActionIcon>
            <ActionTitle>{action.title}</ActionTitle>
            <ActionDescription>{action.description}</ActionDescription>
          </ActionCard>
        ))}
      </QuickActionsGrid>

      <ContentGrid>
        <MainContent>
          <RecentActivity />
        </MainContent>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardIcon>
              <CalendarIcon />
            </CardIcon>
          </CardHeader>
          
          <EventList>
            {upcomingEvents.map((event, index) => (
              <EventItem key={index}>
                <EventIcon />
                <EventInfo>
                  <EventTitle>{event.title}</EventTitle>
                  <EventDetails>{event.date}</EventDetails>
                </EventInfo>
              </EventItem>
            ))}
          </EventList>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardIcon>
              <BellIcon />
            </CardIcon>
          </CardHeader>
          
          <NotificationList>
            <NotificationItem>
              <NotificationIcon />
              <NotificationInfo>
                <NotificationTitle>New club event posted</NotificationTitle>
                <NotificationDetails>Photography Club</NotificationDetails>
              </NotificationInfo>
            </NotificationItem>
            <NotificationItem>
              <NotificationIcon />
              <NotificationInfo>
                <NotificationTitle>Order ready for pickup</NotificationTitle>
                <NotificationDetails>Canteen Order #1234</NotificationDetails>
              </NotificationInfo>
            </NotificationItem>
            <NotificationItem>
              <NotificationIcon />
              <NotificationInfo>
                <NotificationTitle>Maintenance scheduled</NotificationTitle>
                <NotificationDetails>Block A - This weekend</NotificationDetails>
              </NotificationInfo>
            </NotificationItem>
          </NotificationList>
        </Card>
      </ContentGrid>
    </DashboardContainer>
  );
};

export default Dashboard;