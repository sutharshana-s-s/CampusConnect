import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Filter, X, UtensilsCrossed, Star, Clock, TrendingUp, Zap, Heart, Eye } from 'lucide-react';
import { fetchItems, addToCart, placeOrder, clearCart } from '../store/slices/canteenSlice';
import FoodItemCard from '../components/Canteen/FoodItemCard';
import EnhancedFoodItemCard from '../components/Canteen/EnhancedFoodItemCard';
import toast from 'react-hot-toast';
import type { RootState, AppDispatch } from '../store/store';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const CanteenContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 24rem;
`;

const Spinner = styled.div`
  width: 2rem;
  height: 2rem;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #f59e0b;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const HeaderTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  line-height: 1.2;
  
  @media (min-width: 640px) {
    font-size: 2rem;
  }
  
  @media (min-width: 768px) {
    font-size: 2.25rem;
  }
`;

const HeaderSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0.5rem 0 0 0;
  font-size: 1rem;
  line-height: 1.5;
  
  @media (min-width: 640px) {
    font-size: 1.125rem;
  }
`;

const CartButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 1.5rem;
  font-weight: 700;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  align-self: flex-start;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  @media (min-width: 768px) { align-self: center; }
  &:hover, &:focus {
    background: ${props => props.theme.colors.primary};
    outline: none;
    box-shadow: 0 4px 12px rgba(0,0,0,0.18);
  }
`;

const QuickActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 0.25rem;
  }
`;

const QuickActionButton = styled.button<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid ${props => props.$isActive ? props.theme.colors.primary : props.theme.colors.border};
  background-color: ${props => props.$isActive ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$isActive ? 'white' : props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$isActive ? props.theme.colors.primary : props.theme.colors.background};
    transform: translateY(-1px);
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.surface}, ${props => props.theme.colors.background});
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  padding: 1rem;
  text-align: center;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background};
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 2px;
  }
`;

const CategoryTab = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid ${props => props.$isActive ? props.theme.colors.primary : props.theme.colors.border};
  background-color: ${props => props.$isActive ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$isActive ? 'white' : props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    background-color: ${props => props.$isActive ? props.theme.colors.primary : props.theme.colors.background};
    transform: translateY(-1px);
  }
`;

const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const EmptyDescription = styled.p`
  font-size: 1rem;
  max-width: 400px;
  margin: 0 auto;
  line-height: 1.5;
`;

const CartIcon = styled(ShoppingCart)`
  width: 1.25rem;
  height: 1.25rem;
`;

const CartBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  background: ${props => props.theme.colors.primary};
  color: #fff;
  font-size: 0.95rem;
  font-weight: 800;
  border-radius: 1.5rem;
  margin-left: 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.10);
  border: 2px solid ${props => props.theme.colors.surface};
  z-index: 1;
`;

const FiltersContainer = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const SearchFilterContainer = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
`;

const SearchFilterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const InputContainer = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  width: 1.25rem;
  height: 1.25rem;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.875rem 0.75rem 0.875rem 2.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  appearance: none;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
  }
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const CartModalOverlay = styled.div`
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

const CartModalContent = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  max-width: 28rem;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 6px 24px rgba(0,0,0,0.10);
  color: ${props => props.theme.colors.text};
`;

const CartModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.surface};
`;

const CartModalTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CartTitle = styled.h3`
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
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
`;

const CloseIcon = styled(X)`
  width: 1.25rem;
  height: 1.25rem;
`;

const CartModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  max-height: 24rem;
  background: ${props => props.theme.colors.surface};
`;

const EmptyCart = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  padding: 2rem;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: ${props => props.theme.colors.background};
  border-radius: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  border: 1.5px solid ${props => props.theme.colors.border};
  &:last-child { margin-bottom: 0; }
`;

const CartItemInfo = styled.div``;

const CartItemName = styled.h4`
  font-weight: 800;
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
`;

const CartItemDetails = styled.p`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const CartItemPrice = styled.div`
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  font-size: 1.1rem;
`;

const CartModalFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.background};
  position: sticky;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 2;
`;

const CartTotal = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const TotalLabel = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const TotalAmount = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

const PlaceOrderButton = styled.button`
  width: 100%;
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 0.875rem 1rem;
  border-radius: 1rem;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
  &:hover, &:focus {
    background: ${props => props.theme.colors.primary};
    outline: none;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  }
`;

const SearchIcon = styled(Search)`
  width: 1.25rem;
  height: 1.25rem;
`;

const FilterIcon = styled(Filter)`
  width: 1.25rem;
  height: 1.25rem;
`;

const Canteen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, cart, loading } = useSelector((state: RootState) => state.canteen);
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCart, setShowCart] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'popular'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const handleQuantityChange = (item: any, quantity: number) => {
    if (quantity > 0) {
      dispatch(addToCart({ item, quantity: quantity - (cart.find(c => c.item.id === item.id)?.quantity || 0) }));
    }
  };

  const handlePlaceOrder = async () => {
    if (!user || cart.length === 0) return;

    const orderItems = cart.map(cartItem => ({
      item_id: cartItem.item.id,
      quantity: cartItem.quantity,
      price: cartItem.item.price,
    }));

    const totalAmount = cart.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);

    try {
      await dispatch(placeOrder({
        user_id: user.id,
        items: orderItems,
        total_amount: totalAmount,
        delivery_type: 'pickup',
        status: 'pending',
      })).unwrap();
      
      toast.success('Order placed successfully! Check your order status in My Orders.');
      setShowCart(false);
      // Navigate to order tracking after a short delay
      setTimeout(() => {
        navigate('/order-tracking');
      }, 1500);
    } catch (error) {
      toast.error('Failed to place order');
    }
  };

  const categories = ['All', 'Breakfast', 'Lunch', 'Snacks', 'Beverages', 'Desserts'];
  
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
      </LoadingContainer>
    );
  }

  return (
    <CanteenContainer>
      {/* Header */}
      <Header>
        <HeaderContent>
          <HeaderTitle>Campus Canteen</HeaderTitle>
          <HeaderSubtitle>Fresh, delicious meals delivered to your location</HeaderSubtitle>
        </HeaderContent>
        
        <CartButton onClick={() => setShowCart(true)} aria-label="Open cart">
          <ShoppingCart style={{ marginRight: '0.5rem' }} />
          Cart
          {cartItemsCount > 0 && (
            <CartBadge>{cartItemsCount}</CartBadge>
          )}
        </CartButton>
      </Header>

      {/* Filters */}
      <SearchFilterContainer>
        <SearchFilterGrid>
          <InputContainer>
            <InputIcon>
              <SearchIcon />
            </InputIcon>
            <SearchInput
              type="text"
              placeholder="Search food items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputContainer>
          
          <InputContainer>
            <InputIcon>
              <FilterIcon />
            </InputIcon>
            <FilterSelect
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="All">All</option>
              {Array.from(new Set(items.map(item => item.category))).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </FilterSelect>
          </InputContainer>
        </SearchFilterGrid>
      </SearchFilterContainer>

      {/* Menu Items */}
      <MenuGrid>
        {filteredItems.map(item => (
          <FoodItemCard
            key={item.id}
            item={item}
            quantity={cart.find(c => c.item.id === item.id)?.quantity || 0}
            onQuantityChange={quantity => dispatch(addToCart({ item, quantity: quantity - (cart.find(c => c.item.id === item.id)?.quantity || 0) }))}
          />
        ))}
      </MenuGrid>

      {/* Cart Modal */}
      {showCart && (
        <CartModalOverlay>
          <CartModalContent>
            <CartModalHeader>
              <CartModalTitle>
                <CartTitle>Your Order</CartTitle>
                <CloseButton onClick={() => setShowCart(false)}>
                  <CloseIcon />
                </CloseButton>
              </CartModalTitle>
            </CartModalHeader>
            
            <CartModalBody>
              {cart.length === 0 ? (
                <EmptyCart>Your cart is empty</EmptyCart>
              ) : (
                <div>
                  {cart.filter(cartItem => cartItem.quantity > 0).map(cartItem => (
                    <CartItem key={cartItem.item.id}>
                      <CartItemInfo>
                        <CartItemName>{cartItem.item.name}</CartItemName>
                        <CartItemDetails>₹{cartItem.item.price} × {cartItem.quantity}</CartItemDetails>
                      </CartItemInfo>
                      <CartItemPrice>
                        ₹{cartItem.item.price * cartItem.quantity}
                      </CartItemPrice>
                    </CartItem>
                  ))}
                </div>
              )}
            </CartModalBody>
            
            {cart.length > 0 && (
              <CartModalFooter>
                <CartTotal>
                  <TotalLabel>Total:</TotalLabel>
                  <TotalAmount>₹{cartTotal}</TotalAmount>
                </CartTotal>
                <PlaceOrderButton onClick={handlePlaceOrder}>
                  Place Order
                </PlaceOrderButton>
              </CartModalFooter>
            )}
          </CartModalContent>
        </CartModalOverlay>
      )}
    </CanteenContainer>
  );
};

export default Canteen;