import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import type { RootState } from '../store/store';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  
  @media (min-width: 480px) {
    padding: 1.5rem;
  }
  
  @media (min-width: 640px) {
    padding: 2rem;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.isDark ? '#1e293b' : '#f1f5f9'};
    color: ${props => props.theme.colors.text};
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const Form = styled.form`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid ${props => props.theme.colors.border};
  
  @media (min-width: 480px) {
    padding: 1.75rem;
  }
  
  @media (min-width: 640px) {
    padding: 2rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
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
  padding: 0.875rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FormTextarea = styled.textarea`
  padding: 0.875rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.2s ease;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  padding: 0.875rem 2rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
  
  &:hover {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
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

const ClubInfo = styled.div`
  background-color: ${props => props.theme.isDark ? '#1e293b' : '#f8fafc'};
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
`;

const ClubName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.25rem 0;
`;

const ClubDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

interface LocationState {
  clubId: string;
}

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const { clubs } = useSelector((state: RootState) => state.clubs);
  
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  
  const clubId = (location.state as LocationState)?.clubId;
  const selectedClub = clubs.find(club => club.id === clubId);

  useEffect(() => {
    if (!clubId) {
      toast.error('No club selected');
      navigate('/club-management');
    }
  }, [clubId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error('You must be logged in');
      return;
    }
    
    if (!clubId) {
      toast.error('No club selected');
      return;
    }
    
    if (!title.trim()) {
      toast.error('Event title is required');
      return;
    }
    
    if (!date) {
      toast.error('Event date is required');
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('club_events')
        .insert({
          club_id: clubId,
          title: title.trim(),
          description: description.trim(),
          date: date,
          time: time || null,
                     location: eventLocation.trim() || null,
          club_name: selectedClub?.name || 'Club Event'
        });

      if (error) {
        console.error('Error creating event:', error);
        toast.error('Failed to create event');
      } else {
        toast.success('Event created successfully!');
        
        navigate('/club-management');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  if (!clubId || !selectedClub) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
          Loading club information...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/club-management')}>
          <ArrowLeft size={16} />
          Back to Club Management
        </BackButton>
      </Header>

      <Title>Create Event</Title>

      <ClubInfo>
        <ClubName>{selectedClub.name}</ClubName>
        <ClubDescription>{selectedClub.description}</ClubDescription>
      </ClubInfo>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel>Event Title *</FormLabel>
          <FormInput
            type="text"
            placeholder="Enter event title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>Description</FormLabel>
          <FormTextarea
            placeholder="Enter event description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormGroup>

        <FormGrid>
          <FormGroup>
            <FormLabel>Date *</FormLabel>
            <FormInput
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Time</FormLabel>
            <FormInput
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </FormGroup>
        </FormGrid>

        <FormGroup>
          <FormLabel>Location</FormLabel>
                     <FormInput
             type="text"
             placeholder="Enter event location"
             value={eventLocation}
             onChange={(e) => setEventLocation(e.target.value)}
           />
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          <ButtonIcon />
          {loading ? 'Creating Event...' : 'Create Event'}
        </SubmitButton>
      </Form>
    </Container>
  );
};

export default CreateEvent; 