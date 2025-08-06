import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, Building, UtensilsCrossed, ShoppingBag } from 'lucide-react';
import styled from 'styled-components';
import { fetchDashboardStats } from '../../store/slices/dashboardSlice';
import LoadingSpinner from '../Loading/LoadingSpinner';
import LoadingSkeleton from '../Loading/LoadingSkeleton';
import type { RootState, AppDispatch } from '../../store/store';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  change?: string;
}

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
`;

const StatCardContainer = styled.div<{ $color: string }>`
  background: ${props => props.$color};
  border-radius: 1rem;
  padding: 1.5rem;
  color: white;
  position: relative;
  overflow: hidden;
`;

const StatContent = styled.div`
  position: relative;
  z-index: 2;
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const StatTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
  opacity: 0.9;
`;

const StatIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1;
  
  @media (min-width: 480px) {
    font-size: 2rem;
  }
  
  @media (min-width: 640px) {
    font-size: 2.25rem;
  }
`;

const StatChange = styled.div<{ $changeType: 'positive' | 'negative' }>`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.$changeType === 'positive' ? '#bbf7d0' : '#fecaca'};
`;

const UsersIcon = styled(Users)`
  width: 1.5rem;
  height: 1.5rem;
  color: white;
`;

const BuildingIcon = styled(Building)`
  width: 1.5rem;
  height: 1.5rem;
  color: white;
`;

const UtensilsCrossedIcon = styled(UtensilsCrossed)`
  width: 1.5rem;
  height: 1.5rem;
  color: white;
`;

const ShoppingBagIcon = styled(ShoppingBag)`
  width: 1.5rem;
  height: 1.5rem;
  color: white;
`;

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, change }) => (
  <StatCardContainer $color={color}>
    <StatContent>
      <StatHeader>
        <StatTitle>{title}</StatTitle>
        <StatIcon>
          {icon}
        </StatIcon>
      </StatHeader>
      <StatValue>{value}</StatValue>
      {change && change.trim() !== '' && (
        <StatChange $changeType={change.includes('+') ? 'positive' : 'negative'}>
          {change} from last month
        </StatChange>
      )}
    </StatContent>
  </StatCardContainer>
);

const DashboardStats: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, loading } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);



  if (loading) {
    return (
      <StatsGrid>
        {[1, 2, 3, 4].map((index) => (
          <StatCardContainer key={index} $color="linear-gradient(to right, #6b7280, #4b5563)">
            <StatContent>
              <StatHeader>
                <StatTitle>
                  <LoadingSkeleton height="1.25rem" width="80px" />
                </StatTitle>
                <StatIcon>
                  <LoadingSpinner size="small" />
                </StatIcon>
              </StatHeader>
              <StatValue>
                <LoadingSkeleton height="2rem" width="60px" />
              </StatValue>
            </StatContent>
          </StatCardContainer>
        ))}
      </StatsGrid>
    );
  }

  if (!stats) {
    return (
      <StatsGrid>
        {[1, 2, 3, 4].map((index) => (
          <StatCardContainer key={index} $color="linear-gradient(to right, #6b7280, #4b5563)">
            <StatContent>
              <StatHeader>
                <StatTitle>No Data</StatTitle>
                <StatIcon>
                  <UsersIcon />
                </StatIcon>
              </StatHeader>
              <StatValue>0</StatValue>
            </StatContent>
          </StatCardContainer>
        ))}
      </StatsGrid>
    );
  }

  const dashboardStats = [
    {
      title: 'Total Students',
      value: stats.totalStudents.toLocaleString(),
      change: stats.studentChange,
      icon: <UsersIcon />,
      color: 'linear-gradient(to right, #3b82f6, #2563eb)',
    },
    {
      title: 'Active Clubs',
      value: stats.activeClubs.toString(),
      change: stats.clubChange,
      icon: <BuildingIcon />,
      color: 'linear-gradient(to right, #10b981, #059669)',
    },
    {
      title: 'Canteen Orders',
      value: stats.canteenOrders.toLocaleString(),
      change: stats.orderChange,
      icon: <UtensilsCrossedIcon />,
      color: 'linear-gradient(to right, #f59e0b, #ea580c)',
    },
    {
      title: 'Marketplace Items',
      value: stats.marketplaceItems.toString(),
      change: stats.marketplaceChange,
      icon: <ShoppingBagIcon />,
      color: 'linear-gradient(to right, #8b5cf6, #7c3aed)',
    },
  ];


  
  return (
    <StatsGrid>
      {dashboardStats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </StatsGrid>
  );
};

export default DashboardStats;