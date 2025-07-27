import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Plus, Edit, Trash2, Upload, X, Save, Package, Camera } from 'lucide-react';
import type { RootState } from '../store/store';
import { supabase } from '../lib/supabase';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const AddButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: ${props => props.theme.colors.primary};
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
`;

const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ItemCard = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.2s;
  position: relative;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ItemImage = styled.div<{ $imageUrl?: string }>`
  width: 100%;
  height: 200px;
  background-color: ${props => props.theme.colors.background};
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: ${props => props.$imageUrl ? `url(${props.$imageUrl})` : 'none'};
  background-size: cover;
  background-position: center;
  position: relative;
  
  @media (max-width: 768px) {
    height: 150px;
  }
`;

const ImagePlaceholder = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  text-align: center;
`;

const ItemName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.5rem 0;
`;

const ItemDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  margin: 0 0 1rem 0;
  line-height: 1.5;
`;

const ItemDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ItemPrice = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

const ItemCategory = styled.div`
  padding: 0.25rem 0.75rem;
  background-color: ${props => props.theme.colors.background};
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
`;

const ItemActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ $variant: 'edit' | 'delete' }>`
  padding: 0.5rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;

  background-color: ${props => 
    props.$variant === 'edit' 
      ? props.theme.colors.primary 
      : '#ef4444'
  };
  color: white;

  &:hover {
    background-color: ${props => 
      props.$variant === 'edit' 
        ? props.theme.colors.primary 
        : '#dc2626'
    };
  }
`;

const Modal = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 0.75rem;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  
  &:hover {
    background-color: ${props => props.theme.colors.background};
  }
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

const Label = styled.label`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ImageUpload = styled.div`
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.background};
  }
`;

const ImageUploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const UploadIcon = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 2rem;
`;

const UploadText = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const ImagePreview = styled.div<{ $imageUrl?: string }>`
  width: 100%;
  height: 200px;
  background-color: ${props => props.theme.colors.background};
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: ${props => props.$imageUrl ? `url(${props.$imageUrl})` : 'none'};
  background-size: cover;
  background-position: center;
  position: relative;
  border: 1px solid ${props => props.theme.colors.border};
`;

const UploadProgress = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${props => props.theme.colors.border};
  border-radius: 2px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

const ProgressBar = styled.div<{ $progress: number }>`
  height: 100%;
  background-color: ${props => props.theme.colors.primary};
  width: ${props => props.$progress}%;
  transition: width 0.3s ease;
`;

const ImageActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ImageActionButton = styled.button<{ $variant: 'upload' | 'remove' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;

  background-color: ${props => 
    props.$variant === 'upload' 
      ? props.theme.colors.primary 
      : '#ef4444'
  };
  color: white;

  &:hover {
    background-color: ${props => 
      props.$variant === 'upload' 
        ? props.theme.colors.primary 
        : '#dc2626'
    };
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const SubmitButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;

  &:hover {
    background-color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ToggleSwitch = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const Switch = styled.input`
  appearance: none;
  width: 3rem;
  height: 1.5rem;
  background-color: ${props => props.theme.colors.border};
  border-radius: 1rem;
  position: relative;
  cursor: pointer;
  transition: all 0.2s;

  &:checked {
    background-color: ${props => props.theme.colors.primary};
  }

  &::before {
    content: '';
    position: absolute;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    background-color: white;
    top: 0.125rem;
    left: 0.125rem;
    transition: all 0.2s;
  }

  &:checked::before {
    transform: translateX(1.5rem);
  }
`;

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  is_available: boolean;
  vendor_id: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

const CanteenManagement: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main',
    is_available: true,
    image_url: ''
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { value: 'main', label: 'Main Course' },
    { value: 'appetizer', label: 'Appetizer' },
    { value: 'dessert', label: 'Dessert' },
    { value: 'beverage', label: 'Beverage' },
    { value: 'snack', label: 'Snack' }
  ];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('canteen_items')
        .select('*')
        .eq('vendor_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
        vendor_id: user?.id
      };

      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from('canteen_items')
          .update(itemData)
          .eq('id', editingItem.id);

        if (error) throw error;
      } else {
        // Create new item
        const { error } = await supabase
          .from('canteen_items')
          .insert(itemData);

        if (error) throw error;
      }

      setIsModalOpen(false);
      setEditingItem(null);
      resetForm();
      fetchItems();
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      is_available: item.is_available,
      image_url: item.image_url || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase
        .from('canteen_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleToggleAvailability = async (itemId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('canteen_items')
        .update({ is_available: !currentStatus })
        .eq('id', itemId);

      if (error) throw error;
      fetchItems();
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'main',
      is_available: true,
      image_url: ''
    });
  };

  const openAddModal = () => {
    setEditingItem(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    if (!user?.id) return;

    try {
      setUploading(true);
      setUploadProgress(0);

      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `canteen/${user.id}/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Failed to upload image');
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setUploadProgress(100);
      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB.');
        return;
      }

      handleImageUpload(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        if (file.size <= 5 * 1024 * 1024) {
          handleImageUpload(file);
        } else {
          alert('Image size must be less than 5MB.');
        }
      } else {
        alert('Please select an image file.');
      }
    }
  };



  if (loading) {
    return (
      <Container>
        <Header>
          <Title>Canteen Management</Title>
        </Header>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading menu items...
        </div>
      </Container>
    );
  }



  return (
    <Container>
      <Header>
        <Title>Canteen Management</Title>
        <AddButton onClick={openAddModal}>
          <Plus size={20} />
          Add New Item
        </AddButton>
      </Header>

      {items.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          color: '#6b7280'
        }}>
          <Package size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3 style={{ marginBottom: '1rem', color: '#374151' }}>No Menu Items Found</h3>
          <p style={{ marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem auto' }}>
            You haven't added any food items to your menu yet. Start by adding some sample data or create your first item.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <AddButton onClick={openAddModal}>
              <Plus size={20} />
              Add First Item
            </AddButton>
          </div>
        </div>
      ) : (
        <ItemsGrid>
          {items.map((item) => (
            <ItemCard key={item.id}>
              <ItemImage $imageUrl={item.image_url}>
                {!item.image_url && (
                  <ImagePlaceholder>
                    <Package size={48} />
                    <div>No Image</div>
                  </ImagePlaceholder>
                )}
              </ItemImage>
              
              <ItemName>{item.name}</ItemName>
              <ItemDescription>{item.description}</ItemDescription>
              
              <ItemDetails>
                <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
                <ItemCategory>{item.category}</ItemCategory>
              </ItemDetails>

              <ItemActions>
                <ActionButton 
                  $variant="edit"
                  onClick={() => handleEdit(item)}
                >
                  <Edit size={16} />
                </ActionButton>
                <ActionButton 
                  $variant="delete"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 size={16} />
                </ActionButton>
              </ItemActions>

              <ToggleSwitch style={{ marginTop: '1rem' }}>
                <Switch
                  type="checkbox"
                  checked={item.is_available}
                  onChange={() => handleToggleAvailability(item.id, item.is_available)}
                />
                <span>{item.is_available ? 'Available' : 'Unavailable'}</span>
              </ToggleSwitch>
            </ItemCard>
          ))}
        </ItemsGrid>
      )}

      <Modal $isOpen={isModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </ModalTitle>
            <CloseButton onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </CloseButton>
          </ModalHeader>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Item Name</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter item name"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Description</Label>
              <TextArea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter item description"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Price ($)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Category</Label>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Item Image</Label>
              
              {formData.image_url ? (
                <div>
                  <ImagePreview $imageUrl={formData.image_url}>
                    {!formData.image_url && (
                      <ImagePlaceholder>
                        <Package size={48} />
                        <div>No Image</div>
                      </ImagePlaceholder>
                    )}
                  </ImagePreview>
                  <ImageActions>
                    <ImageActionButton 
                      $variant="upload"
                      onClick={triggerFileInput}
                      disabled={uploading}
                    >
                      <Camera size={16} />
                      {uploading ? 'Uploading...' : 'Change Image'}
                    </ImageActionButton>
                    <ImageActionButton 
                      $variant="remove"
                      onClick={() => setFormData({ ...formData, image_url: '' })}
                      disabled={uploading}
                    >
                      <Trash2 size={16} />
                      Remove
                    </ImageActionButton>
                  </ImageActions>
                  {uploading && (
                    <UploadProgress>
                      <ProgressBar $progress={uploadProgress} />
                    </UploadProgress>
                  )}
                </div>
              ) : (
                <ImageUpload 
                  onClick={triggerFileInput}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <ImageUploadContent>
                    <UploadIcon>
                      <Camera size={48} />
                    </UploadIcon>
                    <UploadText>
                      <strong>Click to upload image</strong>
                      <br />
                      or drag and drop
                      <br />
                      <small>PNG, JPG, GIF up to 5MB</small>
                    </UploadText>
                    {uploading && (
                      <UploadProgress>
                        <ProgressBar $progress={uploadProgress} />
                      </UploadProgress>
                    )}
                  </ImageUploadContent>
                </ImageUpload>
              )}
              
                            <HiddenFileInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </FormGroup>

            {!formData.image_url && (
              <FormGroup>
                <Label>Or paste an image URL</Label>
                <Input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  Paste a direct link to an image online
                </div>
              </FormGroup>
            )}

            <ToggleSwitch>
              <Switch
                type="checkbox"
                checked={formData.is_available}
                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
              />
              <span>Available for ordering</span>
            </ToggleSwitch>

            <SubmitButton type="submit">
              {editingItem ? 'Update Item' : 'Add Item'}
            </SubmitButton>
          </Form>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default CanteenManagement; 