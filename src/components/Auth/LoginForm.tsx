import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, LogIn } from 'lucide-react';
import { signIn } from '../../store/slices/authSlice';
import type { RootState, AppDispatch } from '../../store/store';
import styled, { keyframes } from 'styled-components';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onToggle: () => void;
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const FormContainer = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  width: 100%;
  max-width: 28rem;
  border: 1px solid ${props => props.theme.colors.border};
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const FormTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.5rem 0;
`;

const FormSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div``;

const FormLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
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

const FormInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
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

const ErrorText = styled.p`
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  padding: 0.875rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #3b82f6, 0 0 0 4px white;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Spinner = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid white;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const ToggleSection = styled.div`
  margin-top: 1.5rem;
  text-align: center;
`;

const ToggleText = styled.p`
  color: #4b5563;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: underline;
  
  &:hover {
    color: #2563eb;
  }
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 0.875rem;
  margin: 0;
`;

const MailIcon = styled(Mail)`
  width: 1.25rem;
  height: 1.25rem;
`;

const LockIcon = styled(Lock)`
  width: 1.25rem;
  height: 1.25rem;
`;

const LogInIcon = styled(LogIn)`
  width: 1.25rem;
  height: 1.25rem;
`;

const LoginForm: React.FC<LoginFormProps> = ({ onToggle }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    await dispatch(signIn(data));
  };

  return (
    <FormContainer>
      <FormHeader>
        <FormTitle>Welcome Back</FormTitle>
        <FormSubtitle>Sign in to your CampusConnect account</FormSubtitle>
      </FormHeader>

      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <FormLabel>Email Address</FormLabel>
          <InputContainer>
            <InputIcon>
              <MailIcon />
            </InputIcon>
            <FormInput
              type="email"
              {...register('email', { required: 'Email is required' })}
              placeholder="Enter your email"
            />
          </InputContainer>
          {errors.email && (
            <ErrorText>{errors.email.message}</ErrorText>
          )}
        </FormGroup>

        <FormGroup>
          <FormLabel>Password</FormLabel>
          <InputContainer>
            <InputIcon>
              <LockIcon />
            </InputIcon>
            <FormInput
              type="password"
              {...register('password', { required: 'Password is required' })}
              placeholder="Enter your password"
            />
          </InputContainer>
          {errors.password && (
            <ErrorText>{errors.password.message}</ErrorText>
          )}
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? (
            <Spinner />
          ) : (
            <>
              <LogInIcon />
              <span>Sign In</span>
            </>
          )}
        </SubmitButton>
      </Form>

      <ToggleSection>
        <ToggleText>
          Don't have an account?{' '}
          <ToggleButton onClick={onToggle}>
            Sign up here
          </ToggleButton>
        </ToggleText>
      </ToggleSection>
    </FormContainer>
  );
};

export default LoginForm;