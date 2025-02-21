-- Create notification_type enum
--color scheme: success: green, warning: yellow, fail: red, notification: blue
CREATE TYPE notification_type AS ENUM ('success', 'warning', 'fail', 'notification');
-- First drop the existing table
DROP TABLE IF EXISTS notifications;

-- Recreate notifications table with modified constraints
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT false,
    is_global BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    -- Add constraint to ensure receiver_id is NOT NULL when is_global is false
    CONSTRAINT check_receiver_id CHECK (
        (is_global = true) OR 
        (is_global = false AND receiver_id IS NOT NULL)
    )
);

-- Recreate indexes
CREATE INDEX idx_notifications_receiver_id ON notifications(receiver_id);
CREATE INDEX idx_notifications_sender_id ON notifications(sender_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_is_global ON notifications(is_global);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at 
    BEFORE UPDATE ON notifications 
    FOR EACH ROW 
    EXECUTE FUNCTION fn_set_updated_at();

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies with updated logic
CREATE POLICY "Users can read their notifications or global notifications" 
    ON notifications 
    FOR SELECT 
    TO authenticated 
    USING (
        (is_global = true) OR 
        (auth.uid() = receiver_id)
    );

CREATE POLICY "Users can create notifications" 
    ON notifications 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (
        auth.uid() = sender_id AND (
            (NOT is_global AND receiver_id IS NOT NULL) OR
            (is_global AND check_permission('send_global_notifications'))
        )
    );

CREATE POLICY "Users can update their received notifications" 
    ON notifications 
    FOR UPDATE 
    TO authenticated 
    USING (
        auth.uid() = receiver_id AND 
        NOT is_global
    );

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;