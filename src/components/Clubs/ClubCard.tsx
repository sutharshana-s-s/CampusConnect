import React, { useState } from 'react';
import { Users, Crown, Clock, Eye } from 'lucide-react';
import type { Database } from '../../lib/supabase';
import styled from 'styled-components';

type Club = Database['public']['Tables']['clubs']['Row'];

interface ClubCardProps {
  club: Club;
  onJoin: (clubId: string) => void;
  onManage: (clubId: string) => void;
  onView: (clubId: string) => void;
  userRole?: 'club_head' | 'secretary' | 'treasurer' | 'event_manager' | 'member';
  membershipStatus?: 'pending' | 'approved' | 'rejected';
  userId?: string;
  isMember?: boolean;
}

const CardContainer = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid ${props => props.theme.colors.border};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  line-height: 1.4;
`;

const CategoryBadge = styled.span`
  display: inline-block;
  background-color: #dbeafe;
  color: #1e40af;
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  margin-top: 0.5rem;
  font-weight: 500;
`;

const MemberCount = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const MemberIcon = styled(Users)`
  width: 1rem;
  height: 1rem;
  margin-right: 0.25rem;
`;

const CardDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1.5rem;
  line-height: 1.6;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant: 'primary' | 'secondary' | 'success' | 'warning' | 'disabled' }>`
  flex: 1;
  min-width: 120px;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          &:hover {
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
          }
        `;
      case 'secondary':
        return `
          background-color: #f3f4f6;
          color: #374151;
          &:hover {
            background-color: #e5e7eb;
          }
        `;
      case 'success':
        return `
          background-color: #dcfce7;
          color: #166534;
          &:hover {
            background-color: #bbf7d0;
          }
        `;
      case 'warning':
        return `
          background-color: #fef3c7;
          color: #92400e;
          cursor: not-allowed;
        `;
      case 'disabled':
        return `
          background-color: #f3f4f6;
          color: #9ca3af;
          cursor: not-allowed;
        `;
      default:
        return '';
    }
  }}
`;

const ButtonIcon = styled.span`
  display: flex;
  align-items: center;
`;

const CrownIcon = styled(Crown)`
  width: 1rem;
  height: 1rem;
`;

const EyeIcon = styled(Eye)`
  width: 1rem;
  height: 1rem;
`;

const ClockIcon = styled(Clock)`
  width: 1rem;
  height: 1rem;
`;

const ClubCard: React.FC<ClubCardProps> = ({
  club,
  onJoin,
  onManage,
  onView,
  userRole,
  isMember,
  membershipStatus,
}) => {
  const [joinClicked, setJoinClicked] = useState(false);

  const handleJoin = () => {
    setJoinClicked(true);
    onJoin?.(club.id);
  };

  const canManage = (userRole === 'club_head') || userRole === 'secretary';

  const renderButtons = () => {
    // Manage + View buttons for club head or secretary
    if (canManage) {
      return (
        <ButtonContainer>
          <Button variant="primary" onClick={() => onManage?.(club.id)}>
            <ButtonIcon>
              <CrownIcon />
            </ButtonIcon>
            Manage
          </Button>
          <Button variant="secondary" onClick={() => onView?.(club.id)}>
            <ButtonIcon>
              <EyeIcon />
            </ButtonIcon>
            View
          </Button>
        </ButtonContainer>
      );
    }

    // Approved members get View button
    if (isMember && membershipStatus === 'approved') {
      return (
        <ButtonContainer>
          <Button variant="success" onClick={() => onView?.(club.id)}>
            <ButtonIcon>
              <EyeIcon />
            </ButtonIcon>
            View Club
          </Button>
        </ButtonContainer>
      );
    }

    // Pending state or join already clicked
    if ((isMember && membershipStatus === 'pending') || joinClicked) {
      return (
        <ButtonContainer>
          <Button variant="warning">
            <ButtonIcon>
              <ClockIcon />
            </ButtonIcon>
            Pending
          </Button>
          <Button variant="secondary" onClick={() => onView?.(club.id)}>
            <ButtonIcon>
              <EyeIcon />
            </ButtonIcon>
            View
          </Button>
        </ButtonContainer>
      );
    }

    // Default (non-members): Join + View
    return (
      <ButtonContainer>
        <Button variant="primary" onClick={handleJoin}>
          Join Club
        </Button>
        <Button variant="secondary" onClick={() => onView?.(club.id)}>
          <ButtonIcon>
            <EyeIcon />
          </ButtonIcon>
          View
        </Button>
      </ButtonContainer>
    );
  };

  return (
    <CardContainer>
      <CardHeader>
        <div>
          <CardTitle>{club.name}</CardTitle>
          <CategoryBadge>{club.category}</CategoryBadge>
        </div>
        <MemberCount>
          <MemberIcon />
          <span>{club.member_count || 0}</span>
        </MemberCount>
      </CardHeader>

      <CardDescription>{club.description}</CardDescription>

      {renderButtons()}
    </CardContainer>
  );
};

export default ClubCard;
