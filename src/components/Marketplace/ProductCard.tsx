import React from 'react';
import { Heart, MessageCircle, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Database } from '../../lib/supabase';
import styled from 'styled-components';

type MarketplaceItem = Database['public']['Tables']['marketplace_items']['Row'];

interface ProductCardProps {
  item: MarketplaceItem;
  isWishlisted?: boolean;
  onWishlistToggle?: (itemId: string) => void;
  onContact?: (sellerId: string) => void;
}

const CardContainer = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid ${props => props.theme.colors.border};
`;

const ImageContainer = styled.div`
  position: relative;
  height: 12rem;
  background: linear-gradient(135deg, #a78bfa, #ec4899);

  @media (min-width: 640px) {
    height: 14rem;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #a78bfa, #ec4899);
`;

const PlaceholderText = styled.div`
  color: white;
  font-size: 2rem;
  font-weight: 700;

  @media (min-width: 640px) {
    font-size: 2.5rem;
  }
`;

const WishlistButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.5rem;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.surface};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
  
  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

const WishlistIcon = styled(Heart)<{ $isWishlisted: boolean }>`
  width: 1.25rem;
  height: 1.25rem;
  color: ${props => props.$isWishlisted ? '#ef4444' : props.theme.colors.textSecondary};

  ${props => props.$isWishlisted && `
    fill: currentColor;
  `}
`;

const ConditionBadge = styled.span<{ $color: string }>`
  position: absolute;
  bottom: 0.75rem;
  left: 0.75rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
  background-color: ${props => props.$color.split(' ')[0]};
  color: ${props => props.$color.split(' ')[1]};
`;

const CardContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
  gap: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  line-height: 1.4;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PriceContainer = styled.div`
  text-align: right;
  flex-shrink: 0;
`;

const Price = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CardDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1rem;
  font-size: 0.875rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const CategoryBadge = styled.span`
  background-color: #f3e8ff;
  color: #7c3aed;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
`;

const TimeInfo = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const TimeIcon = styled(MapPin)`
  width: 0.75rem;
  height: 0.75rem;
`;

const ContactButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: auto;
  
  &:hover {
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
  }
`;

const ButtonIcon = styled(MessageCircle)`
  width: 1rem;
  height: 1rem;
`;

const ProductCard: React.FC<ProductCardProps> = ({ 
  item, 
  isWishlisted, 
  onWishlistToggle,
  onContact 
}) => {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'like_new':
        return 'bg-blue-100 text-blue-800';
      case 'good':
        return 'bg-yellow-100 text-yellow-800';
      case 'fair':
        return 'bg-orange-100 text-orange-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <CardContainer>
      <ImageContainer>
        {item.images?.[0] ? (
          <ProductImage 
            src={item.images[0]} 
            alt={item.title}
          />
        ) : (
          <PlaceholderImage>
            <PlaceholderText>
              {item.title.charAt(0)}
            </PlaceholderText>
          </PlaceholderImage>
        )}
        
        <WishlistButton onClick={() => onWishlistToggle?.(item.id)}>
          <WishlistIcon $isWishlisted={isWishlisted || false} />
        </WishlistButton>
        
        <ConditionBadge $color={getConditionColor(item.condition)}>
          {item.condition.replace('_', ' ')}
        </ConditionBadge>
      </ImageContainer>
      
      <CardContent>
        <CardHeader>
          <CardTitle>{item.title}</CardTitle>
          <PriceContainer>
            <Price>₹{item.price}</Price>
          </PriceContainer>
        </CardHeader>
        
        <CardDescription>{item.description}</CardDescription>
        
        <CardFooter>
          <CategoryBadge>{item.category}</CategoryBadge>
          <TimeInfo>
            <TimeIcon />
            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
          </TimeInfo>
        </CardFooter>
        
        <ContactButton onClick={() => onContact?.(item.seller_id)}>
          <ButtonIcon />
          <span>Contact Seller</span>
        </ContactButton>
      </CardContent>
    </CardContainer>
  );
};

export default ProductCard;