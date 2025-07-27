import React, { useState } from 'react';
import { Plus, Minus, Heart, Star, Clock, Zap } from 'lucide-react';
import styled from 'styled-components';

interface FoodItemProps {
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image_url?: string;
    is_available: boolean;
    preparation_time?: number;
    rating?: number;
    is_popular?: boolean;
  };
  quantity: number;
  onQuantityChange: (item: any, quantity: number) => void;
  onAddToFavorites?: (itemId: string) => void;
  isFavorite?: boolean;
}

const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
`;

const FoodImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  gap: 0.5rem;
`;

const Badge = styled.div<{ $type: 'popular' | 'new' | 'spicy' }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: ${props => {
    switch (props.$type) {
      case 'popular': return '#fef3c7';
      case 'new': return '#dbeafe';
      case 'spicy': return '#fee2e2';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.$type) {
      case 'popular': return '#92400e';
      case 'new': return '#1e40af';
      case 'spicy': return '#991b1b';
      default: return '#374151';
    }
  }};
`;

const FavoriteButton = styled.button<{ $isFavorite: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: none;
  background-color: ${props => props.$isFavorite ? '#ef4444' : 'rgba(255, 255, 255, 0.9)'};
  color: ${props => props.$isFavorite ? 'white' : '#6b7280'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$isFavorite ? '#dc2626' : 'white'};
    transform: scale(1.1);
  }
`;

const Content = styled.div`
  padding: 1.25rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  line-height: 1.3;
`;

const Price = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

const Description = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #f59e0b;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${props => props.theme.colors.background};
  border-radius: 0.5rem;
  padding: 0.25rem;
`;

const QuantityButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  border: none;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: white;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Quantity = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  min-width: 1.5rem;
  text-align: center;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  border: none;
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
  }
`;

const UnavailableBadge = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  z-index: 10;
`;

const EnhancedFoodItemCard: React.FC<FoodItemProps> = ({
  item,
  quantity,
  onQuantityChange,
  onAddToFavorites,
  isFavorite = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 0) {
      onQuantityChange(item, newQuantity);
    }
  };

  const handleAddToFavorites = () => {
    if (onAddToFavorites) {
      onAddToFavorites(item.id);
    }
  };

  return (
    <Card 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ImageContainer>
        {item.image_url ? (
          <FoodImage src={item.image_url} alt={item.name} />
        ) : (
          <div style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
            color: '#9ca3af'
          }}>
            <span style={{ fontSize: '2rem' }}>🍽️</span>
          </div>
        )}
        
        <ImageOverlay>
          {item.is_popular && (
            <Badge $type="popular">
              <Zap size={12} />
              Popular
            </Badge>
          )}
          {onAddToFavorites && (
            <FavoriteButton 
              $isFavorite={isFavorite}
              onClick={handleAddToFavorites}
            >
              <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
            </FavoriteButton>
          )}
        </ImageOverlay>
        
        {!item.is_available && (
          <UnavailableBadge>Currently Unavailable</UnavailableBadge>
        )}
      </ImageContainer>

      <Content>
        <Header>
          <Title>{item.name}</Title>
          <Price>${item.price.toFixed(2)}</Price>
        </Header>

        <Description>{item.description}</Description>

        <MetaInfo>
          {item.rating && (
            <Rating>
              <Star size={12} fill="currentColor" />
              {item.rating.toFixed(1)}
            </Rating>
          )}
          {item.preparation_time && (
            <MetaItem>
              <Clock size={12} />
              {item.preparation_time}min
            </MetaItem>
          )}
          <MetaItem>
            {item.category}
          </MetaItem>
        </MetaInfo>

        <Actions>
          {quantity > 0 ? (
            <QuantityControls>
              <QuantityButton 
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 0}
              >
                <Minus size={16} />
              </QuantityButton>
              <Quantity>{quantity}</Quantity>
              <QuantityButton 
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                <Plus size={16} />
              </QuantityButton>
            </QuantityControls>
          ) : (
            <AddButton 
              onClick={() => handleQuantityChange(1)}
              disabled={!item.is_available}
            >
              <Plus size={16} />
              Add to Cart
            </AddButton>
          )}
        </Actions>
      </Content>
    </Card>
  );
};

export default EnhancedFoodItemCard; 