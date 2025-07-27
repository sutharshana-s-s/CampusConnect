import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Filter, Plus, Users } from 'lucide-react';
import { fetchClubs, joinClub, fetchUserClubMemberships } from '../store/slices/clubSlice';
import ClubCard from '../components/Clubs/ClubCard';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store/store';
import CreateClub from '../components/CreateClub/CreateClub';
import styled, { keyframes } from 'styled-components';

export type ClubRole = 'club_head' | 'secretary' | 'treasurer' | 'event_manager' | 'member';
export const isValidClubRole = (role: string): role is ClubRole =>
  ['club_head', 'secretary', 'treasurer', 'event_manager', 'member'].includes(role);

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const ClubsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (min-width: 640px) {
    gap: 2rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 24rem;
`;

const Spinner = styled.div`
  width: 2rem;
  height: 2rem;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const HeaderTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  line-height: 1.2;
  
  @media (min-width: 640px) {
    font-size: 2rem;
  }
  
  @media (min-width: 768px) {
    font-size: 2.25rem;
  }
`;

const HeaderSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0.5rem 0 0 0;
  font-size: 1rem;
  line-height: 1.5;
  
  @media (min-width: 640px) {
    font-size: 1.125rem;
  }
`;

const CreateClubButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  align-self: flex-start;
  
  @media (min-width: 768px) {
    align-self: center;
    padding: 0.875rem 1.5rem;
  }
  
  &:hover {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
`;

const ButtonIcon = styled(Plus)`
  width: 1.25rem;
  height: 1.25rem;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  position: relative;
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 36rem;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid ${props => props.theme.colors.border};
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background-color: ${props => props.theme.isDark ? '#475569' : '#f1f5f9'};
  border-radius: 0.5rem;
  color: ${props => props.theme.colors.textSecondary};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
  
  &:hover {
    background-color: ${props => props.theme.isDark ? '#64748b' : '#e2e8f0'};
    color: ${props => props.theme.colors.text};
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const SearchFilterContainer = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
`;

const SearchFilterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const InputContainer = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  width: 1.25rem;
  height: 1.25rem;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.875rem 0.75rem 0.875rem 2.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  appearance: none;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const StatCard = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.25rem;
  text-align: center;
  transition: transform 0.2s ease;
  border: 1px solid ${props => props.theme.colors.border};
  
  @media (min-width: 640px) {
    padding: 1.5rem;
  }
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const StatValue = styled.div<{ color: string }>`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.color};
  margin-bottom: 0.5rem;
  line-height: 1;
  
  @media (min-width: 640px) {
    font-size: 2rem;
  }
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  font-weight: 500;
`;

const ClubsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid ${props => props.theme.colors.border};
  
  @media (min-width: 640px) {
    padding: 4rem 2rem;
  }
`;

const EmptyIcon = styled(Users)`
  width: 3rem;
  height: 3rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 auto 1rem;
  
  @media (min-width: 640px) {
    width: 4rem;
    height: 4rem;
  }
`;

const EmptyTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
  
  @media (min-width: 640px) {
    font-size: 1.25rem;
  }
`;

const EmptyText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const SearchIcon = styled(Search)`
  width: 1.25rem;
  height: 1.25rem;
`;

const FilterIcon = styled(Filter)`
  width: 1.25rem;
  height: 1.25rem;
`;

const Clubs: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { clubs, loading, userClubMemberships } = useSelector((state: RootState) => state.clubs);
  const { user } = useSelector((state: RootState) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCreateClubModal, setShowCreateClubModal] = useState(false);

  useEffect(() => {
    dispatch(fetchClubs());
    if (user?.id) dispatch(fetchUserClubMemberships(user.id));
  }, [dispatch, user?.id]);

  const handleJoinClub = async (clubId: string) => {
    if (!user || !user.id) return;
    try {
      await dispatch(joinClub({ clubId, userId: user.id })).unwrap();
      toast.success('Join request submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit join request');
    }
  };

  const handleManageClub = (clubId: string, clubName: string) => {
    navigate(`/club-management?clubId=${clubId}&clubName=${encodeURIComponent(clubName)}`);
  };

  const handleViewClub = (clubId: string, clubName: string) => {
    navigate(`/view-club/${clubId}?name=${encodeURIComponent(clubName)}`);
  };

  const categories = ['Academic', 'Sports', 'Cultural', 'Technical', 'Social Service', 'Arts'];

  const filteredClubs = clubs.filter(club => {
    const matchesSearch =
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || club.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getMembershipDetails = (clubId: string) => {
    const membership = userClubMemberships?.find(m => m.club_id === clubId);
    const isApproved = membership?.status === 'approved';

    let userRole: ClubRole | undefined;

    if (user?.role === 'club_head') {
      userRole = user?.role;
    } else if (membership?.position) {
      const normalized = membership.position.toLowerCase().replace(/\s+/g, '_');
      userRole = isValidClubRole(normalized) ? (normalized as ClubRole) : undefined;
    }

    return {
      isApproved,
      userRole,
      status: membership?.status
    };
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
      </LoadingContainer>
    );
  }

  return (
    <ClubsContainer>
      <Header>
        <HeaderContent>
          <HeaderTitle>Student Clubs</HeaderTitle>
          <HeaderSubtitle>Discover and join amazing student organizations</HeaderSubtitle>
        </HeaderContent>

        {user?.role === 'club_head' && (
          <CreateClubButton onClick={() => setShowCreateClubModal(true)}>
            <ButtonIcon />
            Create Club
          </CreateClubButton>
        )}
      </Header>

      {user?.role === 'club_head' && showCreateClubModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalCloseButton onClick={() => setShowCreateClubModal(false)}>
              ✕
            </ModalCloseButton>
            <ModalBody>
              <CreateClub onSuccess={() => setShowCreateClubModal(false)} />
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}

      <SearchFilterContainer>
        <SearchFilterGrid>
          <InputContainer>
            <InputIcon>
              <SearchIcon />
            </InputIcon>
            <SearchInput
              type="text"
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputContainer>

          <InputContainer>
            <InputIcon>
              <FilterIcon />
            </InputIcon>
            <FilterSelect
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </FilterSelect>
          </InputContainer>
        </SearchFilterGrid>
      </SearchFilterContainer>

      <StatsGrid>
        <StatCard>
          <StatValue color="#3b82f6">{clubs.length}</StatValue>
          <StatLabel>Total Clubs</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue color="#10b981">{categories.length}</StatValue>
          <StatLabel>Categories</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue color="#8b5cf6">
            {clubs.reduce((sum, club) => sum + (club.member_count || 0), 0)}
          </StatValue>
          <StatLabel>Total Members</StatLabel>
        </StatCard>
      </StatsGrid>

      <ClubsGrid>
        {filteredClubs.map(club => {
          const { userRole, status } = getMembershipDetails(club.id);

          return (
            <ClubCard
              key={club.id}
              club={club}
              onJoin={handleJoinClub}
              onManage={() => handleManageClub(club.id, club.name)}
              onView={() => handleViewClub(club.id, club.name)}
              userRole={userRole}
              membershipStatus={status}
              isMember={!!status}
              userId={user?.id}
            />
          );
        })}
      </ClubsGrid>

      {filteredClubs.length === 0 && (
        <EmptyState>
          <EmptyIcon />
          <EmptyTitle>No clubs found</EmptyTitle>
          <EmptyText>Try adjusting your search or filter criteria</EmptyText>
        </EmptyState>
      )}
    </ClubsContainer>
  );
};

export default Clubs;
