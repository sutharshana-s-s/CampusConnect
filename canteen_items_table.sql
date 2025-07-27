-- Create canteen_items table
CREATE TABLE IF NOT EXISTS canteen_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  category VARCHAR(50) NOT NULL CHECK (category IN ('main', 'appetizer', 'dessert', 'beverage', 'snack')),
  is_available BOOLEAN DEFAULT true,
  vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_canteen_items_vendor_id ON canteen_items(vendor_id);
CREATE INDEX IF NOT EXISTS idx_canteen_items_category ON canteen_items(category);
CREATE INDEX IF NOT EXISTS idx_canteen_items_available ON canteen_items(is_available);
CREATE INDEX IF NOT EXISTS idx_canteen_items_created_at ON canteen_items(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_canteen_items_updated_at 
    BEFORE UPDATE ON canteen_items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO canteen_items (name, description, price, category, vendor_id, image_url) VALUES
('Pepperoni Pizza', 'Delicious pepperoni pizza with melted cheese and tomato sauce', 12.99, 'main', '00000000-0000-0000-0000-000000000000', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400'),
('Chicken Burger', 'Juicy chicken burger with fresh lettuce and special sauce', 8.99, 'main', '00000000-0000-0000-0000-000000000000', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'),
('Caesar Salad', 'Fresh green salad with Caesar dressing and croutons', 6.99, 'appetizer', '00000000-0000-0000-0000-000000000000', 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400'),
('Chocolate Cake', 'Rich chocolate cake with cream frosting', 5.99, 'dessert', '00000000-0000-0000-0000-000000000000', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'),
('French Fries', 'Crispy golden french fries with salt', 3.99, 'snack', '00000000-0000-0000-0000-000000000000', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400'),
('Coca Cola', 'Refreshing cold Coca Cola', 2.50, 'beverage', '00000000-0000-0000-0000-000000000000', 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400'),
('Chicken Wings', 'Spicy buffalo chicken wings with blue cheese dip', 9.99, 'appetizer', '00000000-0000-0000-0000-000000000000', 'https://images.unsplash.com/photo-1567620832904-9d64b45c5a97?w=400'),
('Ice Cream Sundae', 'Vanilla ice cream with chocolate sauce and sprinkles', 4.99, 'dessert', '00000000-0000-0000-0000-000000000000', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400'),
('Coffee', 'Hot brewed coffee', 2.99, 'beverage', '00000000-0000-0000-0000-000000000000', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400'),
('Nachos', 'Crispy nachos with cheese and jalapeños', 7.99, 'snack', '00000000-0000-0000-0000-000000000000', 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400')
ON CONFLICT DO NOTHING; 