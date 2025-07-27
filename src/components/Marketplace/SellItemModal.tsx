import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { createItem } from '../../store/slices/marketplaceSlice';
import { X, Package, Tag, DollarSign, Image, Upload, Trash2, Plus } from 'lucide-react';
import { uploadImage } from '../../lib/supabase';
import toast from 'react-hot-toast';
import type { AppDispatch } from '../../store/store';
import styled from 'styled-components';

interface SellItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  max-width: 40rem;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid ${props => props.theme.colors.border};
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ModalTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitleText = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  color: ${props => props.theme.colors.textSecondary};
  border-radius: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.isDark ? '#475569' : '#f1f5f9'};
    color: ${props => props.theme.colors.text};
  }
`;

const CloseIcon = styled(X)`
  width: 1.5rem;
  height: 1.5rem;
`;

const ModalForm = styled.form`
  padding: 1.5rem;
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
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
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
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
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
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ImageUploadContainer = styled.div`
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    border-color: #8b5cf6;
    background-color: ${props => props.theme.isDark ? '#1e293b' : '#f8fafc'};
  }
  
  &.drag-over {
    border-color: #8b5cf6;
    background-color: ${props => props.theme.isDark ? '#1e293b' : '#f8fafc'};
  }
`;

const UploadIcon = styled(Upload)`
  width: 2rem;
  height: 2rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 auto 0.5rem;
`;

const UploadText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  margin: 0;
`;

const UploadSubtext = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.75rem;
  margin: 0.25rem 0 0 0;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ImagePreviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ImagePreviewItem = styled.div`
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
  aspect-ratio: 1;
  border: 1px solid ${props => props.theme.colors.border};
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background-color: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #dc2626;
    transform: scale(1.1);
  }
`;

const RemoveIcon = styled(Trash2)`
  width: 0.75rem;
  height: 0.75rem;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  padding: 0.875rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(139, 92, 246, 0.3);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonIcon = styled(Package)`
  width: 1.25rem;
  height: 1.25rem;
`;

const SellItemModal: React.FC<SellItemModalProps> = ({ isOpen, onClose, userId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '' as 'new' | 'like_new' | 'good' | 'fair' | 'poor',
    images: [] as string[],
  });

  const categories = ['Books', 'Electronics', 'Clothing', 'Furniture', 'Sports', 'Other'];
  const conditions: Array<'new' | 'like_new' | 'good' | 'fair' | 'poor'> = ['new', 'like_new', 'good', 'fair', 'poor'];
  const conditionLabels: Record<typeof conditions[number], string> = {
    'new': 'New',
    'like_new': 'Like New',
    'good': 'Good',
    'fair': 'Fair',
    'poor': 'Poor'
  };



  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => uploadImage(file, userId, 'marketplace'));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
      
      toast.success(`${files.length} image(s) uploaded successfully!`);
    } catch (error) {
      toast.error('Failed to upload image(s)');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        seller_id: userId,
        is_available: true,
      };

      await dispatch(createItem(submitData)).unwrap();
      toast.success('Item listed successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to list item');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            <ModalTitleText>Sell an Item</ModalTitleText>
            <CloseButton onClick={onClose}>
              <CloseIcon />
            </CloseButton>
          </ModalTitle>
        </ModalHeader>

        <ModalForm onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>Title</FormLabel>
            <FormInput
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Enter item title"
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Description</FormLabel>
            <FormTextarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Describe your item..."
            />
          </FormGroup>

          <FormGrid>
            <FormGroup>
              <FormLabel>Price (₹)</FormLabel>
              <FormInput
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Category</FormLabel>
              <FormSelect
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </FormSelect>
            </FormGroup>
          </FormGrid>

          <FormGroup>
            <FormLabel>Condition</FormLabel>
            <FormSelect
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Condition</option>
              {conditions.map(condition => (
                <option key={condition} value={condition}>{conditionLabels[condition]}</option>
              ))}
            </FormSelect>
          </FormGroup>

          <FormGroup>
            <FormLabel>Images (Optional)</FormLabel>
            <ImageUploadContainer
              className={dragOver ? 'drag-over' : ''}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadIcon />
              <UploadText>Click to upload or drag and drop</UploadText>
              <UploadSubtext>PNG, JPG, JPEG up to 5MB each</UploadSubtext>
            </ImageUploadContainer>
            
            <HiddenFileInput
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
            />

            {formData.images.length > 0 && (
              <ImagePreviewContainer>
                {formData.images.map((imageUrl, index) => (
                  <ImagePreviewItem key={index}>
                    <ImagePreview src={imageUrl} alt={`Preview ${index + 1}`} />
                    <RemoveImageButton onClick={() => removeImage(index)}>
                      <RemoveIcon />
                    </RemoveImageButton>
                    {isUploading && index >= formData.images.length - 1 && (
                      <LoadingOverlay>Uploading...</LoadingOverlay>
                    )}
                  </ImagePreviewItem>
                ))}
              </ImagePreviewContainer>
            )}
          </FormGroup>

          <SubmitButton type="submit" disabled={isUploading}>
            <ButtonIcon />
            {isUploading ? 'Uploading...' : 'List Item for Sale'}
          </SubmitButton>
        </ModalForm>
      </ModalContent>
    </ModalOverlay>
  );
};

export default SellItemModal;
