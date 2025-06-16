-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create enum types
CREATE TYPE media_type AS ENUM ('image', 'video');
CREATE TYPE entry_status AS ENUM ('draft', 'published', 'archived');

-- Create locations table
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city VARCHAR(100) NOT NULL,
    ward VARCHAR(100),
    custom_location TEXT,
    coordinates POINT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create entries table
CREATE TABLE entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    research_notes TEXT,
    location_id UUID REFERENCES locations(id),
    status entry_status DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    CONSTRAINT title_length CHECK (char_length(title) >= 3)
);

-- Create tags table
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    is_preset BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create entry_tags junction table
CREATE TABLE entry_tags (
    entry_id UUID REFERENCES entries(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (entry_id, tag_id)
);

-- Create media table
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entry_id UUID REFERENCES entries(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    media_type media_type NOT NULL,
    is_preview BOOLEAN DEFAULT false,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    width INTEGER,
    height INTEGER,
    duration INTEGER, -- for videos, in seconds
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_entries_location ON entries(location_id);
CREATE INDEX idx_entries_created_by ON entries(created_by);
CREATE INDEX idx_entries_status ON entries(status);
CREATE INDEX idx_media_entry ON media(entry_id);
CREATE INDEX idx_entry_tags_entry ON entry_tags(entry_id);
CREATE INDEX idx_entry_tags_tag ON entry_tags(tag_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_entries_updated_at
    BEFORE UPDATE ON entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_updated_at
    BEFORE UPDATE ON media
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert preset tags
INSERT INTO tags (name, is_preset) VALUES
    ('🚆 Transit', true),
    ('🏙️ Infrastructure', true),
    ('🛍️ Retail', true),
    ('🍜 Food', true),
    ('🏠 Housing', true),
    ('👥 Crowds', true),
    ('💴 Prices', true),
    ('🏢 Business', true),
    ('🧼 Cleanliness', true),
    ('📶 Connectivity', true),
    ('🤖 Robots', true),
    ('🔧 Labor Intensity', true),
    ('🛑 Rules', true),
    ('🎓 Education', true),
    ('📦 Logistics', true),
    ('🧃 Vending Machine', true),
    ('🚇 Train Check', true),
    ('🎌 Peak Japan', true),
    ('🦑 Mystery Snack', true),
    ('🎮 Arcade', true),
    ('🦀 7/11 Core', true),
    ('👟 Weird Drip', true),
    ('📸 Tourists', true),
    ('🛐 Shrine', true),
    ('🐸 Capsule Haul', true),
    ('🎴 Anime IRL', true),
    ('📦 Tiny Apartment', true),
    ('🧍 Salaryman Sighting', true),
    ('💤 Public Sleeping', true);

-- Create RLS policies
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry_tags ENABLE ROW LEVEL SECURITY;

-- Entries policies
CREATE POLICY "Entries are viewable by everyone"
    ON entries FOR SELECT
    USING (status = 'published');

CREATE POLICY "Users can create entries"
    ON entries FOR INSERT
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own entries"
    ON entries FOR UPDATE
    USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own entries"
    ON entries FOR DELETE
    USING (auth.uid() = created_by);

-- Media policies
CREATE POLICY "Media is viewable by everyone"
    ON media FOR SELECT
    USING (true);

CREATE POLICY "Users can create media for their entries"
    ON media FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM entries
            WHERE id = media.entry_id
            AND created_by = auth.uid()
        )
    );

CREATE POLICY "Users can update media for their entries"
    ON media FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM entries
            WHERE id = media.entry_id
            AND created_by = auth.uid()
        )
    );

CREATE POLICY "Users can delete media for their entries"
    ON media FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM entries
            WHERE id = media.entry_id
            AND created_by = auth.uid()
        )
    );

-- Tags policies
CREATE POLICY "Tags are viewable by everyone"
    ON tags FOR SELECT
    USING (true);

CREATE POLICY "Only admins can create tags"
    ON tags FOR INSERT
    WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE is_admin = true));

-- Entry tags policies
CREATE POLICY "Entry tags are viewable by everyone"
    ON entry_tags FOR SELECT
    USING (true);

CREATE POLICY "Users can manage tags for their entries"
    ON entry_tags FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM entries
            WHERE id = entry_tags.entry_id
            AND created_by = auth.uid()
        )
    ); 