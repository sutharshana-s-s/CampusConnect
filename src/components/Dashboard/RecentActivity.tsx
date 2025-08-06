import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Users, AlertCircle, ShoppingCart, MessageSquare, Clock, ChevronRight } from 'lucide-react';
import styled from 'styled-components';
import { fetchUserActivities } from '../../store/slices/activitySlice';
import type { RootState, AppDispatch } from '../../store/store';

interface ActivityItem {
  id: string;
  type: 'club_joined' | 'complaint_submitted' | 'order_placed' | 'item_sold' | 'message_received';
  title: string;
  description: string;
  timestamp: string; // ISO string from the store
  status?: 'pending' | 'approved' | 'completed' | 'urgent';
  related_id?: string;
}

const ActivityContainer = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  min-height: 200px;
  max-height: 600px;
  
  @media (min-width: 480px) {
    padding: 1.25rem;
  }
  
  @media (min-width: 640px) {
    padding: 1.5rem;
  }
`;

const ActivityTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.5rem;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-color: ${props => props.theme.isDark ? '#334155' : '#f9fafb'};
  cursor: pointer;
  border: 1px solid transparent;
  
  @media (min-width: 480px) {
    gap: 1rem;
    padding: 1rem;
  }
`;

const ActivityIcon = styled.div`
  flex-shrink: 0;
  margin-top: 0.25rem;
`;

const ActivityContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ActivityHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ActivityTitleText = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
  background-color: ${props => {
    switch (props.$status) {
      case 'approved':
      case 'completed':
        return '#dcfce7';
      case 'pending':
        return '#fef3c7';
      case 'urgent':
        return '#fee2e2';
      default:
        return props.theme.isDark ? '#475569' : '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'approved':
      case 'completed':
        return '#166534';
      case 'pending':
        return '#92400e';
      case 'urgent':
        return '#991b1b';
      default:
        return props.theme.colors.text;
    }
  }};
`;

const ActivityDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 0.25rem;
`;

const ActivityTime = styled.p`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
`;

const TimeIcon = styled(Clock)`
  width: 0.75rem;
  height: 0.75rem;
  margin-right: 0.25rem;
`;

const ViewAllButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-top: 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
`;

const ChevronRightIcon = styled(ChevronRight)`
  width: 1.25rem;
  height: 1.25rem;
  color: #6b7280;
  margin-left: 0.5rem;
  flex-shrink: 0;
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

const RecentActivity: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activities, loading } = useSelector((state: RootState) => state.activity);
  const { user } = useSelector((state: RootState) => state.auth);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserActivities(user.id));
    }
  }, [dispatch, user?.id]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'club_joined':
        return <Users />;
      case 'complaint_submitted':
        return <AlertCircle />;
      case 'order_placed':
        return <ShoppingCart />;
      case 'item_sold':
        return <MessageSquare />;
      default:
        return <Clock />;
    }
  };

  const handleActivityClick = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'club_joined':
        // Navigate to the specific club page if we have the club ID
        if (activity.related_id) {
          navigate(`/view-club/${activity.related_id}`);
        } else {
          // Fallback to general clubs page
          navigate('/clubs');
        }
        break;
      case 'complaint_submitted':
        // Navigate to hostel complaints page
        navigate('/hostel-complaints');
        break;
      case 'order_placed':
        // Navigate to order tracking page
        navigate('/order-tracking');
        break;
      case 'item_sold':
        // Navigate to marketplace page
        navigate('/marketplace');
        break;
      case 'message_received':
        // Navigate to messages page
        navigate('/messages');
        break;
      default:
        // No specific navigation for this type
        break;
    }
  };

  if (loading) {
    return (
      <ActivityContainer>
        <ActivityTitle>Recent Activity</ActivityTitle>
        <EmptyStateContainer>
          <div style={{ textAlign: 'center', color: '#64748b' }}>
            Loading activities...
          </div>
        </EmptyStateContainer>
      </ActivityContainer>
    );
  }

  return (
    <ActivityContainer>
      <ActivityTitle>
        Recent Activity
        {activities.length > 0 && (
          <span style={{ 
            fontSize: '0.875rem', 
            fontWeight: 'normal', 
            color: '#64748b',
            marginLeft: '0.5rem'
          }}>
            ({activities.length})
          </span>
        )}
      </ActivityTitle>
      
      <ActivityList>
        {activities.length === 0 ? (
          <EmptyStateContainer>
            <EmptyStateIcon>
              <Clock size={48} />
            </EmptyStateIcon>
            <EmptyStateTitle>No Recent Activity</EmptyStateTitle>
            <EmptyStateDescription>
              Your recent activities will appear here once you start using the platform.
            </EmptyStateDescription>
          </EmptyStateContainer>
        ) : (
          activities
            .slice(0, showAll ? activities.length : 3)
            .map((activity) => (
              <ActivityItem key={activity.id} onClick={() => handleActivityClick(activity)}>
                <ActivityIcon>
                  {getActivityIcon(activity.type)}
                </ActivityIcon>
                
                <ActivityContent>
                  <ActivityHeader>
                    <ActivityTitleText>
                      {activity.title}
                    </ActivityTitleText>
                    {activity.status && (
                      <StatusBadge $status={activity.status}>
                        {activity.status}
                      </StatusBadge>
                    )}
                  </ActivityHeader>
                  <ActivityDescription>{activity.description}</ActivityDescription>
                  <ActivityTime>
                    <TimeIcon />
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </ActivityTime>
                </ActivityContent>
                <ChevronRightIcon className="chevron-icon" />
              </ActivityItem>
            ))
        )}
      </ActivityList>
      
      {activities.length > 3 && (
        <ViewAllButton onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show Less' : `View all ${activities.length} activities (${activities.length - 3} more)`}
        </ViewAllButton>
      )}
    </ActivityContainer>
  );
};

export default RecentActivity;