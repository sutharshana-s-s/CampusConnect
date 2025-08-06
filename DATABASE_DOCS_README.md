# Database Documentation System

This system helps you maintain complete documentation of your Campus Connect database schema and data.

## Files Created

1. **`database_documentation.sql`** - Complete SQL script that captures all database information
2. **`generate_db_docs.sh`** - Shell script to run the documentation and save to files
3. **`DATABASE_DOCS_README.md`** - This file explaining how to use the system

## How to Use

### Option 1: Run the SQL script directly in Supabase

1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `database_documentation.sql`
4. Run the script
5. Copy the results and save them to a file

### Option 2: Use the shell script (if you have local PostgreSQL access)

1. Update the database connection in `generate_db_docs.sh`:
   ```bash
   DB_URL="postgresql://username:password@host:port/database"
   ```

2. Make the script executable:
   ```bash
   chmod +x generate_db_docs.sh
   ```

3. Run the script:
   ```bash
   ./generate_db_docs.sh
   ```

4. Check the `database_docs/` folder for the generated files

## What the Documentation Includes

### 1. Schema Information
- All table structures
- Column details (data types, constraints, defaults)
- Foreign key relationships

### 2. Data Statistics
- Record counts for all tables
- User role distribution
- Order status distribution
- Vendor statistics

### 3. Data Integrity Checks
- Orphaned records
- Invalid references
- Missing relationships

### 4. Sample Data
- Recent profiles, items, and orders
- Data patterns and examples

### 5. Recent Activity
- Last 7 days of activity
- Growth trends

## When to Update

Update the documentation whenever you:

1. **Add new tables** or modify existing table structures
2. **Change foreign key relationships**
3. **Add new columns** or modify data types
4. **Deploy to production** with schema changes
5. **Need to track data growth** over time

## File Naming Convention

The system creates timestamped files:
- `database_documentation_YYYYMMDD_HHMMSS.txt` - Complete documentation
- `database_summary_YYYYMMDD_HHMMSS.md` - Summary and instructions

## Quick Commands

### Generate documentation:
```bash
./generate_db_docs.sh
```

### View latest documentation:
```bash
ls -la database_docs/
cat database_docs/database_documentation_*.txt | tail -n 50
```

### Compare with previous version:
```bash
diff database_docs/database_documentation_OLD.txt database_docs/database_documentation_NEW.txt
```

## Troubleshooting

### If the shell script doesn't work:
1. Check your database connection string
2. Ensure you have PostgreSQL client tools installed
3. Try running the SQL script directly in Supabase instead

### If you get permission errors:
1. Make sure the script is executable: `chmod +x generate_db_docs.sh`
2. Check that the output directory is writable

### If the SQL script has errors:
1. Some queries might not work in Supabase's SQL editor
2. Run the queries in sections to identify which ones fail
3. Modify the script to exclude problematic queries

## Benefits

1. **Complete Reference** - Always know your database structure
2. **Change Tracking** - Compare versions to see what changed
3. **Debugging** - Quickly identify data integrity issues
4. **Development** - Use as reference when building features
5. **Documentation** - Keep stakeholders informed about data structure

## Example Output Structure

```
=====================================================
CAMPUS CONNECT DATABASE DOCUMENTATION
=====================================================

1. DATABASE SCHEMA INFORMATION
   - Table list
   - Column details
   - Foreign keys

2. DATA COUNTS AND STATISTICS
   - Record counts
   - User distribution
   - Order statistics

3. SAMPLE DATA
   - Recent profiles
   - Recent orders
   - Recent items

4. DATA INTEGRITY CHECKS
   - Orphaned records: 0
   - Invalid references: 0

5. RECENT ACTIVITY
   - Recent orders: 3
   - Recent items: 2
   - Recent users: 6
```

This system will help you maintain a complete understanding of your database structure and data, making development and debugging much easier! 