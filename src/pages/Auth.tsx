import React, { useState } from 'react';
import LoginForm from '../components/Auth/LoginForm';
import SignupForm from '../components/Auth/SignupForm';
import styled from 'styled-components';

const AuthContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.isDark 
    ? 'linear-gradient(to bottom right, #0f172a, #1e293b)' 
    : 'linear-gradient(to bottom right, #eff6ff, #faf5ff)'};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const AuthWrapper = styled.div`
  width: 100%;
  max-width: 28rem;
`;

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <AuthContainer>
      <AuthWrapper>
        {isLogin ? (
          <LoginForm onToggle={toggleForm} />
        ) : (
          <SignupForm onToggle={toggleForm} />
        )}
      </AuthWrapper>
    </AuthContainer>
  );
};

export default Auth;