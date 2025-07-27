import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Users, User, Crown, Shield, Star, Calendar, Building, Users2, Award, Clock, MapPin, Mail, Phone } from 'lucide-react';
import { AppDispatch, RootState } from '../store/store';
import { fetchClubMembers } from '../store/slices/clubSlice';
import { supabase } from '../lib/supabase';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const ViewClubContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Header = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 2rem;
  border: 1px solid ${props => props.theme.colors.border};
`;

const ClubTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
  
  @media (min-width: 640px) {
    font-size: 2.5rem;
  }
`;

const ClubDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.125rem;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
`;

const ClubMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const MetaIcon = styled.div`
  color: #3b82f6;
  display: flex;
  align-items: center;
`;

const CategoryBadge = styled.span`
  background-color: #dbeafe;
  color: #1e40af;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 600;
  display: inline-block;
`;

const StatusBadge = styled.span<{ isActive: boolean }>`
  background-color: ${props => props.isActive ? '#dcfce7' : '#fef3c7'};
  color: ${props => props.isActive ? '#166534' : '#d97706'};
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 600;
  display: inline-block;
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

const Sidebar = styled.div`
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

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CardIcon = styled.div`
  color: #3b82f6;
  display: flex;
  align-items: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const StatCard = styled.div`
  background-color: ${props => props.theme.isDark ? '#334155' : '#f8fafc'};
  border-radius: 0.75rem;
  padding: 1rem;
  text-align: center;
  border: 1px solid ${props => props.theme.colors.border};
`;

const StatValue = styled.div<{ color: string }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.color};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  font-weight: 500;
`;

const LoadingText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.125rem;
  text-align: center;
  padding: 2rem;
`;

const EmptyMessage = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  padding: 2rem;
`;

const MembersList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const MemberItem = styled.li`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
  background-color: ${props => props.theme.isDark ? '#334155' : '#ffffff'};
  
  &:hover {
    background-color: ${props => props.theme.isDark ? '#475569' : '#f8fafc'};
    border-color: ${props => props.theme.isDark ? '#64748b' : '#cbd5e1'};
  }
`;

const MemberInfo = styled.div`
  flex: 1;
`;

const MemberName = styled.p`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.25rem 0;
`;

const MemberEmail = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const PositionBadge = styled.span<{ position: string }>`
  background-color: #dbeafe;
  color: #1e40af;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
  text-transform: capitalize;
  
  ${props => {
    switch (props.position) {
      case 'head':
        return 'background-color: #fef3c7; color: #d97706;';
      case 'secretary':
        return 'background-color: #dcfce7; color: #166534;';
      case 'treasurer':
        return 'background-color: #fef2f2; color: #dc2626;';
      case 'event_manager':
        return 'background-color: #f3e8ff; color: #7c3aed;';
      default:
        return 'background-color: #dbeafe; color: #1e40af;';
    }
  }}
`;

const ClubDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: ${props => props.theme.isDark ? '#334155' : '#f8fafc'};
  border-radius: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
`;

const DetailIcon = styled.div`
  color: #3b82f6;
  display: flex;
  align-items: center;
`;

const DetailContent = styled.div`
  flex: 1;
`;

const DetailLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const UsersIcon = styled(Users)`
  width: 1.25rem;
  height: 1.25rem;
`;

const BuildingIcon = styled(Building)`
  width: 1.25rem;
  height: 1.25rem;
`;

const CalendarIcon = styled(Calendar)`
  width: 1.25rem;
  height: 1.25rem;
`;

const Users2Icon = styled(Users2)`
  width: 1.25rem;
  height: 1.25rem;
`;

const AwardIcon = styled(Award)`
  width: 1.25rem;
  height: 1.25rem;
`;

const ClockIcon = styled(Clock)`
  width: 1.25rem;
  height: 1.25rem;
`;

const MapPinIcon = styled(MapPin)`
  width: 1.25rem;
  height: 1.25rem;
`;

const MailIcon = styled(Mail)`
  width: 1.25rem;
  height: 1.25rem;
`;

const PhoneIcon = styled(Phone)`
  width: 1.25rem;
  height: 1.25rem;
`;

interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  club_head_id: string;
  member_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const ViewClub: React.FC = () => {
  const { clubId } = useParams();
  const search = new URLSearchParams(useLocation().search);
  const name = search.get('name');

  const dispatch = useDispatch<AppDispatch>();
  const { clubMembers, loading } = useSelector((state: RootState) => state.clubs);
  const [club, setClub] = useState<Club | null>(null);
  const [clubLoading, setClubLoading] = useState(true);

  useEffect(() => {
    const fetchClubData = async () => {
      if (clubId) {
        try {
          const { data, error } = await supabase
            .from('clubs')
            .select('*')
            .eq('id', clubId)
            .single();

          if (error) {
            console.error('Error fetching club:', error);
          } else {
            setClub(data);
          }
        } catch (error) {
          console.error('Error fetching club:', error);
        } finally {
          setClubLoading(false);
        }
      }
    };

    fetchClubData();
  }, [clubId]);

  useEffect(() => {
    if (clubId) {
      dispatch(fetchClubMembers(clubId));
    }
  }, [clubId, dispatch]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPositionCount = (position: string) => {
    return clubMembers.filter(member => member.position === position).length;
  };

  if (clubLoading || loading) {
    return (
      <ViewClubContainer>
        <LoadingText>Loading club information...</LoadingText>
      </ViewClubContainer>
    );
  }

  if (!club) {
    return (
      <ViewClubContainer>
        <EmptyMessage>Club not found.</EmptyMessage>
      </ViewClubContainer>
    );
  }

  return (
    <ViewClubContainer>
      <Header>
        <ClubTitle>{club.name}</ClubTitle>
        <ClubDescription>{club.description}</ClubDescription>
        
        <ClubMeta>
          <MetaItem>
            <MetaIcon>
              <BuildingIcon />
            </MetaIcon>
            <span>Category: {club.category}</span>
          </MetaItem>
          
          <MetaItem>
            <MetaIcon>
              <UsersIcon />
            </MetaIcon>
            <span>{club.member_count} members</span>
          </MetaItem>
          
          <MetaItem>
            <MetaIcon>
              <CalendarIcon />
            </MetaIcon>
            <span>Created {formatDate(club.created_at)}</span>
          </MetaItem>
        </ClubMeta>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <CategoryBadge>{club.category}</CategoryBadge>
          <StatusBadge isActive={club.is_active}>
            {club.is_active ? 'Active' : 'Inactive'}
          </StatusBadge>
        </div>
      </Header>

      <ContentGrid>
        <MainContent>
          <Card>
            <CardTitle>
              <CardIcon>
                <Users2Icon />
              </CardIcon>
              Club Members
            </CardTitle>
            
          {clubMembers.length === 0 ? (
              <EmptyMessage>No members found.</EmptyMessage>
          ) : (
              <MembersList>
              {clubMembers.map((member) => (
                  <MemberItem key={member.id}>
                    <MemberInfo>
                      <MemberName>
                      {member.profile?.full_name || member.profile?.email}
                      </MemberName>
                      <MemberEmail>{member.profile?.email}</MemberEmail>
                    </MemberInfo>
                    <PositionBadge position={member.position}>
                    {member.position}
                    </PositionBadge>
                  </MemberItem>
                ))}
              </MembersList>
            )}
          </Card>
        </MainContent>

        <Sidebar>
          <Card>
            <CardTitle>
              <CardIcon>
                <AwardIcon />
              </CardIcon>
              Club Statistics
            </CardTitle>
            
            <StatsGrid>
              <StatCard>
                <StatValue color="#3b82f6">{club.member_count}</StatValue>
                <StatLabel>Total Members</StatLabel>
              </StatCard>
              
              <StatCard>
                <StatValue color="#10b981">{getPositionCount('secretary')}</StatValue>
                <StatLabel>Secretaries</StatLabel>
              </StatCard>
              
              <StatCard>
                <StatValue color="#f59e0b">{getPositionCount('treasurer')}</StatValue>
                <StatLabel>Treasurers</StatLabel>
              </StatCard>
              
              <StatCard>
                <StatValue color="#8b5cf6">{getPositionCount('event_manager')}</StatValue>
                <StatLabel>Event Managers</StatLabel>
              </StatCard>
              
              <StatCard>
                <StatValue color="#ef4444">{getPositionCount('member')}</StatValue>
                <StatLabel>Regular Members</StatLabel>
              </StatCard>
              
              <StatCard>
                <StatValue color="#06b6d4">{clubMembers.filter(m => m.status === 'pending').length}</StatValue>
                <StatLabel>Pending Requests</StatLabel>
              </StatCard>
            </StatsGrid>
          </Card>

          <Card>
            <CardTitle>
              <CardIcon>
                <BuildingIcon />
              </CardIcon>
              Club Details
            </CardTitle>
            
                         <ClubDetails>
               <DetailItem>
                 <DetailIcon>
                   <CalendarIcon />
                 </DetailIcon>
                 <DetailContent>
                   <DetailLabel>Created</DetailLabel>
                   <DetailValue>{formatDate(club.created_at)}</DetailValue>
                 </DetailContent>
               </DetailItem>
              
              <DetailItem>
                <DetailIcon>
                  <ClockIcon />
                </DetailIcon>
                <DetailContent>
                  <DetailLabel>Last Updated</DetailLabel>
                  <DetailValue>{formatDate(club.updated_at)}</DetailValue>
                </DetailContent>
              </DetailItem>
              
              <DetailItem>
                <DetailIcon>
                  <MapPinIcon />
                </DetailIcon>
                <DetailContent>
                  <DetailLabel>Category</DetailLabel>
                  <DetailValue>{club.category}</DetailValue>
                </DetailContent>
              </DetailItem>
              
              <DetailItem>
                <DetailIcon>
                  <UsersIcon />
                </DetailIcon>
                <DetailContent>
                  <DetailLabel>Status</DetailLabel>
                  <DetailValue>{club.is_active ? 'Active' : 'Inactive'}</DetailValue>
                </DetailContent>
              </DetailItem>
            </ClubDetails>
          </Card>
        </Sidebar>
      </ContentGrid>
    </ViewClubContainer>
  );
};

export default ViewClub;
