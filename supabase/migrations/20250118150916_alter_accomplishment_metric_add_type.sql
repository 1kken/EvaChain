-- Create input type enum
CREATE TYPE input_type AS ENUM ('percentage', 'number', 'ratio', 'text');

-- Add input_type column to accomplishment_metrics
ALTER TABLE accomplishment_metrics
ADD COLUMN input_type input_type NOT NULL DEFAULT 'text';