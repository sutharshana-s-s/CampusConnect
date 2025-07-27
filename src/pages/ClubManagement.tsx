import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusCircle, Users, CheckCircle, XCircle, Settings, UserCheck, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store/store';
import {
    fetchClubs,
    fetchClubMembers,
    fetchMembershipRequests,
    updateMembershipStatus,
    leaveClub
} from '../store/slices/clubSlice';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const ClubManagementContainer = styled.div`
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

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
`;

const EmptyIcon = styled(Users)`
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
  color: #1e293b;
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

const CreateEventButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
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
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
`;

const ButtonIcon = styled(PlusCircle)`
  width: 1.25rem;
  height: 1.25rem;
`;

const ClubSelectorContainer = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
`;

const SelectLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const ClubSelect = styled.select`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
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

const TabContainer = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.border};
`;

const TabHeader = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const TabButton = styled.button<{ isActive: boolean }>`
  flex: 1;
  padding: 1rem 1.5rem;
  text-align: center;
  font-weight: 500;
  font-size: 0.875rem;
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.isActive ? `
    color: #3b82f6;
    border-bottom: 2px solid #3b82f6;
    background-color: #f8fafc;
  ` : `
    color: #64748b;
    
    &:hover {
      color: #334155;
      background-color: #f8fafc;
    }
  `}
`;

const TabContent = styled.div`
  padding: 1.5rem;
`;

const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MemberItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f1f5f9;
  }
`;

const MemberInfo = styled.div``;

const MemberName = styled.h4`
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
`;

const MemberDetails = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
`;

const RemoveButton = styled.button`
  color: #ef4444;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: #dc2626;
  }
`;

const RequestList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RequestItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 0.5rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const RequestInfo = styled.div`
  flex: 1;
`;

const RequestName = styled.h4`
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
`;

const RequestDetails = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
`;

const RoleSelect = styled.select`
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  background-color: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ variant: 'approve' | 'reject' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.variant === 'approve' ? `
    color: #10b981;
    
    &:hover {
      background-color: #ecfdf5;
      color: #059669;
    }
  ` : `
    color: #ef4444;
    
    &:hover {
      background-color: #fef2f2;
      color: #dc2626;
    }
  `}
`;

const SettingsForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  padding: 0.875rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-end;
  
  &:hover {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
`;

const EmptyMessage = styled.p`
  color: #64748b;
  text-align: center;
  padding: 2rem;
`;

const CheckCircleIcon = styled(CheckCircle)`
  width: 1.25rem;
  height: 1.25rem;
`;

const XCircleIcon = styled(XCircle)`
  width: 1.25rem;
  height: 1.25rem;
`;

const ClubManagement: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const passedClubId = searchParams.get('clubId') || '';
    const passedClubName = searchParams.get('clubName') || '';

    const { user } = useSelector((state: RootState) => state.auth);
    const { clubs, clubMembers, membershipRequests, loading } = useSelector((state: RootState) => state.clubs);

    const [activeTab, setActiveTab] = useState<'members' | 'requests' | 'settings'>('members');
    const [selectedClub, setSelectedClub] = useState<string>(passedClubId);
    const [assignRoles, setAssignRoles] = useState<{ [key: string]: string }>({});

    const isClubHead = user?.role === 'club_head';

    const myClubs = isClubHead
        ? clubs
        : clubs.filter(club =>
            clubMembers.some(
                m => m.user_id === user?.id &&
                    m.club_id === club.id &&
                    m.position === 'secretary'
            )
        );

    useEffect(() => {
        dispatch(fetchClubs());
    }, [dispatch]);

    useEffect(() => {
        if (passedClubId) setSelectedClub(passedClubId);
    }, [passedClubId]);

    useEffect(() => {
        if (selectedClub) {
            dispatch(fetchClubMembers(selectedClub));
            dispatch(fetchMembershipRequests(selectedClub));
        }
    }, [dispatch, selectedClub]);

    const validRoles = ['member', 'secretary', 'treasurer', 'event_manager'] as const;
    type Role = typeof validRoles[number];
    const isValidRole = (role: string): role is Role => validRoles.includes(role as Role);

    const handleApproveRequest = async (requestId: string, role: string) => {
        try {
            console.log('Approving member with requestId:', requestId);
            const position = isValidRole(role) ? role : undefined;
            await dispatch(updateMembershipStatus({ requestId, status: 'approved', position })).unwrap();
            toast.success('Member approved and role assigned!');
        } catch {
            toast.error('Failed to approve member');
        }
    };

    const handleRejectRequest = async (requestId: string) => {
        try {
            await dispatch(updateMembershipStatus({ requestId, status: 'rejected' })).unwrap();
            toast.success('Request rejected successfully!');
        } catch {
            toast.error('Failed to reject request');
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        try {
            if (!selectedClub || !user) return;
            await dispatch(leaveClub({ clubId: selectedClub, userId: memberId })).unwrap();
            toast.success('Member removed successfully!');
        } catch {
            toast.error('Failed to remove member');
        }
    };

    const roleOptions = ['member', 'secretary', 'treasurer', 'event_manager'];

    if (loading) {
        return (
            <LoadingContainer>
                <Spinner />
            </LoadingContainer>
        );
    }

    if (!user) {
        return (
            <EmptyState>
                <EmptyIcon />
                <EmptyTitle>No Clubs Found</EmptyTitle>
                <EmptyText>You are not a club head or secretary of any clubs.</EmptyText>
            </EmptyState>
        );
    }

    return (
        <ClubManagementContainer>
            <Header>
                <HeaderContent>
                    <HeaderTitle>
                        Club Management {passedClubName ? `- ${passedClubName}` : ''}
                    </HeaderTitle>
                    <HeaderSubtitle>Manage your clubs and members</HeaderSubtitle>
                </HeaderContent>
                <CreateEventButton
                    onClick={() => navigate('/create-event', { state: { clubId: selectedClub } })}
                >
                    <ButtonIcon />
                    <span>Create Event</span>
                </CreateEventButton>
            </Header>

            <ClubSelectorContainer>
                <SelectLabel>Select Club</SelectLabel>
                <ClubSelect
                    value={selectedClub}
                    onChange={(e) => setSelectedClub(e.target.value)}
                >
                    <option value="">Select a club</option>
                    {myClubs.map(club => (
                        <option key={club.id} value={club.id}>{club.name}</option>
                    ))}
                </ClubSelect>
            </ClubSelectorContainer>

            {selectedClub && (
                <TabContainer>
                    <TabHeader>
                        {['members', 'requests', 'settings'].map(tab => (
                            <TabButton
                                key={tab}
                                isActive={activeTab === tab}
                                onClick={() => setActiveTab(tab as any)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </TabButton>
                        ))}
                    </TabHeader>

                    <TabContent>
                        {activeTab === 'members' && (
                            <MemberList>
                                {clubMembers.length === 0 ? (
                                    <EmptyMessage>No members found</EmptyMessage>
                                ) : (
                                    clubMembers.map(member => (
                                        <MemberItem key={member.id}>
                                            <MemberInfo>
                                                <MemberName>{member.profile?.full_name ?? 'Unknown Member'}</MemberName>
                                                <MemberDetails>
                                                    {member.position} • Joined {new Date(member.joined_at).toLocaleDateString()}
                                                </MemberDetails>
                                            </MemberInfo>
                                            <RemoveButton
                                                onClick={() => handleRemoveMember(member.user_id)}
                                            >
                                                Remove
                                            </RemoveButton>
                                        </MemberItem>
                                    ))
                                )}
                            </MemberList>
                        )}

                        {activeTab === 'requests' && (
                            <RequestList>
                                {membershipRequests.length === 0 ? (
                                    <EmptyMessage>No pending requests</EmptyMessage>
                                ) : (
                                    membershipRequests.map(request => (
                                        <RequestItem key={request.id}>
                                            <RequestInfo>
                                                <RequestName>{request.profile?.full_name ?? 'Unknown Member'}</RequestName>
                                                <RequestDetails>
                                                    Requested on {new Date(request.joined_at).toLocaleDateString()}
                                                </RequestDetails>
                                            </RequestInfo>
                                            <RoleSelect
                                                value={assignRoles[request.id] || 'member'}
                                                onChange={(e) =>
                                                    setAssignRoles(prev => ({ ...prev, [request.id]: e.target.value }))
                                                }
                                            >
                                                {roleOptions.map(role => (
                                                    <option key={role} value={role}>{role}</option>
                                                ))}
                                            </RoleSelect>
                                            <ActionButtons>
                                                <ActionButton
                                                    variant="approve"
                                                    onClick={() => handleApproveRequest(request.id, assignRoles[request.id] || 'member')}
                                                >
                                                    <CheckCircleIcon />
                                                </ActionButton>
                                                <ActionButton
                                                    variant="reject"
                                                    onClick={() => handleRejectRequest(request.id)}
                                                >
                                                    <XCircleIcon />
                                                </ActionButton>
                                            </ActionButtons>
                                        </RequestItem>
                                    ))
                                )}
                            </RequestList>
                        )}

                        {activeTab === 'settings' && (
                            <SettingsForm>
                                <FormGroup>
                                    <FormLabel>Club Name</FormLabel>
                                    <FormInput
                                        type="text"
                                        placeholder="Enter club name"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>Description</FormLabel>
                                    <FormTextarea
                                        rows={4}
                                        placeholder="Enter club description"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>Category</FormLabel>
                                    <FormSelect>
                                        <option value="Academic">Academic</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Cultural">Cultural</option>
                                        <option value="Technical">Technical</option>
                                        <option value="Social Service">Social Service</option>
                                        <option value="Arts">Arts</option>
                                    </FormSelect>
                                </FormGroup>
                                <SaveButton>
                                    Save Changes
                                </SaveButton>
                            </SettingsForm>
                        )}
                    </TabContent>
                </TabContainer>
            )}
        </ClubManagementContainer>
    );
};

export default ClubManagement;
