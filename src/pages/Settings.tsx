import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { Save, User, Palette, Lock, Eye, EyeOff } from 'lucide-react';
import type { RootState, AppDispatch } from '../store/store';
import {
  setTheme,
  updateProfile,
} from '../store/slices/settingsSlice';
import { updateUserProfile } from '../store/slices/authSlice';
import { supabase } from '../lib/supabase';
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

const PaletteIcon = styled(Palette)`
  width: 1.25rem;
  height: 1.25rem;
`;

const LockIcon = styled(Lock)`
  width: 1.25rem;
  height: 1.25rem;
`;

const EyeIcon = styled(Eye)`
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  color: ${props => props.theme.colors.textSecondary};
`;

const EyeOffIcon = styled(EyeOff)`
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  color: ${props => props.theme.colors.textSecondary};
`;

const ThemeDescription = styled.div`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const PasswordInputContainer = styled.div`
  position: relative;
`;

const PasswordToggleButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.isDark ? '#334155' : '#f1f5f9'};
  }
`;

const ChangePasswordButton = styled.button`
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const PasswordFormButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const SubmitPasswordButton = styled.button<{ $disabled: boolean }>`
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  font-size: 0.875rem;
  font-weight: 500;
  opacity: ${props => props.$disabled ? 0.5 : 1};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #059669, #047857);
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const CancelButton = styled.button`
  background: none;
  color: ${props => props.theme.colors.textSecondary};
  padding: 0.75rem 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.isDark ? '#334155' : '#f8fafc'};
    border-color: ${props => props.theme.colors.textSecondary};
  }
`;

const SaveButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Settings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const settings = useSelector((state: RootState) => state.settings);
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(updateProfile({ 
        displayName: user.full_name || '', 
        email: user.email || '' 
      }));
    }
  }, [dispatch, user?.full_name, user?.email]);

  const handleSaveChanges = async () => {
    if (!user) {
      toast.error('User not found');
      return;
    }

    // Check if values have actually changed
    const hasChanges = settings.displayName !== user.full_name || settings.email !== user.email;
    
    if (!hasChanges) {
      toast.success('No changes to save');
      return;
    }

    try {
      await dispatch(updateUserProfile({
        fullName: settings.displayName,
        email: settings.email,
      })).unwrap();
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (!user) {
      toast.error('User not found');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) {
        throw error;
      }

      toast.success('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);
    } catch (error) {
      console.error('Password change error:', error);
      toast.error('Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <SettingsContainer>
      <SettingsHeader>
        <SettingsTitle>Profile Settings</SettingsTitle>
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
              onChange={(e) => {
                const newTheme = e.target.value as 'light' | 'dark' | 'system';
                dispatch(setTheme(newTheme));
                toast.success(`Theme changed to ${newTheme}`);
              }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System (Follow OS)</option>
            </FormSelect>
            <ThemeDescription>
              {settings.theme === 'system' 
                ? 'Theme will automatically follow your system preference'
                : `Currently using ${settings.theme} theme`
              }
            </ThemeDescription>
          </FormGroup>
        </Section>

        {/* Password Change Section */}
        <Section>
          <SectionHeader>
            <SectionIcon>
              <LockIcon />
            </SectionIcon>
            <SectionTitle>Change Password</SectionTitle>
          </SectionHeader>
          
          {!showPasswordForm ? (
            <FormGroup>
              <ChangePasswordButton
                onClick={() => setShowPasswordForm(true)}
              >
                <Lock size={16} />
                Change Password
              </ChangePasswordButton>
            </FormGroup>
          ) : (
            <>
              <FormGroup>
                <FormLabel>New Password</FormLabel>
                <PasswordInputContainer>
                  <FormInput
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                  />
                  <PasswordToggleButton onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </PasswordToggleButton>
                </PasswordInputContainer>
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Confirm New Password</FormLabel>
                <PasswordInputContainer>
                  <FormInput
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                  />
                  <PasswordToggleButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </PasswordToggleButton>
                </PasswordInputContainer>
              </FormGroup>
              
              <FormGroup>
                <PasswordFormButtons>
                  <SubmitPasswordButton
                    onClick={handleChangePassword}
                    $disabled={passwordLoading || !passwordData.newPassword || !passwordData.confirmPassword}
                  >
                    {passwordLoading ? 'Changing...' : 'Change Password'}
                  </SubmitPasswordButton>
                  <CancelButton
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      });
                    }}
                  >
                    Cancel
                  </CancelButton>
                </PasswordFormButtons>
              </FormGroup>
            </>
          )}
        </Section>

        <SaveButtonContainer>
          <SaveButton 
            onClick={(e) => {
              console.log('Button clicked!', e);
              handleSaveChanges();
            }} 
            disabled={loading}
          >
            <SaveIcon />
            {loading ? 'Saving...' : 'Save Changes'}
          </SaveButton>
        </SaveButtonContainer>
      </SettingsCard>
    </SettingsContainer>
  );
};

export default Settings;
