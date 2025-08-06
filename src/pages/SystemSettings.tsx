import React, { useState } from 'react';
import { Settings, Database, Shield, Globe, Save } from 'lucide-react';
import styled from 'styled-components';
import toast from 'react-hot-toast';

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const SettingsGrid = styled.div`
  display: grid;
  gap: 2rem;
`;

const SettingsCard = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const CardIcon = styled.div`
  color: ${props => props.theme.colors.primary};
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CardDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  margin: 0;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
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
  padding: 0.75rem 1rem;
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
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ToggleSwitch = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
`;

const Switch = styled.div<{ $checked: boolean }>`
  width: 3rem;
  height: 1.5rem;
  background-color: ${props => props.$checked ? '#3b82f6' : '#d1d5db'};
  border-radius: 1rem;
  position: relative;
  transition: background-color 0.2s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 0.125rem;
    left: ${props => props.$checked ? '1.625rem' : '0.125rem'};
    width: 1.25rem;
    height: 1.25rem;
    background-color: white;
    border-radius: 50%;
    transition: left 0.2s ease;
  }
`;

const SaveButton = styled.button`
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  padding: 0.875rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'CampusConnect',
    siteDescription: 'Your comprehensive campus management platform',
    maintenanceMode: false,
    
    // Security Settings
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    requireTwoFactor: false,
    
    // Database Settings
    backupFrequency: 'daily',
    retentionPeriod: 90,
    
    // Feature Flags
    enableMarketplace: true,
    enableClubs: true,
    enableCanteen: true,
    enableHostel: true,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      // In a real application, you would save these settings to the database
      // For now, we'll just show a success message
      toast.success('System settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
  };

  return (
    <Container>
      <Header>
        <Title>System Settings</Title>
        <SaveButton onClick={handleSaveSettings}>
          <Save size={16} />
          Save Settings
        </SaveButton>
      </Header>

      <SettingsGrid>
        {/* General Settings */}
        <SettingsCard>
          <CardHeader>
            <CardIcon>
              <Globe size={20} />
            </CardIcon>
            <div>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic system settings</CardDescription>
            </div>
          </CardHeader>

          <FormGroup>
            <FormLabel>Site Name</FormLabel>
            <FormInput
              type="text"
              value={settings.siteName}
              onChange={(e) => handleSettingChange('siteName', e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Site Description</FormLabel>
            <FormTextarea
              value={settings.siteDescription}
              onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <ToggleSwitch>
              <Switch $checked={settings.maintenanceMode} />
              <span>Maintenance Mode</span>
            </ToggleSwitch>
          </FormGroup>
        </SettingsCard>

        {/* Security Settings */}
        <SettingsCard>
          <CardHeader>
            <CardIcon>
              <Shield size={20} />
            </CardIcon>
            <div>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and authentication settings</CardDescription>
            </div>
          </CardHeader>

          <FormGroup>
            <FormLabel>Maximum Login Attempts</FormLabel>
            <FormInput
              type="number"
              min="1"
              max="10"
              value={settings.maxLoginAttempts}
              onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Session Timeout (minutes)</FormLabel>
            <FormInput
              type="number"
              min="5"
              max="120"
              value={settings.sessionTimeout}
              onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
            />
          </FormGroup>

          <FormGroup>
            <ToggleSwitch>
              <Switch $checked={settings.requireTwoFactor} />
              <span>Require Two-Factor Authentication</span>
            </ToggleSwitch>
          </FormGroup>
        </SettingsCard>

        {/* Database Settings */}
        <SettingsCard>
          <CardHeader>
            <CardIcon>
              <Database size={20} />
            </CardIcon>
            <div>
              <CardTitle>Database Settings</CardTitle>
              <CardDescription>Configure database backup and retention settings</CardDescription>
            </div>
          </CardHeader>

          <FormGroup>
            <FormLabel>Backup Frequency</FormLabel>
            <FormSelect
              value={settings.backupFrequency}
              onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </FormSelect>
          </FormGroup>

          <FormGroup>
            <FormLabel>Data Retention Period (days)</FormLabel>
            <FormInput
              type="number"
              min="30"
              max="365"
              value={settings.retentionPeriod}
              onChange={(e) => handleSettingChange('retentionPeriod', parseInt(e.target.value))}
            />
          </FormGroup>
        </SettingsCard>

        {/* Feature Flags */}
        <SettingsCard>
          <CardHeader>
            <CardIcon>
              <Settings size={20} />
            </CardIcon>
            <div>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>Enable or disable system features</CardDescription>
            </div>
          </CardHeader>

          <FormGroup>
            <ToggleSwitch>
              <Switch $checked={settings.enableMarketplace} />
              <span>Enable Marketplace</span>
            </ToggleSwitch>
          </FormGroup>

          <FormGroup>
            <ToggleSwitch>
              <Switch $checked={settings.enableClubs} />
              <span>Enable Clubs</span>
            </ToggleSwitch>
          </FormGroup>

          <FormGroup>
            <ToggleSwitch>
              <Switch $checked={settings.enableCanteen} />
              <span>Enable Canteen</span>
            </ToggleSwitch>
          </FormGroup>

          <FormGroup>
            <ToggleSwitch>
              <Switch $checked={settings.enableHostel} />
              <span>Enable Hostel</span>
            </ToggleSwitch>
          </FormGroup>
        </SettingsCard>
      </SettingsGrid>
    </Container>
  );
};

export default SystemSettings; 