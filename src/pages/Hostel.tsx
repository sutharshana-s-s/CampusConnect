import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Building, AlertTriangle, Plus, Clock, CheckCircle, XCircle, Home, Shield, FileText } from 'lucide-react';
import { fetchComplaints, submitComplaint } from '../store/slices/hostelSlice';
import toast from 'react-hot-toast';
import type { RootState, AppDispatch } from '../store/store';
import type { Database } from '../lib/supabase';
import styled, { keyframes } from 'styled-components';

type ComplaintFormData = Database['public']['Tables']['hostel_complaints']['Insert'];

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const HostelContainer = styled.div`
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
  border-top: 3px solid #10b981;
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

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 0.875rem 1.5rem;
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
  }
  
  &:hover {
    background: linear-gradient(135deg, #059669, #047857);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3);
  }
`;

const ButtonIcon = styled(Plus)`
  width: 1.25rem;
  height: 1.25rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const StatCard = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  transition: transform 0.2s ease;
  border: 1px solid ${props => props.theme.colors.border};
  
  &:hover {
    transform: translateY(-2px);
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
  color: #10b981;
  display: flex;
  align-items: center;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const InfoValue = styled.span<{ color?: string }>`
  font-weight: 500;
  color: ${props => props.color || props.theme.colors.text};
`;

const RulesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const RuleItem = styled.p`
  margin: 0;
`;

const ComplaintsContainer = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
`;

const ComplaintsTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 1.5rem 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
`;

const EmptyIcon = styled(AlertTriangle)`
  width: 4rem;
  height: 4rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 auto 1rem;
`;

const EmptyTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
`;

const ComplaintsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ComplaintItem = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  padding: 1.5rem;
  transition: box-shadow 0.2s ease;
  background-color: ${props => props.theme.isDark ? '#334155' : '#ffffff'};
  
  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const ComplaintHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const ComplaintInfo = styled.div`
  flex: 1;
`;

const ComplaintTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

const StatusIcon = styled.div`
  display: flex;
  align-items: center;
`;

const ComplaintTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const PriorityBadge = styled.span<{ color: string }>`
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
  background-color: ${props => props.color.split(' ')[0]};
  color: ${props => props.color.split(' ')[1]};
`;

const ComplaintDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.75rem;
  line-height: 1.5;
`;

const ComplaintDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 9999px;
  
  ${props => {
    switch (props.status) {
      case 'resolved':
        return 'background-color: #dcfce7; color: #166534;';
      case 'in_progress':
        return 'background-color: #fed7aa; color: #ea580c;';
      default:
        return 'background-color: #fef3c7; color: #d97706;';
    }
  }}
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  max-width: 28rem;
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid ${props => props.theme.colors.border};
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ModalTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitleText = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  color: ${props => props.theme.colors.textSecondary};
  border-radius: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.isDark ? '#475569' : '#f1f5f9'};
    color: ${props => props.theme.colors.text};
  }
`;

const ModalForm = styled.form`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: white;
  appearance: none;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: white;
  resize: vertical;
  min-height: 6rem;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
`;

const FormButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  padding-top: 1rem;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 0.875rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  color: #64748b;
  font-weight: 500;
  font-size: 0.875rem;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8fafc;
    border-color: #cbd5e1;
  }
`;

const SubmitFormButton = styled.button`
  flex: 1;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 0.875rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: linear-gradient(135deg, #059669, #047857);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3);
  }
`;

const ClockIcon = styled(Clock)`
  width: 1.25rem;
  height: 1.25rem;
  color: #f59e0b;
`;

const AlertTriangleIcon = styled(AlertTriangle)`
  width: 1.25rem;
  height: 1.25rem;
  color: #f59e0b;
`;

const CheckCircleIcon = styled(CheckCircle)`
  width: 1.25rem;
  height: 1.25rem;
  color: #10b981;
`;

const XCircleIcon = styled(XCircle)`
  width: 1.25rem;
  height: 1.25rem;
  color: #6b7280;
`;

const BuildingIcon = styled(Building)`
  width: 1.5rem;
  height: 1.5rem;
`;

const Hostel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { complaints, loading } = useSelector((state: RootState) => state.hostel);
  const { user } = useSelector((state: RootState) => state.auth);
  const [showComplaintForm, setShowComplaintForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ComplaintFormData>();

  useEffect(() => {
    if (user) {
      dispatch(fetchComplaints(user.id));
    }
  }, [dispatch, user]);

  const onSubmitComplaint = async (data: ComplaintFormData) => {
    if (!user) return;

    try {
      await dispatch(submitComplaint({
        ...data,
        user_id: user.id,
        status: 'open',
        priority: 'medium',
      })).unwrap();
      
      toast.success('Complaint submitted successfully!');
      reset();
      setShowComplaintForm(false);
    } catch (error) {
      toast.error('Failed to submit complaint');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <ClockIcon />;
      case 'in_progress':
        return <AlertTriangleIcon />;
      case 'resolved':
        return <CheckCircleIcon />;
      default:
        return <XCircleIcon />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = [
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'electricity', label: 'Electricity' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'other', label: 'Other' },
  ];

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
      </LoadingContainer>
    );
  }

  return (
    <HostelContainer>
      {/* Header */}
      <Header>
        <HeaderContent>
          <HeaderTitle>Hostel Services</HeaderTitle>
          <HeaderSubtitle>Manage your room allocation and submit maintenance requests</HeaderSubtitle>
        </HeaderContent>
        
        <SubmitButton onClick={() => setShowComplaintForm(true)}>
          <ButtonIcon />
          <span>Submit Complaint</span>
        </SubmitButton>
      </Header>

      {/* Room Information */}
      <StatsGrid>
        <StatCard>
          <CardHeader>
            <CardTitle>Room Details</CardTitle>
            <CardIcon>
              <BuildingIcon />
            </CardIcon>
          </CardHeader>
          <CardContent>
            <InfoRow>
              <InfoLabel>Block:</InfoLabel>
              <InfoValue>{user?.hostel_block || 'Not Assigned'}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Room:</InfoLabel>
              <InfoValue>{user?.room_number || 'Not Assigned'}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Occupancy:</InfoLabel>
              <InfoValue color="#10b981">Active</InfoValue>
            </InfoRow>
          </CardContent>
        </StatCard>

        <StatCard>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoRow>
              <InfoLabel>Total Complaints:</InfoLabel>
              <InfoValue>{complaints.length}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Open:</InfoLabel>
              <InfoValue color="#f59e0b">{complaints.filter(c => c.status === 'open').length}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Resolved:</InfoLabel>
              <InfoValue color="#10b981">{complaints.filter(c => c.status === 'resolved').length}</InfoValue>
            </InfoRow>
          </CardContent>
        </StatCard>

        <StatCard>
          <CardHeader>
            <CardTitle>Hostel Rules</CardTitle>
          </CardHeader>
          <RulesList>
            <RuleItem>• Quiet hours: 10 PM - 6 AM</RuleItem>
            <RuleItem>• No outside visitors after 9 PM</RuleItem>
            <RuleItem>• Keep common areas clean</RuleItem>
            <RuleItem>• Report maintenance issues promptly</RuleItem>
          </RulesList>
        </StatCard>
      </StatsGrid>

      {/* Complaints */}
      <ComplaintsContainer>
        <ComplaintsTitle>My Complaints</ComplaintsTitle>
        
        {complaints.length === 0 ? (
          <EmptyState>
            <EmptyIcon />
            <EmptyTitle>No complaints submitted</EmptyTitle>
            <EmptyText>Submit your first maintenance request to get started</EmptyText>
          </EmptyState>
        ) : (
          <ComplaintsList>
            {complaints.map(complaint => (
              <ComplaintItem key={complaint.id}>
                <ComplaintHeader>
                  <ComplaintInfo>
                    <ComplaintTitleRow>
                      <StatusIcon>
                      {getStatusIcon(complaint.status)}
                      </StatusIcon>
                      <ComplaintTitle>{complaint.title}</ComplaintTitle>
                      <PriorityBadge color={getPriorityColor(complaint.priority)}>
                        {complaint.priority} priority
                      </PriorityBadge>
                    </ComplaintTitleRow>
                    <ComplaintDescription>{complaint.description}</ComplaintDescription>
                    <ComplaintDetails>
                      <span>Category: {complaint.category}</span>
                      <span>Created: {new Date(complaint.created_at).toLocaleDateString()}</span>
                    </ComplaintDetails>
                  </ComplaintInfo>
                  <StatusBadge status={complaint.status}>
                      {complaint.status.replace('_', ' ')}
                  </StatusBadge>
                </ComplaintHeader>
              </ComplaintItem>
            ))}
          </ComplaintsList>
        )}
      </ComplaintsContainer>

      {/* Complaint Form Modal */}
      {showComplaintForm && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                <ModalTitleText>Submit Complaint</ModalTitleText>
                <CloseButton onClick={() => setShowComplaintForm(false)}>
                  ✕
                </CloseButton>
              </ModalTitle>
            </ModalHeader>
            
            <ModalForm onSubmit={handleSubmit(onSubmitComplaint)}>
              <FormGroup>
                <FormLabel>Title</FormLabel>
                <FormInput
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  placeholder="Brief description of the issue"
                />
                {errors.title && (
                  <ErrorMessage>{errors.title.message}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <FormLabel>Category</FormLabel>
                <FormSelect
                  {...register('category', { required: 'Category is required' })}
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </FormSelect>
                {errors.category && (
                  <ErrorMessage>{errors.category.message}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <FormLabel>Description</FormLabel>
                <FormTextarea
                  {...register('description', { required: 'Description is required' })}
                  placeholder="Detailed description of the issue"
                />
                {errors.description && (
                  <ErrorMessage>{errors.description.message}</ErrorMessage>
                )}
              </FormGroup>

              <FormButtons>
                <CancelButton
                  type="button"
                  onClick={() => setShowComplaintForm(false)}
                >
                  Cancel
                </CancelButton>
                <SubmitFormButton type="submit">
                  Submit
                </SubmitFormButton>
              </FormButtons>
            </ModalForm>
          </ModalContent>
        </ModalOverlay>
      )}
    </HostelContainer>
  );
};

export default Hostel;