import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Clock, 
  CheckCircle, 
  Package, 
  Truck, 
  XCircle, 
  User, 
  MapPin, 
  Calendar,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import type { RootState } from '../store/store';
import { supabase } from '../lib/supabase';
import styled from 'styled-components';

const Container = styled.div`
  padding: 1rem;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
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

const RefreshButton = styled.button`
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const OrdersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const OrderCard = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.375rem;
  padding: 0.75rem;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const OrderNumber = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const OrderTime = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
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

const StatusTimeline = styled.div`
  margin: 0.5rem 0;
  padding: 0.5rem;
  background-color: ${props => props.theme.colors.background};
  border-radius: 0.25rem;
`;

const TimelineTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
`;

const TimelineSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const TimelineStep = styled.div<{ $isActive: boolean; $isCompleted: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem;
  border-radius: 0.25rem;
  background-color: ${props => 
    props.$isCompleted 
      ? '#dcfce7' 
      : props.$isActive 
        ? '#fef3c7' 
        : 'transparent'
  };
  border: 1px solid ${props => 
    props.$isCompleted 
      ? '#22c55e' 
      : props.$isActive 
        ? '#f59e0b' 
        : props.theme.colors.border
  };
`;

const StepIcon = styled.div<{ $isActive: boolean; $isCompleted: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background-color: ${props => 
    props.$isCompleted 
      ? '#22c55e' 
      : props.$isActive 
        ? '#f59e0b' 
        : props.theme.colors.border
  };
  color: ${props => 
    props.$isCompleted || props.$isActive 
      ? 'white' 
      : props.theme.colors.textSecondary
  };
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.div<{ $isActive: boolean; $isCompleted: boolean }>`
  font-weight: ${props => props.$isActive || props.$isCompleted ? '600' : '500'};
  color: ${props => 
    props.$isCompleted 
      ? '#166534' 
      : props.$isActive 
        ? '#92400e' 
        : props.theme.colors.textSecondary
  };
  font-size: 0.75rem;
`;

const StepDescription = styled.div`
  font-size: 0.625rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 0.125rem;
`;

const OrderItems = styled.div`
  margin: 0.75rem 0;
`;

const OrderItemsHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.75rem;
  padding: 0.375rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-weight: 600;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const OrderItem = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.75rem;
  padding: 0.375rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-size: 0.75rem;
`;

const ItemName = styled.div`
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const ItemQuantity = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
`;

const ItemPrice = styled.div`
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  text-align: right;
`;

const OrderTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-top: 2px solid ${props => props.theme.colors.border};
  font-weight: 600;
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
`;

const DeliveryInfo = styled.div`
  margin-top: 0.75rem;
  padding: 0.75rem;
  background-color: ${props => props.theme.colors.background};
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
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
  margin: 0 auto 2rem auto;
  line-height: 1.5;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.textSecondary};
`;

interface OrderItem {
  item_id: string;
  quantity: number;
  price: number;
  name?: string;
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
}

const OrderTracking: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('canteen_orders')
        .select('*')
        .eq('user_id', user?.id)
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
          name: itemMap.get(item.item_id)?.name || `Item #${item.item_id.slice(0, 8)}`
        }))
      })) || [];

      setOrders(ordersWithItemNames);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const getStatusSteps = (currentStatus: string) => {
    const steps = [
      {
        key: 'pending',
        title: 'Order Placed',
        description: 'Your order has been received',
        icon: <Clock size={14} />
      },
      {
        key: 'confirmed',
        title: 'Order Confirmed',
        description: 'Vendor has accepted your order',
        icon: <CheckCircle size={14} />
      },
      {
        key: 'preparing',
        title: 'Preparing',
        description: 'Your food is being prepared',
        icon: <Package size={14} />
      },
      {
        key: 'ready',
        title: 'Ready for Pickup',
        description: 'Your order is ready!',
        icon: <Truck size={14} />
      },
      {
        key: 'delivered',
        title: 'Delivered',
        description: 'Order completed successfully',
        icon: <CheckCircle size={14} />
      }
    ];

    const statusOrder = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);

    return steps.map((step, index) => {
      const stepIndex = statusOrder.indexOf(step.key);
      const isCompleted = stepIndex < currentIndex;
      const isActive = step.key === currentStatus;
      const isCancelled = currentStatus === 'cancelled';

      return {
        ...step,
        isCompleted: isCancelled ? false : isCompleted,
        isActive: isCancelled ? false : isActive
      };
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], { 
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>My Orders</Title>
        </Header>
        <LoadingState>
          Loading your orders...
        </LoadingState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>My Orders</Title>
        <RefreshButton onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </RefreshButton>
      </Header>

      {orders.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <Package size={64} />
          </EmptyIcon>
          <EmptyTitle>No Orders Yet</EmptyTitle>
          <EmptyDescription>
            You haven't placed any orders yet. Visit the canteen to order some delicious food!
          </EmptyDescription>
        </EmptyState>
      ) : (
        <OrdersGrid>
          {orders.map((order) => (
            <OrderCard key={order.id}>
              <OrderHeader>
                <OrderInfo>
                  <OrderNumber>Order #{order.id.slice(0, 8)}</OrderNumber>
                  <OrderTime>
                    <Calendar size={14} />
                    {formatDate(order.created_at)} at {formatTime(order.created_at)}
                  </OrderTime>
                </OrderInfo>
                <OrderStatus $status={order.status}>
                  {order.status.toUpperCase()}
                </OrderStatus>
              </OrderHeader>

              <StatusTimeline>
                <TimelineTitle>
                  <Clock size={16} />
                  Order Progress
                </TimelineTitle>
                <TimelineSteps>
                  {getStatusSteps(order.status).map((step, index) => (
                    <TimelineStep 
                      key={step.key}
                      $isActive={step.isActive}
                      $isCompleted={step.isCompleted}
                    >
                      <StepIcon $isActive={step.isActive} $isCompleted={step.isCompleted}>
                        {step.icon}
                      </StepIcon>
                      <StepContent>
                        <StepTitle $isActive={step.isActive} $isCompleted={step.isCompleted}>
                          {step.title}
                        </StepTitle>
                        <StepDescription>
                          {step.description}
                        </StepDescription>
                      </StepContent>
                    </TimelineStep>
                  ))}
                  {order.status === 'cancelled' && (
                    <TimelineStep $isActive={true} $isCompleted={false}>
                      <StepIcon $isActive={true} $isCompleted={false}>
                        <XCircle size={16} />
                      </StepIcon>
                      <StepContent>
                        <StepTitle $isActive={true} $isCompleted={false}>
                          Order Cancelled
                        </StepTitle>
                        <StepDescription>
                          This order has been cancelled
                        </StepDescription>
                      </StepContent>
                    </TimelineStep>
                  )}
                </TimelineSteps>
              </StatusTimeline>

              <OrderItems>
                <OrderItemsHeader>
                  <span>Item</span>
                  <span>Qty</span>
                  <span>Price</span>
                </OrderItemsHeader>
                {order.items.map((item, index) => (
                  <OrderItem key={index}>
                    <ItemName>{item.name}</ItemName>
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
                <DeliveryInfo>
                  <MapPin size={16} />
                  Delivery to: {order.delivery_address}
                </DeliveryInfo>
              )}

              {order.delivery_type === 'pickup' && (
                <DeliveryInfo>
                  <Package size={16} />
                  Pickup from canteen
                </DeliveryInfo>
              )}
            </OrderCard>
          ))}
        </OrdersGrid>
      )}
    </Container>
  );
};

export default OrderTracking; 