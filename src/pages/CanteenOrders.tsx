import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CheckCircle, XCircle, Clock, Package, User, Phone, Mail } from 'lucide-react';
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
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  padding: 1.5rem;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
`;

const FilterButton = styled.button<{ $isActive: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.$isActive ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 0.5rem;
  background-color: ${props => props.$isActive ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$isActive ? 'white' : props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;

  &:hover {
    background-color: ${props => props.$isActive ? props.theme.colors.primary : props.theme.colors.surface};
  }
`;

const OrdersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const OrderCard = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  padding: 1.25rem;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    gap: 0.5rem;
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const OrderInfo = styled.div`
  flex: 1;
`;

const OrderNumber = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const OrderTime = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const OrderStatus = styled.div<{ $status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: ${props => {
    switch (props.$status) {
      case 'pending': return '#fef3c7';
      case 'confirmed': return '#dbeafe';
      case 'preparing': return '#fef3c7';
      case 'ready': return '#dcfce7';
      case 'delivered': return '#dcfce7';
      case 'cancelled': return '#fee2e2';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'pending': return '#92400e';
      case 'confirmed': return '#1e40af';
      case 'preparing': return '#92400e';
      case 'ready': return '#166534';
      case 'delivered': return '#166534';
      case 'cancelled': return '#991b1b';
      default: return '#374151';
    }
  }};
`;

const CustomerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: ${props => props.theme.colors.background};
  border-radius: 0.5rem;
`;

const CustomerIcon = styled.div`
  color: ${props => props.theme.colors.textSecondary};
`;

const CustomerDetails = styled.div`
  flex: 1;
`;

const CustomerName = styled.div`
  font-weight: 700;
  font-size: 1.125rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CustomerContact = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const OrderItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const OrderItemsHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  @media (max-width: 768px) {
    gap: 0.5rem;
    padding: 0.375rem 0.5rem;
    font-size: 0.7rem;
  }
`;

const OrderItem = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background-color: ${props => props.theme.colors.background};
  border-radius: 0.25rem;
  font-size: 0.875rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr auto auto;
    gap: 0.5rem;
    padding: 0.5rem;
    font-size: 0.8rem;
  }
`;

const ItemName = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ItemQuantity = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
  text-align: center;
  min-width: 40px;
`;

const ItemPrice = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  text-align: right;
  min-width: 60px;
`;

const OrderTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 1.125rem;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
    font-size: 1rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 0.375rem;
  }
`;

const ActionButton = styled.button<{ $variant: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex: 1;
  min-width: 120px;
  justify-content: center;

  background-color: ${props => {
    switch (props.$variant) {
      case 'primary': return props.theme.colors.primary;
      case 'secondary': return props.theme.colors.surface;
      case 'danger': return '#ef4444';
      default: return props.theme.colors.surface;
    }
  }};
  color: ${props => {
    switch (props.$variant) {
      case 'primary': return 'white';
      case 'secondary': return props.theme.colors.text;
      case 'danger': return 'white';
      default: return props.theme.colors.text;
    }
  }};
  border: 1px solid ${props => {
    switch (props.$variant) {
      case 'secondary': return props.theme.colors.border;
      default: return 'transparent';
    }
  }};

  &:hover {
    background-color: ${props => {
      switch (props.$variant) {
        case 'primary': return props.theme.colors.primary;
        case 'secondary': return props.theme.colors.background;
        case 'danger': return '#dc2626';
        default: return props.theme.colors.background;
      }
    }};
  }
  
  @media (max-width: 768px) {
    padding: 0.375rem 0.75rem;
    font-size: 0.8rem;
    min-width: 100px;
  }
`;

const ManagementButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: ${props => props.theme.colors.background};
  border-radius: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

// Types for orders
interface OrderItem {
  item_id: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  delivery_type: 'pickup' | 'delivery';
  delivery_address?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    email: string;
    phone: string;
  };
}

const CanteenOrders: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('canteen_orders')
        .select(`
          *,
          profiles!canteen_orders_user_id_fkey (
            full_name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch canteen items to get item names
      const { data: menuItems, error: menuError } = await supabase
        .from('canteen_items')
        .select('id, name, price');

      if (menuError) {
        console.error('Error fetching menu items:', menuError);
      }

      // Create a map of item_id to item details
      const itemMap = new Map();
      if (menuItems) {
        menuItems.forEach((item: { id: string; name: string; price: number }) => {
          itemMap.set(item.id, item);
        });
      }

      // Add item names to orders
      const ordersWithItemNames = data?.map(order => ({
        ...order,
        items: order.items.map((item: OrderItem) => ({
          ...item,
          name: itemMap.get(item.item_id)?.name || getFallbackItemName(item.item_id),
          menu_price: itemMap.get(item.item_id)?.price || item.price
        }))
      })) || [];

      setOrders(ordersWithItemNames);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFallbackItemName = (itemId: string) => {
    // Create more meaningful fallback names based on item ID
    const fallbackNames = [
      'Chicken Burger',
      'Veggie Pizza', 
      'French Fries',
      'Coca Cola',
      'Beef Steak',
      'Mashed Potatoes',
      'Green Salad',
      'Garlic Bread',
      'Ice Cream',
      'Coffee',
      'Tea',
      'Sandwich',
      'Pasta',
      'Rice Bowl',
      'Soup',
      'Dessert'
    ];
    
    // Use item ID to generate a consistent name
    const index = parseInt(itemId.slice(-2), 16) % fallbackNames.length;
    return fallbackNames[index];
  };

  const filteredOrders = filter === 'all' 
    ? orders.filter((order: Order) => !['delivered', 'cancelled'].includes(order.status))
    : orders.filter((order: Order) => order.status === filter);

  const stats = {
    total: orders.filter((o: Order) => !['delivered', 'cancelled'].includes(o.status)).length,
    pending: orders.filter((o: Order) => o.status === 'pending').length,
    preparing: orders.filter((o: Order) => o.status === 'preparing').length,
    ready: orders.filter((o: Order) => o.status === 'ready').length,
    delivered: orders.filter((o: Order) => o.status === 'delivered').length,
    cancelled: orders.filter((o: Order) => o.status === 'cancelled').length,
  };

  const handleStatusUpdate = async (orderId: string, newStatus: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('canteen_orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      // Update the order status in the UI
      setOrders(prev => 
        prev.map((order: Order) => 
          order.id === orderId 
            ? { ...order, status: newStatus }
            : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      console.log('Attempting to delete order:', orderId);
      
      const { data, error } = await supabase
        .from('canteen_orders')
        .delete()
        .eq('id', orderId)
        .select();

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      console.log('Delete successful:', data);

      // Remove order from UI
      setOrders(prev => prev.filter((order: Order) => order.id !== orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order. Check console for details.');
    }
  };

  const handleDeleteAllOrders = async (status: 'delivered' | 'cancelled') => {
    try {
      console.log('Attempting to delete all orders with status:', status);
      
      const { data, error } = await supabase
        .from('canteen_orders')
        .delete()
        .eq('status', status)
        .select();

      if (error) {
        console.error('Bulk delete error:', error);
        throw error;
      }

      console.log('Bulk delete successful:', data);

      // Remove all orders with this status from UI
      setOrders(prev => prev.filter((order: Order) => order.status !== status));
    } catch (error) {
      console.error('Error deleting orders:', error);
      alert('Failed to delete orders. Check console for details.');
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>Canteen Orders</Title>
        </Header>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading orders...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Canteen Orders</Title>
      </Header>

      <StatsContainer>
        <StatCard>
          <StatNumber>{stats.total}</StatNumber>
          <StatLabel>Active Orders</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.pending}</StatNumber>
          <StatLabel>Pending</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.preparing}</StatNumber>
          <StatLabel>Preparing</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.ready}</StatNumber>
          <StatLabel>Ready</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.delivered}</StatNumber>
          <StatLabel>Delivered</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.cancelled}</StatNumber>
          <StatLabel>Cancelled</StatLabel>
        </StatCard>
      </StatsContainer>

      <FilterContainer>
        <FilterButton 
          $isActive={filter === 'all'} 
          onClick={() => setFilter('all')}
        >
          Active Orders
        </FilterButton>
        <FilterButton 
          $isActive={filter === 'pending'} 
          onClick={() => setFilter('pending')}
        >
          Pending
        </FilterButton>
        <FilterButton 
          $isActive={filter === 'confirmed'} 
          onClick={() => setFilter('confirmed')}
        >
          Confirmed
        </FilterButton>
        <FilterButton 
          $isActive={filter === 'preparing'} 
          onClick={() => setFilter('preparing')}
        >
          Preparing
        </FilterButton>
        <FilterButton 
          $isActive={filter === 'ready'} 
          onClick={() => setFilter('ready')}
        >
          Ready
        </FilterButton>
        <FilterButton 
          $isActive={filter === 'delivered'} 
          onClick={() => setFilter('delivered')}
        >
          Delivered
        </FilterButton>
        <FilterButton 
          $isActive={filter === 'cancelled'} 
          onClick={() => setFilter('cancelled')}
        >
          Cancelled
        </FilterButton>
      </FilterContainer>

      {/* Management buttons for delivered/cancelled orders */}
      {(filter === 'delivered' || filter === 'cancelled') && (
        <ManagementButtons>
          <ActionButton 
            $variant="secondary"
            onClick={() => handleDeleteAllOrders(filter)}
          >
            Delete All {filter === 'delivered' ? 'Delivered' : 'Cancelled'} Orders
          </ActionButton>
          {filter === 'cancelled' && (
            <ActionButton 
              $variant="primary"
              onClick={() => setFilter('all')}
            >
              Back to Active Orders
            </ActionButton>
          )}
        </ManagementButtons>
      )}

      <OrdersGrid>
        {filteredOrders.map((order) => (
          <OrderCard key={order.id}>
            <OrderHeader>
              <OrderInfo>
                <OrderNumber>Order #{order.id.slice(0, 8)}</OrderNumber>
                <OrderTime>
                  <Clock size={14} />
                  {formatTime(order.created_at)}
                </OrderTime>
              </OrderInfo>
                              <OrderStatus $status={order.status}>
                {order.status.toUpperCase()}
              </OrderStatus>
            </OrderHeader>

            <CustomerInfo>
              <CustomerIcon>
                <User size={16} />
              </CustomerIcon>
              <CustomerDetails>
                <CustomerName>{order.profiles?.full_name || 'Unknown Customer'}</CustomerName>
                <CustomerContact>
                  <Mail size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  {order.profiles?.email || 'No email'} • 
                  <Phone size={12} style={{ display: 'inline', marginRight: '0.25rem', marginLeft: '0.5rem' }} />
                  {order.profiles?.phone || 'No phone'}
                </CustomerContact>
              </CustomerDetails>
            </CustomerInfo>

            <OrderItems>
              <OrderItemsHeader>
                <span>Item</span>
                <span>Qty</span>
                <span>Price</span>
              </OrderItemsHeader>
              {order.items.map((item, index) => (
                <OrderItem key={index}>
                  <ItemName>{(item as any).name || `Item #${item.item_id.slice(0, 8)}`}</ItemName>
                  <ItemQuantity>{item.quantity}</ItemQuantity>
                  <ItemPrice>${(item.price * item.quantity).toFixed(2)}</ItemPrice>
                </OrderItem>
              ))}
            </OrderItems>

            <OrderTotal>
              <span>Total</span>
              <span>${order.total_amount.toFixed(2)}</span>
            </OrderTotal>
            
            {order.delivery_type === 'delivery' && order.delivery_address && (
              <div style={{ 
                marginTop: '0.5rem', 
                padding: '0.5rem', 
                backgroundColor: '#f3f4f6', 
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                color: '#6b7280'
              }}>
                🚚 Delivery to: {order.delivery_address}
              </div>
            )}

            <ActionButtons>
              {order.status === 'pending' && (
                <>
                  <ActionButton 
                    $variant="primary"
                    onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                  >
                    <CheckCircle size={14} />
                    Accept Order
                  </ActionButton>
                  <ActionButton 
                    $variant="danger"
                    onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                  >
                    <XCircle size={14} />
                    Reject Order
                  </ActionButton>
                </>
              )}
              {order.status === 'confirmed' && (
                <ActionButton 
                  $variant="primary"
                  onClick={() => handleStatusUpdate(order.id, 'preparing')}
                >
                  <Package size={14} />
                  Start Preparing
                </ActionButton>
              )}
              {order.status === 'preparing' && (
                <ActionButton 
                  $variant="primary"
                  onClick={() => handleStatusUpdate(order.id, 'ready')}
                >
                  <CheckCircle size={14} />
                  Mark Ready
                </ActionButton>
              )}
              {order.status === 'ready' && (
                <ActionButton 
                  $variant="primary"
                  onClick={() => handleStatusUpdate(order.id, 'delivered')}
                >
                  <CheckCircle size={14} />
                  Mark Delivered
                </ActionButton>
              )}
              {(order.status === 'delivered' || order.status === 'cancelled') && (
                <ActionButton 
                  $variant="danger"
                  onClick={() => handleDeleteOrder(order.id)}
                >
                  <XCircle size={14} />
                  Delete Order
                </ActionButton>
              )}
              {order.status === 'cancelled' && (
                <ActionButton 
                  $variant="primary"
                  onClick={() => handleStatusUpdate(order.id, 'pending')}
                >
                  <CheckCircle size={14} />
                  Restore to Pending
                </ActionButton>
              )}
            </ActionButtons>
          </OrderCard>
        ))}
      </OrdersGrid>
    </Container>
  );
};

export default CanteenOrders; 