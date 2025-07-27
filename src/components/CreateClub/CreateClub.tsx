import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import type { RootState } from '../../store/store';
import styled from 'styled-components';

interface CreateClubProps {
  onSuccess?: () => void;
}

const Container = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 1.5rem 0;
`;

const Form = styled.form`
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
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  resize: vertical;
  min-height: 6rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const FormSelect = styled.select`
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

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  padding: 0.875rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonIcon = styled(PlusCircle)`
  width: 1.25rem;
  height: 1.25rem;
`;

const CreateClub: React.FC<CreateClubProps> = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Academic');
  const [loading, setLoading] = useState(false);

  const handleCreateClub = async () => {
    if (!user?.id) return toast.error('You must be logged in');
    if (!name.trim()) return toast.error('Club name is required');

    setLoading(true);
    const { data, error } = await supabase.from('clubs').insert({
      name,
      description,
      category,
      is_active: true,
      club_head_id: user.id
    });

    setLoading(false);

    if (error) {
      toast.error('Failed to create club');
      console.error(error);
    } else {
      toast.success('Club created successfully');
      setName('');
      setDescription('');
      setCategory('Academic');
      onSuccess?.(); // ✅ Notify parent on success
    }
  };

  return (
    <Container>
      <Title>Create a New Club</Title>

      <Form onSubmit={(e) => { e.preventDefault(); handleCreateClub(); }}>
        <FormGroup>
          <FormLabel>Club Name</FormLabel>
          <FormInput
            type="text"
            placeholder="Club Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>Description</FormLabel>
          <FormTextarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>Category</FormLabel>
          <FormSelect
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="Academic">Academic</option>
            <option value="Sports">Sports</option>
            <option value="Cultural">Cultural</option>
            <option value="Technical">Technical</option>
            <option value="Social Service">Social Service</option>
            <option value="Arts">Arts</option>
          </FormSelect>
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          <ButtonIcon />
          {loading ? 'Creating...' : 'Create Club'}
        </SubmitButton>
      </Form>
    </Container>
  );
};

export default CreateClub;
