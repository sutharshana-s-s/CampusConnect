import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Building, UtensilsCrossed, ShoppingBag, TrendingUp, Calendar, PlusCircle } from 'lucide-react';
import DashboardStats from '../components/Dashboard/DashboardStats';
import RecentActivity from '../components/Dashboard/RecentActivity';
import { fetchUpcomingEvents } from '../store/slices/eventsSlice';
import { fetchDashboardStats } from '../store/slices/dashboardSlice';
import type { RootState, AppDispatch } from '../store/store';
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
  
  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
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

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  min-height: 400px;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr;
    min-height: 500px;
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    min-height: 400px;
  }
  
  @media (min-width: 1280px) {
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
    min-height: 400px;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Card = styled.div<{ $expandable?: boolean; $expanded?: boolean }>`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  min-height: 200px;
  max-height: ${props => props.$expandable && props.$expanded ? 'none' : '500px'};
  transition: max-height 0.3s ease;
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

const EventList = styled.div<{ $showAll: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  overflow-y: auto;
  transition: max-height 0.3s ease;
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

const RightColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
  flex: 1;
`;

const EmptyStateIcon = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1rem;
`;

const EmptyStateTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.5rem 0;
`;

const EmptyStateDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.5;
  max-width: 300px;
`;

const ViewMoreButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  color: ${props => props.theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
  
  &:hover {
    background-color: ${props => props.theme.colors.background};
    border-color: ${props => props.theme.colors.primary};
  }
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

const CreateEventButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    transform: translateY(-1px);
  }
`;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { events, loading } = useSelector((state: RootState) => state.events);
  const [showAllEvents, setShowAllEvents] = useState(false);

  useEffect(() => {
    dispatch(fetchUpcomingEvents());
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  // Get role-specific quick actions
  const getQuickActions = () => {
    const allActions = [
      {
        title: 'Join a Club',
        description: 'Discover and join student organizations',
        icon: <UsersIcon />,
        color: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        path: '/clubs',
        roles: ['student', 'super_admin']
      },
      {
        title: 'Order Food',
        description: 'Browse canteen menu and place orders',
        icon: <UtensilsCrossedIcon />,
        color: 'linear-gradient(135deg, #f59e0b, #d97706)',
        path: '/canteen',
        roles: ['student', 'super_admin']
      },
      {
        title: 'Hostel Services',
        description: 'Manage your hostel accommodations',
        icon: <BuildingIcon />,
        color: 'linear-gradient(135deg, #10b981, #059669)',
        path: '/hostel',
        roles: ['student', 'hostel_admin', 'super_admin']
      },
      {
        title: 'Marketplace',
        description: 'Buy and sell items with other students',
        icon: <ShoppingBagIcon />,
        color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
        path: '/marketplace',
        roles: ['student', 'super_admin']
      },
      {
        title: 'Club Management',
        description: 'Manage your club and members',
        icon: <UsersIcon />,
        color: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        path: '/club-management',
        roles: ['club_head', 'super_admin']
      },
      {
        title: 'Canteen Orders',
        description: 'View and manage canteen orders',
        icon: <UtensilsCrossedIcon />,
        color: 'linear-gradient(135deg, #f59e0b, #d97706)',
        path: '/canteen-orders',
        roles: ['canteen_vendor', 'super_admin']
      },
      {
        title: 'Hostel Complaints',
        description: 'Manage hostel complaints and issues',
        icon: <BuildingIcon />,
        color: 'linear-gradient(135deg, #10b981, #059669)',
        path: '/hostel-complaints',
        roles: ['hostel_admin', 'super_admin']
      }
    ];

    return allActions.filter(action => action.roles.includes(user?.role || 'student'));
  };

  const quickActions = getQuickActions();

  // Format event date for display
  const formatEventDate = (dateString: string, timeString?: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today${timeString ? `, ${timeString}` : ''}`;
    } else if (diffDays === 1) {
      return `Tomorrow${timeString ? `, ${timeString}` : ''}`;
    } else if (diffDays < 7) {
      return `${date.toLocaleDateString('en-US', { weekday: 'long' })}${timeString ? `, ${timeString}` : ''}`;
    } else {
      return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}${timeString ? `, ${timeString}` : ''}`;
    }
  };

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

        <RightColumnContainer>
          <Card $expandable={true} $expanded={showAllEvents}>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardIcon>
                <CalendarIcon />
              </CardIcon>
              {user?.role === 'super_admin' && (
                <CreateEventButton onClick={() => navigate('/create-general-event')}>
                  <PlusCircle size={16} />
                  Create Event
                </CreateEventButton>
              )}
            </CardHeader>

            <EventList $showAll={showAllEvents}>
              {loading ? (
                <EmptyStateContainer>
                  <div style={{ textAlign: 'center', color: '#64748b' }}>
                    Loading events...
                  </div>
                </EmptyStateContainer>
              ) : events.length === 0 ? (
                <EmptyStateContainer>
                  <EmptyStateIcon>
                    <Calendar size={48} />
                  </EmptyStateIcon>
                  <EmptyStateTitle>No Upcoming Events</EmptyStateTitle>
                  <EmptyStateDescription>
                    No events are scheduled at the moment. Check back later for new events!
                  </EmptyStateDescription>
                </EmptyStateContainer>
              ) : (
                <>
                  {events
                    .slice(0, showAllEvents ? events.length : 3)
                    .map((event: { id: string; title: string; date: string; time?: string; location?: string; organizer?: string; type?: string }) => (
                      <EventItem key={event.id}>
                        <EventIcon>
                          {event.type === 'club_event' ? (
                            <Users size={16} />
                          ) : (
                            <Calendar size={16} />
                          )}
                        </EventIcon>
                        <EventInfo>
                          <EventTitle>{event.title}</EventTitle>
                          <EventDetails>
                            {formatEventDate(event.date, event.time)}
                            {event.location && ` • ${event.location}`}
                            {event.organizer && ` • ${event.organizer}`}
                          </EventDetails>
                        </EventInfo>
                      </EventItem>
                    ))
                  }

                  {events.length > 3 && (
                    <ViewMoreButton onClick={() => setShowAllEvents(!showAllEvents)}>
                      {showAllEvents ? 'Show Less' : `View all ${events.length} events (${events.length - 3} more)`}
                    </ViewMoreButton>
                  )}
                </>
              )}
            </EventList>
          </Card>
        </RightColumnContainer>
      </ContentGrid>
    </DashboardContainer>
  );
};

export default Dashboard;