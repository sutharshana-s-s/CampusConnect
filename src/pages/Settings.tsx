import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { Save, User, Bell, Palette } from 'lucide-react';
import type { RootState, AppDispatch } from '../store/store';
import {
  setTheme,
  setEmailNotifications,
  setPushNotifications,
  updateProfile,
} from '../store/slices/settingsSlice';
import styled from 'styled-components';

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SettingsHeader = styled.div`
  margin-bottom: 1rem;
`;

const SettingsTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  line-height: 1.2;
  
  @media (min-width: 640px) {
    font-size: 2.25rem;
  }
`;

const SettingsCard = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  
  @media (min-width: 640px) {
    padding: 2rem;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 1rem 0;
`;

const Section = styled.section`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const SectionIcon = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FormLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
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

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Checkbox = styled.input`
  width: 1rem;
  height: 1rem;
  accent-color: #3b82f6;
`;

const CheckboxLabel = styled.label`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  flex: 1;
`;

const SaveButton = styled.button`
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  padding: 0.875rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SaveIcon = styled(Save)`
  width: 1.25rem;
  height: 1.25rem;
`;

const UserIcon = styled(User)`
  width: 1.25rem;
  height: 1.25rem;
`;

const BellIcon = styled(Bell)`
  width: 1.25rem;
  height: 1.25rem;
`;

const PaletteIcon = styled(Palette)`
  width: 1.25rem;
  height: 1.25rem;
`;

const Settings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const settings = useSelector((state: RootState) => state.settings);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(updateProfile({ 
        displayName: user.full_name || '', 
        email: user.email || '' 
      }));
    }
  }, [dispatch, user]);

  const handleSaveChanges = () => {
    // In a real application, you would make API calls here to update the user's settings
    toast.success('Settings saved successfully!');
  };

  return (
    <SettingsContainer>
      <SettingsHeader>
        <SettingsTitle>Settings</SettingsTitle>
      </SettingsHeader>
      
      <SettingsCard>
        {/* Profile Settings Section */}
        <Section>
          <SectionHeader>
            <SectionIcon>
              <UserIcon />
            </SectionIcon>
            <SectionTitle>Profile Settings</SectionTitle>
          </SectionHeader>
          
          <FormGroup>
            <FormLabel>Display Name</FormLabel>
            <FormInput
              type="text"
              value={settings.displayName}
              onChange={(e) => dispatch(updateProfile({ 
                ...settings,
                displayName: e.target.value 
              }))}
              placeholder="Your display name"
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Email</FormLabel>
            <FormInput
              type="email"
              value={settings.email}
              onChange={(e) => dispatch(updateProfile({ 
                ...settings,
                email: e.target.value 
              }))}
              placeholder="Your email"
            />
          </FormGroup>
        </Section>

        {/* Notification Settings Section */}
        <Section>
          <SectionHeader>
            <SectionIcon>
              <BellIcon />
            </SectionIcon>
            <SectionTitle>Notification Settings</SectionTitle>
          </SectionHeader>
          
          <CheckboxGroup>
            <CheckboxItem>
              <Checkbox
                type="checkbox"
                id="emailNotifications"
                checked={settings.emailNotifications}
                onChange={(e) => dispatch(setEmailNotifications(e.target.checked))}
              />
              <CheckboxLabel htmlFor="emailNotifications">
                Email Notifications
              </CheckboxLabel>
            </CheckboxItem>
            
            <CheckboxItem>
              <Checkbox
                type="checkbox"
                id="pushNotifications"
                checked={settings.pushNotifications}
                onChange={(e) => dispatch(setPushNotifications(e.target.checked))}
              />
              <CheckboxLabel htmlFor="pushNotifications">
                Push Notifications
              </CheckboxLabel>
            </CheckboxItem>
          </CheckboxGroup>
        </Section>

        {/* Theme Settings Section */}
        <Section>
          <SectionHeader>
            <SectionIcon>
              <PaletteIcon />
            </SectionIcon>
            <SectionTitle>Theme Settings</SectionTitle>
          </SectionHeader>
          
          <FormGroup>
            <FormLabel>Theme</FormLabel>
            <FormSelect
              value={settings.theme}
              onChange={(e) => dispatch(setTheme(e.target.value as 'light' | 'dark' | 'system'))}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </FormSelect>
          </FormGroup>
        </Section>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <SaveButton onClick={handleSaveChanges}>
            <SaveIcon />
            Save Changes
          </SaveButton>
        </div>
      </SettingsCard>
    </SettingsContainer>
  );
};

export default Settings;
