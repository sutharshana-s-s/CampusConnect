import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, Search, Filter, Edit, Trash2, Shield, UserCheck } from 'lucide-react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import type { RootState, AppDispatch } from '../store/store';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'club_head' | 'canteen_vendor' | 'hostel_admin' | 'super_admin';
  student_id?: string;
  created_at: string;
}

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
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

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  flex: 1;
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

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
`;

const UserTable = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.border};
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr auto;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background-color: ${props => props.theme.colors.background};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-weight: 600;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr auto;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  align-items: center;
  
  &:hover {
    background-color: ${props => props.theme.colors.background};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const UserName = styled.span`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const UserEmail = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const RoleBadge = styled.span<{ $role: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => {
    switch (props.$role) {
      case 'super_admin': return '#dc2626';
      case 'club_head': return '#3b82f6';
      case 'canteen_vendor': return '#f59e0b';
      case 'hostel_admin': return '#10b981';
      case 'student': return '#6b7280';
      default: return '#6b7280';
    }
  }};
  color: white;
`;

const ActionButton = styled.button<{ $variant?: 'edit' | 'delete' }>`
  padding: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.$variant === 'delete' ? '#ef4444' : '#3b82f6'};
  color: white;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$variant === 'delete' ? '#dc2626' : '#2563eb'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users');
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user role:', error);
        toast.error('Failed to update user role');
        return;
      }

      toast.success('User role updated successfully');
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
        return;
      }

      toast.success('User deleted successfully');
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>Loading users...</LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>User Management</Title>
      </Header>

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterSelect
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="student">Student</option>
          <option value="club_head">Club Head</option>
          <option value="canteen_vendor">Canteen Vendor</option>
          <option value="hostel_admin">Hostel Admin</option>
          <option value="super_admin">Super Admin</option>
        </FilterSelect>
      </SearchContainer>

      <UserTable>
        <TableHeader>
          <div>User</div>
          <div>Email</div>
          <div>Role</div>
          <div>Student ID</div>
          <div>Joined</div>
          <div>Actions</div>
        </TableHeader>

        {filteredUsers.length === 0 ? (
          <EmptyState>
            <Users size={48} style={{ marginBottom: '1rem' }} />
            <p>No users found</p>
          </EmptyState>
        ) : (
          filteredUsers.map(user => (
            <TableRow key={user.id}>
              <UserInfo>
                <UserName>{user.full_name}</UserName>
              </UserInfo>
              <div>{user.email}</div>
              <div>
                <RoleBadge $role={user.role}>
                  {user.role.replace('_', ' ').toUpperCase()}
                </RoleBadge>
              </div>
              <div>{user.student_id || '-'}</div>
              <div>{new Date(user.created_at).toLocaleDateString()}</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <ActionButton
                  onClick={() => {
                    const newRole = prompt('Enter new role (student/club_head/canteen_vendor/hostel_admin/super_admin):', user.role);
                    if (newRole && ['student', 'club_head', 'canteen_vendor', 'hostel_admin', 'super_admin'].includes(newRole)) {
                      handleUpdateRole(user.id, newRole);
                    }
                  }}
                  title="Edit Role"
                >
                  <Edit size={16} />
                </ActionButton>
                <ActionButton
                  $variant="delete"
                  onClick={() => handleDeleteUser(user.id)}
                  title="Delete User"
                >
                  <Trash2 size={16} />
                </ActionButton>
              </div>
            </TableRow>
          ))
        )}
      </UserTable>
    </Container>
  );
};

export default UserManagement; 