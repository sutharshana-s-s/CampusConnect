# 🚀 Production Deployment Guide

## Overview
This guide covers deploying the Canteen Management System to production with all placeholder data removed and security measures in place.

## 📋 Pre-Deployment Checklist

### ✅ Code Cleanup Completed
- [x] Removed all sample data functions
- [x] Removed debug console logs
- [x] Removed placeholder data from SQL files
- [x] Cleaned up UI components
- [x] Removed test buttons and sample data insertion

### ✅ Security Measures
- [x] RLS policies implemented
- [x] Role-based access control
- [x] Vendor data isolation
- [x] Input validation
- [x] Error handling

## 🗄️ Database Setup

### 1. Create Tables
Run the following SQL in your Supabase SQL Editor:

```sql
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

-- Create indexes for performance
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
```

### 2. Enable RLS and Create Policies
Run the RLS policies from `canteen_items_rls_policies.sql`:

```sql
-- Enable RLS
ALTER TABLE canteen_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Vendors can view their own items" ON canteen_items
  FOR SELECT USING (auth.uid() = vendor_id);

CREATE POLICY "Students can view available items" ON canteen_items
  FOR SELECT USING (is_available = true);

CREATE POLICY "Vendors can create their own items" ON canteen_items
  FOR INSERT WITH CHECK (auth.uid() = vendor_id);

CREATE POLICY "Vendors can update their own items" ON canteen_items
  FOR UPDATE USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can delete their own items" ON canteen_items
  FOR DELETE USING (auth.uid() = vendor_id);

CREATE POLICY "Super admins can manage all items" ON canteen_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'super_admin'
    )
  );
```

## 🌐 Environment Variables

### Required Environment Variables
Create a `.env` file in your project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Analytics (if using)
VITE_ANALYTICS_ID=your_analytics_id
```

### Supabase Configuration
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL and anon public key
4. Add them to your environment variables

## 🚀 Deployment Platforms

### Vercel Deployment
1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

2. **Environment Variables**
   - Add environment variables in Vercel dashboard
   - Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

3. **Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Netlify Deployment
1. **Connect Repository**
   - Connect your Git repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`

2. **Environment Variables**
   - Add environment variables in Netlify dashboard
   - Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Manual Deployment
1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Upload to Web Server**
   - Upload the `dist` folder to your web server
   - Configure environment variables on your server

## 🔧 Production Configuration

### Build Optimization
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build
npm run preview
```

### Performance Optimization
- Images are optimized with proper sizing
- Lazy loading implemented for item cards
- Efficient database queries with proper indexing
- Minimal bundle size with tree shaking

### Security Checklist
- [x] RLS policies enabled
- [x] Input validation on all forms
- [x] XSS protection with proper escaping
- [x] CSRF protection via Supabase
- [x] Role-based access control
- [x] Secure image URLs validation

## 📊 Monitoring & Analytics

### Error Tracking
Consider adding error tracking:
- Sentry for error monitoring
- LogRocket for session replay
- Google Analytics for user behavior

### Performance Monitoring
- Core Web Vitals tracking
- Database query performance
- Image loading optimization

## 🔄 Post-Deployment

### Testing Checklist
- [ ] User registration and login
- [ ] Canteen vendor role assignment
- [ ] Menu item creation, editing, deletion
- [ ] Availability toggle functionality
- [ ] Image upload and display
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

### User Management
- [ ] Create admin accounts
- [ ] Assign vendor roles to users
- [ ] Set up user permissions
- [ ] Configure email notifications

### Data Migration (if needed)
If migrating from existing system:
1. Export existing data
2. Transform data to match new schema
3. Import using Supabase dashboard
4. Verify data integrity

## 🛠️ Maintenance

### Regular Tasks
- Monitor database performance
- Update dependencies regularly
- Backup database weekly
- Review error logs
- Update security policies

### Scaling Considerations
- Database connection pooling
- CDN for image delivery
- Caching strategies
- Load balancing for high traffic

## 📞 Support

### Documentation
- User guides for each role
- API documentation
- Troubleshooting guides
- FAQ section

### Contact Information
- Technical support email
- Bug reporting system
- Feature request tracking
- User feedback collection

---

## ✅ Deployment Complete!

Your Canteen Management System is now production-ready with:
- Clean, optimized code
- Secure database setup
- Proper environment configuration
- Monitoring and maintenance plans

The system is ready for real users to manage their canteen menus efficiently! 🍕🍔🍟 