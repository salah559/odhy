-- جدول الأغنام (sheep)
CREATE TABLE IF NOT EXISTS sheep (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL CHECK (category IN ('محلي', 'روماني', 'إسباني')),
  price DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(5, 2) DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  age INTEGER NOT NULL,
  weight VARCHAR(50) NOT NULL,
  breed VARCHAR(100) NOT NULL,
  health_status TEXT,
  description TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول الطلبات (orders)
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  state VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  products JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول المسؤولين (admins)
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  firebase_uid VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'secondary' CHECK (role IN ('primary', 'secondary')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_sheep_category ON sheep(category);
CREATE INDEX IF NOT EXISTS idx_sheep_featured ON sheep(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_admins_firebase_uid ON admins(firebase_uid);

-- إضافة بيانات تجريبية للأغنام
INSERT INTO sheep (name, category, price, discount, weight, age, breed, health_status, description, is_featured) VALUES
('خروف بربري ممتاز', 'محلي', 1200.00, 0, '40-45 كجم', 2, 'بربري', 'ممتاز', 'خروف بربري عالي الجودة مناسب للأضحية', true),
('خروف سردي', 'محلي', 1500.00, 0, '45-50 كجم', 2, 'سردي', 'ممتاز', 'خروف سردي ممتاز للأضحية', true),
('خروف نجدي', 'محلي', 1800.00, 0, '50-55 كجم', 3, 'نجدي', 'ممتاز', 'خروف نجدي فاخر بجودة عالية', true),
('خروف روماني', 'روماني', 2000.00, 10, '55-60 كجم', 2, 'روماني', 'ممتاز', 'خروف روماني مستورد عالي الجودة', false),
('خروف إسباني', 'إسباني', 2500.00, 15, '60-65 كجم', 3, 'إسباني', 'ممتاز', 'خروف إسباني فاخر مستورد', true)
ON CONFLICT DO NOTHING;
