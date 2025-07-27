import React from 'react';
import { Users, Building, UtensilsCrossed, ShoppingBag } from 'lucide-react';
import styled from 'styled-components';

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
  gap: 1.5rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
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
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1;
  
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
      {change && (
        <StatChange $changeType={change.includes('+') ? 'positive' : 'negative'}>
          {change} from last month
        </StatChange>
      )}
    </StatContent>
  </StatCardContainer>
);

const DashboardStats: React.FC = () => {
  const stats = [
    {
      title: 'Total Students',
      value: '2,847',
      change: '+12%',
      changeType: 'positive',
      icon: <UsersIcon />,
      color: 'linear-gradient(to right, #3b82f6, #2563eb)',
    },
    {
      title: 'Active Clubs',
      value: '24',
      change: '+3',
      changeType: 'positive',
      icon: <BuildingIcon />,
      color: 'linear-gradient(to right, #10b981, #059669)',
    },
    {
      title: 'Canteen Orders',
      value: '156',
      change: '+8%',
      changeType: 'positive',
      icon: <UtensilsCrossedIcon />,
      color: 'linear-gradient(to right, #f59e0b, #ea580c)',
    },
    {
      title: 'Marketplace Items',
      value: '89',
      change: '+15%',
      changeType: 'positive',
      icon: <ShoppingBagIcon />,
      color: 'linear-gradient(to right, #8b5cf6, #7c3aed)',
    },
  ];

  return (
    <StatsGrid>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </StatsGrid>
  );
};

export default DashboardStats;