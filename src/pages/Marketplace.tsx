import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Filter, Plus, Heart, Package, Tag, Star, DollarSign } from 'lucide-react';
import { fetchItems, addToWishlist, removeFromWishlist } from '../store/slices/marketplaceSlice';
import ProductCard from '../components/Marketplace/ProductCard';
import SellItemModal from '../components/Marketplace/SellItemModal';
import ContactSellerModal from '../components/Marketplace/ContactSellerModal';
import type { RootState, AppDispatch } from '../store/store';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const MarketplaceContainer = styled.div`
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
  border-top: 3px solid #8b5cf6;
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

const SellButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  padding: 0.875rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  align-self: flex-start;
  
  @media (min-width: 768px) {
    align-self: center;
  }
  
  &:hover {
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(139, 92, 246, 0.3);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3);
  }
`;

const ButtonIcon = styled(Plus)`
  width: 1.25rem;
  height: 1.25rem;
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
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
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
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
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
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }
`;

const WishlistButton = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  font-weight: 500;
  font-size: 0.875rem;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.$isActive ? `
    background-color: #fef2f2;
    border-color: #fecaca;
    color: #dc2626;
  ` : `
    background-color: ${props.theme.colors.surface};
    border-color: ${props.theme.colors.border};
    color: ${props.theme.colors.textSecondary};
    
    &:hover {
      background-color: ${props.theme.isDark ? '#475569' : '#f8fafc'};
      border-color: ${props.theme.isDark ? '#64748b' : '#cbd5e1'};
    }
  `}
`;

const WishlistIcon = styled(Heart)<{ $isActive: boolean }>`
  width: 1.25rem;
  height: 1.25rem;
  
  ${props => props.$isActive && `
    fill: currentColor;
  `}
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.2s ease;
  border: 1px solid ${props => props.theme.colors.border};
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const StatValue = styled.div<{ color: string }>`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.color};
  margin-bottom: 0.5rem;
  line-height: 1;
  
  @media (min-width: 640px) {
    font-size: 2.25rem;
  }
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  font-weight: 500;
`;

const ItemsGrid = styled.div`
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

const EmptyState = styled.div`
  text-center: center;
  padding: 3rem 1.5rem;
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid ${props => props.theme.colors.border};
  
  @media (min-width: 640px) {
    padding: 4rem 2rem;
  }
`;

const EmptyIcon = styled(Search)`
  width: 3rem;
  height: 3rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 auto 1rem;
  
  @media (min-width: 640px) {
    width: 4rem;
    height: 4rem;
  }
`;

const EmptyTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
  
  @media (min-width: 640px) {
    font-size: 1.25rem;
  }
`;

const EmptyText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const SearchIcon = styled(Search)`
  width: 1.25rem;
  height: 1.25rem;
`;

const FilterIcon = styled(Filter)`
  width: 1.25rem;
  height: 1.25rem;
`;

const Marketplace: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, wishlist, loading } = useSelector((state: RootState) => state.marketplace);
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ sellerId: string; itemId: string; title: string } | null>(null);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const handleWishlistToggle = (itemId: string) => {
    if (wishlist.includes(itemId)) {
      dispatch(removeFromWishlist(itemId));
    } else {
      dispatch(addToWishlist(itemId));
    }
  };

  const handleContactSeller = (sellerId: string, itemId: string, title: string) => {
    setSelectedItem({ sellerId, itemId, title });
    setIsContactModalOpen(true);
  };

  const categories = ['Books', 'Electronics', 'Clothing', 'Furniture', 'Sports', 'Other'];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesWishlist = !showWishlistOnly || wishlist.includes(item.id);
    return matchesSearch && matchesCategory && matchesWishlist;
  });

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
      </LoadingContainer>
    );
  }

  return (
    <MarketplaceContainer>
      {/* Header */}
      <Header>
        <HeaderContent>
          <HeaderTitle>Student Marketplace</HeaderTitle>
          <HeaderSubtitle>Buy and sell items with your fellow students</HeaderSubtitle>
        </HeaderContent>
        
        {user && (
          <SellButton onClick={() => setIsSellModalOpen(true)}>
            <ButtonIcon />
            Sell Item
          </SellButton>
        )}
      </Header>

      {/* Filters */}
      <FiltersContainer>
        <FiltersGrid>
          <InputContainer>
            <InputIcon>
              <SearchIcon />
            </InputIcon>
            <SearchInput
              type="text"
              placeholder="Search items..."
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
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </FilterSelect>
          </InputContainer>

          <WishlistButton
            $isActive={showWishlistOnly}
            onClick={() => setShowWishlistOnly(!showWishlistOnly)}
          >
            <WishlistIcon $isActive={showWishlistOnly} />
            <span>Wishlist Only</span>
          </WishlistButton>
        </FiltersGrid>
      </FiltersContainer>

      {/* Stats */}
      <StatsGrid>
        <StatCard>
          <StatValue color="#8b5cf6">{items.length}</StatValue>
          <StatLabel>Items Available</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue color="#10b981">{categories.length}</StatValue>
          <StatLabel>Categories</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue color="#3b82f6">{wishlist.length}</StatValue>
          <StatLabel>Wishlisted</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue color="#f59e0b">
            ₹{items.reduce((sum, item) => sum + item.price, 0).toLocaleString()}
          </StatValue>
          <StatLabel>Total Value</StatLabel>
        </StatCard>
      </StatsGrid>

      {/* Items Grid */}
      <ItemsGrid>
        {filteredItems.map(item => (
          <ProductCard
            key={item.id}
            item={item}
            isWishlisted={wishlist.includes(item.id)}
            onWishlistToggle={handleWishlistToggle}
            onContact={(sellerId) => handleContactSeller(sellerId, item.id, item.title)}
          />
        ))}
      </ItemsGrid>

      {filteredItems.length === 0 && (
        <EmptyState>
          <EmptyIcon />
          <EmptyTitle>No items found</EmptyTitle>
          <EmptyText>Try adjusting your search or filter criteria</EmptyText>
        </EmptyState>
      )}

      {/* Sell Item Modal */}
      {user && (
        <SellItemModal
          isOpen={isSellModalOpen}
          onClose={() => setIsSellModalOpen(false)}
          userId={user.id}
        />
      )}

      {/* Contact Seller Modal */}
      {user && selectedItem && (
        <ContactSellerModal
          isOpen={isContactModalOpen}
          onClose={() => {
            setIsContactModalOpen(false);
            setSelectedItem(null);
          }}
          sellerId={selectedItem.sellerId}
          itemId={selectedItem.itemId}
          itemTitle={selectedItem.title}
          currentUserId={user.id}
        />
      )}
    </MarketplaceContainer>
  );
};

export default Marketplace;