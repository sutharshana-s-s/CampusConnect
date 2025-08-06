import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AlertTriangle, Clock, CheckCircle, XCircle, Users, Building, Filter, Search } from 'lucide-react';
import { fetchAllComplaints, updateComplaintStatus } from '../store/slices/hostelSlice';
import toast from 'react-hot-toast';
import type { RootState, AppDispatch } from '../store/store';
import type { Database } from '../lib/supabase';
import styled, { keyframes } from 'styled-components';

type HostelComplaint = Database['public']['Tables']['hostel_complaints']['Row'] & {
  user_name?: string;
  room_number?: string;
};

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const HostelComplaintsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
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
    align-items: center;
    justify-content: space-between;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const HeaderTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  line-height: 1.2;
  
  @media (min-width: 640px) {
    font-size: 2.5rem;
  }
`;

const HeaderSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0.5rem 0 0 0;
  font-size: 1.125rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
`;

const StatCard = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  
  @media (min-width: 480px) {
    padding: 1.25rem;
  }
  
  @media (min-width: 640px) {
    padding: 1.5rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CardIcon = styled.div`
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const InfoValue = styled.span<{ color?: string }>`
  font-weight: 600;
  color: ${props => props.color || props.theme.colors.text};
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const SearchInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  flex: 1;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ComplaintsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ComplaintCard = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const ComplaintHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ComplaintInfo = styled.div`
  flex: 1;
`;

const ComplaintTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.5rem 0;
`;

const ComplaintMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1rem;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'open':
        return '#fef3c7';
      case 'in_progress':
        return '#dbeafe';
      case 'resolved':
        return '#d1fae5';
      default:
        return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'open':
        return '#92400e';
      case 'in_progress':
        return '#1e40af';
      case 'resolved':
        return '#065f46';
      default:
        return '#374151';
    }
  }};
`;

const PriorityBadge = styled.span<{ priority: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => {
    switch (props.priority) {
      case 'high':
        return '#fee2e2';
      case 'medium':
        return '#fef3c7';
      case 'low':
        return '#d1fae5';
      default:
        return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.priority) {
      case 'high':
        return '#991b1b';
      case 'medium':
        return '#92400e';
      case 'low':
        return '#065f46';
      default:
        return '#374151';
    }
  }};
`;

const ComplaintDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0 0 1rem 0;
`;

const ComplaintActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ variant: 'primary' | 'success' | 'warning' }>`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: #3b82f6;
          color: white;
          
          &:hover {
            background-color: #2563eb;
          }
        `;
      case 'success':
        return `
          background-color: #10b981;
          color: white;
          
          &:hover {
            background-color: #059669;
          }
        `;
      case 'warning':
        return `
          background-color: #f59e0b;
          color: white;
          
          &:hover {
            background-color: #d97706;
          }
        `;
    }
  }}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
`;

const EmptyIcon = styled(AlertTriangle)`
  width: 4rem;
  height: 4rem;
  color: #cbd5e1;
  margin: 0 auto 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.p`
  color: #64748b;
`;

const SearchIcon = styled(Search)`
  width: 1.25rem;
  height: 1.25rem;
`;

const FilterIcon = styled(Filter)`
  width: 1.25rem;
  height: 1.25rem;
`;

const BuildingIcon = styled(Building)`
  width: 1.5rem;
  height: 1.5rem;
`;

const UsersIcon = styled(Users)`
  width: 1.5rem;
  height: 1.5rem;
`;

const HostelComplaints: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { complaints, loading } = useSelector((state: RootState) => state.hostel);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    if (user) {
      dispatch(fetchAllComplaints());
    }
  }, [dispatch, user]);

  const handleUpdateStatus = async (complaintId: string, newStatus: string) => {
    try {
      await dispatch(updateComplaintStatus({ complaintId, status: newStatus })).unwrap();
      toast.success('Complaint status updated successfully!');
    } catch (error) {
      toast.error('Failed to update complaint status');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock />;
      case 'in_progress':
        return <AlertTriangle />;
      case 'resolved':
        return <CheckCircle />;
      default:
        return <XCircle />;
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.user_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: complaints.length,
    open: complaints.filter(c => c.status === 'open').length,
    inProgress: complaints.filter(c => c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
      </LoadingContainer>
    );
  }

  return (
    <HostelComplaintsContainer>
      {/* Header */}
      <Header>
        <HeaderContent>
          <HeaderTitle>Hostel Complaints Management</HeaderTitle>
          <HeaderSubtitle>Manage and resolve student complaints</HeaderSubtitle>
        </HeaderContent>
      </Header>

      {/* Stats */}
      <StatsGrid>
        <StatCard>
          <CardHeader>
            <CardTitle>Total Complaints</CardTitle>
            <CardIcon>
              <AlertTriangle />
            </CardIcon>
          </CardHeader>
          <CardContent>
            <InfoRow>
              <InfoLabel>Total:</InfoLabel>
              <InfoValue>{stats.total}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Open:</InfoLabel>
              <InfoValue color="#f59e0b">{stats.open}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>In Progress:</InfoLabel>
              <InfoValue color="#3b82f6">{stats.inProgress}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Resolved:</InfoLabel>
              <InfoValue color="#10b981">{stats.resolved}</InfoValue>
            </InfoRow>
          </CardContent>
        </StatCard>

        <StatCard>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardIcon>
              <UsersIcon />
            </CardIcon>
          </CardHeader>
          <CardContent>
            <InfoRow>
              <InfoLabel>High Priority:</InfoLabel>
              <InfoValue color="#ef4444">{complaints.filter(c => c.priority === 'high').length}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>This Week:</InfoLabel>
              <InfoValue color="#8b5cf6">{complaints.filter(c => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(c.created_at) > weekAgo;
              }).length}</InfoValue>
            </InfoRow>
          </CardContent>
        </StatCard>
      </StatsGrid>

      {/* Filters */}
      <FiltersContainer>
        <SearchInput
          type="text"
          placeholder="Search complaints..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </FilterSelect>
        <FilterSelect
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </FilterSelect>
      </FiltersContainer>

      {/* Complaints List */}
      <ComplaintsList>
        {filteredComplaints.length === 0 ? (
          <EmptyState>
            <EmptyIcon />
            <EmptyTitle>No Complaints Found</EmptyTitle>
            <EmptyText>
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'No complaints match your current filters.'
                : 'No complaints have been submitted yet.'}
            </EmptyText>
          </EmptyState>
        ) : (
          filteredComplaints.map(complaint => (
            <ComplaintCard key={complaint.id}>
              <ComplaintHeader>
                <ComplaintInfo>
                  <ComplaintTitle>{complaint.title}</ComplaintTitle>
                  <ComplaintMeta>
                    <span>By: {complaint.user_name || 'Unknown'}</span>
                    <span>•</span>
                    <span>Room: {complaint.room_number || 'N/A'}</span>
                    <span>•</span>
                    <span>{new Date(complaint.created_at).toLocaleDateString()}</span>
                  </ComplaintMeta>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <StatusBadge status={complaint.status}>
                      {complaint.status.replace('_', ' ')}
                    </StatusBadge>
                    <PriorityBadge priority={complaint.priority}>
                      {complaint.priority}
                    </PriorityBadge>
                  </div>
                </ComplaintInfo>
              </ComplaintHeader>
              
              <ComplaintDescription>{complaint.description}</ComplaintDescription>
              
              <ComplaintActions>
                {complaint.status === 'open' && (
                  <>
                    <ActionButton
                      variant="primary"
                      onClick={() => handleUpdateStatus(complaint.id, 'in_progress')}
                    >
                      Start Working
                    </ActionButton>
                    <ActionButton
                      variant="success"
                      onClick={() => handleUpdateStatus(complaint.id, 'resolved')}
                    >
                      Mark Resolved
                    </ActionButton>
                  </>
                )}
                {complaint.status === 'in_progress' && (
                  <ActionButton
                    variant="success"
                    onClick={() => handleUpdateStatus(complaint.id, 'resolved')}
                  >
                    Mark Resolved
                  </ActionButton>
                )}
                {complaint.status === 'resolved' && (
                  <ActionButton
                    variant="warning"
                    onClick={() => handleUpdateStatus(complaint.id, 'open')}
                  >
                    Reopen
                  </ActionButton>
                )}
              </ComplaintActions>
            </ComplaintCard>
          ))
        )}
      </ComplaintsList>
    </HostelComplaintsContainer>
  );
};

export default HostelComplaints; 