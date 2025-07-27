import React, { useState } from 'react';
import styled from 'styled-components';
import { Minus, Plus } from 'lucide-react';

interface FoodItemCardProps {
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url?: string;
    is_available: boolean;
  };
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

const CardContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1.5px solid ${props => props.theme.colors.border};
  border-radius: 1rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: box-shadow 0.2s, transform 0.2s;
  &:hover, &:focus-within {
    box-shadow: 0 6px 24px rgba(0,0,0,0.10);
    transform: translateY(-2px) scale(1.01);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 240px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const FoodImage = styled.img`
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
  background: #e5e7eb;
`;

const PlaceholderText = styled.span`
  font-size: 2.5rem;
  color: #9ca3af;
`;

const CardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.25rem 1.25rem 1rem 1.25rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const ItemName = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
`;

const Price = styled.div`
  font-size: 1.15rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-left: 0.5rem;
`;

const ItemDescription = styled.p<{ $expanded: boolean }>`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1.25rem;
  font-size: 1rem;
  line-height: 1.6;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: ${props => (props.$expanded ? 'unset' : 2)};
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: ${props => (props.$expanded ? 'normal' : 'initial')};
`;

const ReadMoreButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  margin-top: -0.75rem;
  margin-bottom: 0.75rem;
  text-align: left;
  &:hover, &:focus {
    text-decoration: underline;
    outline: none;
  }
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuantityButton = styled.button<{ $variant: 'add' | 'remove' }>`
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: 700;
  outline: none;
  background-color: ${props => props.$variant === 'add' ? props.theme.colors.primary : props.theme.colors.surface};
  color: ${props => props.$variant === 'add' ? 'white' : props.theme.colors.text};
  box-shadow: 0 0 0 2px transparent;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  &:hover, &:focus {
    background-color: ${props => props.$variant === 'add' ? '#ea580c' : props.theme.colors.background};
    color: #fff;
    box-shadow: 0 0 0 2px #f59e0b44;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  min-width: 2rem;
  text-align: center;
`;

const TotalAmount = styled.div`
  font-size: 1.05rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-left: 1.5rem;
  white-space: nowrap;
`;

const FoodItemCard: React.FC<FoodItemCardProps> = ({ item, quantity, onQuantityChange }) => {
  const [descExpanded, setDescExpanded] = useState(false);
  const isLongDesc = item.description.length > 80;

  return (
    <CardContainer tabIndex={0} aria-label={item.name}>
      <ImageContainer>
        {item.image_url ? (
          <FoodImage src={item.image_url} alt={item.name} />
        ) : (
          <PlaceholderImage>
            <PlaceholderText>{item.name.charAt(0)}</PlaceholderText>
          </PlaceholderImage>
        )}
      </ImageContainer>
      <CardContent>
        <CardHeader>
          <ItemName>{item.name}</ItemName>
          <Price>₹{item.price}</Price>
        </CardHeader>
        <ItemDescription $expanded={descExpanded}>
          {item.description}
        </ItemDescription>
        {isLongDesc && !descExpanded && (
          <ReadMoreButton onClick={() => setDescExpanded(true)} aria-label={`Read more about ${item.name}`}>
            Read more
          </ReadMoreButton>
        )}
        <CardFooter>
          <QuantityControls>
            <QuantityButton
              $variant="remove"
              onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
              disabled={quantity === 0}
              aria-label={`Remove one ${item.name}`}
            >
              <Minus />
            </QuantityButton>
            <QuantityDisplay>{quantity}</QuantityDisplay>
            <QuantityButton
              $variant="add"
              onClick={() => onQuantityChange(quantity + 1)}
              aria-label={`Add one ${item.name}`}
            >
              <Plus />
            </QuantityButton>
          </QuantityControls>
          {quantity > 0 && (
            <TotalAmount>
              Total: ₹{item.price * quantity}
            </TotalAmount>
          )}
        </CardFooter>
      </CardContent>
    </CardContainer>
  );
};

export default FoodItemCard;