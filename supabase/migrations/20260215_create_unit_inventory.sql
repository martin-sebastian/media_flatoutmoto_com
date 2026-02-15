-- Unit inventory table for FOM PRINT / next-gen (no next_ prefix).
-- Run this in your new Supabase project, or in current project to create a copy.
-- Same schema as next_universal_unit_inventory.

CREATE TABLE IF NOT EXISTS unit_inventory (
  id text PRIMARY KEY,
  title text,
  link text,
  description text,
  price numeric,
  price_type text,
  stocknumber text,
  vin text,
  manufacturer text,
  year integer,
  color text,
  model_type text,
  model_typestyle text,
  model_name text,
  trim_name text,
  trim_color text,
  "condition" text,
  usage text,
  location text,
  updated timestamptz,
  metric_type text,
  metric_value numeric,
  images jsonb,
  attributes jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS: anon read for FOM PRINT; anon write for sync (protect sync endpoint with cron secret)
ALTER TABLE unit_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon read unit_inventory"
  ON unit_inventory FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anon write unit_inventory"
  ON unit_inventory FOR ALL TO anon USING (true) WITH CHECK (true);
