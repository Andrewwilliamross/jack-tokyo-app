# Supabase Configuration

This directory contains all Supabase-related configurations, migrations, and utilities for the Jack Meicho application.

## Directory Structure

```
supabase/
├── migrations/     # SQL migration files
├── types/         # TypeScript type definitions
├── config/        # Configuration files
└── utils/         # Utility functions
```

## Database Schema

### Tables

1. **entries**
   - Main content table for user entries
   - Contains title, description, location, and metadata

2. **media**
   - Stores references to uploaded media files
   - Links to Supabase Storage
   - Supports both images and videos

3. **tags**
   - Manages content tags
   - Includes preset and custom tags

4. **locations**
   - Stores location data
   - Includes city, ward, and custom locations

### Storage Buckets

1. **media**
   - Stores all uploaded media files
   - Organized by entry ID
   - Supports image and video formats

## Security Policies

- Public read access for media
- Authenticated write access
- Rate limiting for uploads
- File size and type restrictions

## Usage

1. **Migrations**
   - Run migrations in order using the Supabase CLI
   - Each migration is timestamped and versioned

2. **Types**
   - Generated TypeScript types for database tables
   - Used throughout the application for type safety

3. **Configuration**
   - Environment variables and connection settings
   - Storage bucket configurations
   - Security policy definitions

## Development

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link to your Supabase project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. Run migrations:
   ```bash
   supabase db push
   ```

## Best Practices

1. Always create new migrations for schema changes
2. Test migrations locally before deploying
3. Keep types up to date with schema changes
4. Document all security policies
5. Use environment variables for sensitive data 