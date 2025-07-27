# 🍽️ Canteen Management Guide

## Overview
Canteen vendors can manage their menu items through the **Canteen Management** page. This allows you to add, edit, remove, and control the availability of food items.

## 🚀 How to Access

1. **Login** as a canteen vendor
2. **Navigate** to the sidebar menu
3. **Click** on "Canteen Management" (Settings icon)
4. **Start managing** your menu items!

## 📋 Available Features

### ✅ **Add New Items**
- Click the **"Add New Item"** button
- Fill in the required information:
  - **Item Name** (required)
  - **Description** (required)
  - **Price** (required) - in dollars
  - **Category** (required) - Main Course, Appetizer, Dessert, Beverage, or Snack
  - **Item Image** (optional) - upload from device or paste URL
  - **Availability** - toggle to make item available/unavailable
- Click **"Add Item"** to save

### 📸 **Image Upload Options**
- **Upload from Device**: Click the upload area or drag & drop image files
- **Supported Formats**: PNG, JPG, GIF, WebP
- **File Size Limit**: Maximum 5MB per image
- **Image URL**: Paste a direct link to an image online
- **Change Image**: Click "Change Image" to replace existing images
- **Remove Image**: Click "Remove" to delete the current image

### ✏️ **Edit Existing Items**
- Find the item you want to edit
- Click the **Edit button** (pencil icon)
- Modify any fields as needed
- Click **"Update Item"** to save changes

### 🗑️ **Delete Items**
- Find the item you want to remove
- Click the **Delete button** (trash icon)
- Confirm the deletion when prompted

### 🔄 **Toggle Availability**
- Use the **toggle switch** on each item card
- **Green** = Available for ordering
- **Gray** = Unavailable (hidden from students)

## 📊 Item Categories

- **🍽️ Main Course** - Full meals, entrees
- **🥗 Appetizer** - Starters, small plates
- **🍰 Dessert** - Sweet treats, cakes, ice cream
- **🥤 Beverage** - Drinks, juices, coffee
- **🍿 Snack** - Quick bites, chips, etc.

## 🔒 Security Features

- **Vendor Isolation** - You can only see and manage your own items
- **Real-time Updates** - Changes appear immediately
- **Confirmation Dialogs** - Prevents accidental deletions
- **Role-based Access** - Only canteen vendors can access this page

## 💡 Best Practices

### **Item Management**
- ✅ Keep descriptions clear and appetizing
- ✅ Use high-quality image URLs
- ✅ Set appropriate prices
- ✅ Categorize items correctly
- ✅ Update availability based on stock

### **Menu Optimization**
- ✅ Remove seasonal items when not available
- ✅ Update prices when costs change
- ✅ Add new items regularly
- ✅ Monitor popular items

### **Student Experience**
- ✅ Keep popular items available
- ✅ Provide clear descriptions
- ✅ Use appealing images
- ✅ Maintain reasonable prices

## 🛠️ Technical Details

### **Database Table**: `canteen_items`
- `id` - Unique identifier
- `name` - Item name
- `description` - Item description
- `price` - Price in dollars
- `category` - Item category
- `is_available` - Availability status
- `vendor_id` - Your vendor ID (auto-assigned)
- `image_url` - Optional image link
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### **RLS Policies**
- Vendors can only manage their own items
- Students can only view available items
- Super admins can manage all items

## 🆘 Troubleshooting

### **Can't see the Canteen Management page?**
- Ensure you're logged in as a canteen vendor
- Check that your role is set to `canteen_vendor`
- Contact admin if role is incorrect

### **Can't add/edit items?**
- Check your internet connection
- Ensure all required fields are filled
- Try refreshing the page
- Contact support if issues persist

### **Items not showing to students?**
- Check if the item is marked as "Available"
- Verify the item is in the correct category
- Ensure the item was saved successfully

## 📞 Support

If you encounter any issues:
1. Check this guide first
2. Try refreshing the page
3. Contact the system administrator
4. Provide specific error messages if available

---

**Happy managing your canteen menu! 🍕🍔🍟** 