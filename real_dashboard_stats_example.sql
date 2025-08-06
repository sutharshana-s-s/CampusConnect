-- Example: How to implement real change calculations for dashboard stats
-- This would require adding historical data tracking to your tables

-- 1. Example: Add created_at timestamps to track when records were created
-- (Most tables already have this)

-- 2. Example: Calculate real changes by comparing current month vs previous month
-- For Students count:
SELECT 
  COUNT(*) as current_month_students,
  LAG(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', created_at)) as previous_month_students
FROM profiles 
WHERE role = 'student' 
  AND created_at >= DATE_TRUNC('month', NOW()) - INTERVAL '2 months'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY DATE_TRUNC('month', created_at) DESC
LIMIT 2;

-- 3. Example: Calculate percentage change
WITH monthly_counts AS (
  SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as student_count
  FROM profiles 
  WHERE role = 'student'
  GROUP BY DATE_TRUNC('month', created_at)
),
current_prev AS (
  SELECT 
    student_count as current_count,
    LAG(student_count) OVER (ORDER BY month) as previous_count
  FROM monthly_counts
  ORDER BY month DESC
  LIMIT 1
)
SELECT 
  current_count,
  previous_count,
  CASE 
    WHEN previous_count = 0 THEN NULL
    ELSE ROUND(((current_count - previous_count)::decimal / previous_count * 100), 1)
  END as percentage_change
FROM current_prev;

-- 4. Example: For canteen orders (if you want to track monthly totals)
-- You could create a monthly_stats table to store monthly totals:
/*
CREATE TABLE monthly_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  month DATE NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(month, metric_name)
);

-- Then insert monthly totals:
INSERT INTO monthly_stats (month, metric_name, metric_value)
SELECT 
  DATE_TRUNC('month', created_at)::date,
  'canteen_orders',
  COUNT(*)
FROM canteen_orders
WHERE created_at >= DATE_TRUNC('month', NOW()) - INTERVAL '1 month'
GROUP BY DATE_TRUNC('month', created_at)
ON CONFLICT (month, metric_name) DO UPDATE SET
  metric_value = EXCLUDED.metric_value;
*/ 