import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Users, AlertCircle, ShoppingCart, MessageSquare, Clock } from 'lucide-react';
import styled from 'styled-components';

interface ActivityItem {
  id: string;
  type: 'club' | 'hostel' | 'canteen' | 'marketplace' | 'message';
  title: string;
  description: string;
  timestamp: Date;
  status?: 'pending' | 'approved' | 'completed' | 'urgent';
}

const ActivityContainer = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
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
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.3s;
  background-color: ${props => props.theme.isDark ? '#334155' : '#f9fafb'};
  
  &:hover {
    background-color: ${props => props.theme.isDark ? '#475569' : '#f3f4f6'};
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
  margin-top: 1.5rem;
  text-align: center;
  color: #2563eb;
  font-size: 0.875rem;
  font-weight: 500;
  
  &:hover {
    color: #1d4ed8;
  }
`;

const UsersIcon = styled(Users)`
  width: 1.25rem;
  height: 1.25rem;
  color: #3b82f6;
`;

const AlertCircleIcon = styled(AlertCircle)`
  width: 1.25rem;
  height: 1.25rem;
  color: #f59e0b;
`;

const ShoppingCartIcon = styled(ShoppingCart)`
  width: 1.25rem;
  height: 1.25rem;
  color: #10b981;
`;

const MessageSquareIcon = styled(MessageSquare)`
  width: 1.25rem;
  height: 1.25rem;
  color: #8b5cf6;
`;

const ClockIcon = styled(Clock)`
  width: 1.25rem;
  height: 1.25rem;
  color: #6b7280;
`;

const RecentActivity: React.FC = () => {
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'club',
      title: 'Photography Club',
      description: 'Your membership request has been approved',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'approved',
    },
    {
      id: '2',
      type: 'canteen',
      title: 'Order #1234',
      description: 'Your lunch order is ready for pickup',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      status: 'completed',
    },
    {
      id: '3',
      type: 'hostel',
      title: 'Maintenance Request',
      description: 'Plumbing issue in Room 302B - In Progress',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'pending',
    },
    {
      id: '4',
      type: 'marketplace',
      title: 'New Message',
      description: 'Someone is interested in your Chemistry textbook',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      status: 'pending',
    },
    {
      id: '5',
      type: 'club',
      title: 'Coding Club Event',
      description: 'Hackathon registration closes tomorrow',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: 'urgent',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'club_joined':
        return <UsersIcon />;
      case 'complaint_submitted':
        return <AlertCircleIcon />;
      case 'order_placed':
        return <ShoppingCartIcon />;
      case 'item_sold':
        return <MessageSquareIcon />;
      default:
        return <ClockIcon />;
    }
  };

  return (
    <ActivityContainer>
      <ActivityTitle>Recent Activity</ActivityTitle>
      
      <ActivityList>
        {activities.map((activity) => (
          <ActivityItem key={activity.id}>
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
                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
              </ActivityTime>
            </ActivityContent>
          </ActivityItem>
        ))}
      </ActivityList>
      
      <ViewAllButton>
        View all activities
      </ViewAllButton>
    </ActivityContainer>
  );
};

export default RecentActivity;