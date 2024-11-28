# .branches/_current_branch

```
main
```

# .gitignore

```
# Supabase
.branches
.temp
.env

```

# .temp/cli-latest

```
v1.223.10
```

# .temp/gotrue-version

```
v2.163.2
```

# .temp/pooler-url

```
postgresql://postgres.xixattpbfetzpwecbkde:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

# .temp/postgres-version

```
15.6.1.135
```

# .temp/project-ref

```
xixattpbfetzpwecbkde
```

# .temp/rest-version

```
v12.2.3
```

# .temp/storage-version

```
v1.13.0
```

# config.toml

```toml
# A string used to distinguish different Supabase projects on the same host. Defaults to the
# working directory name when running `supabase init`.
project_id = "EvaChain"

[api]
enabled = true
# Port to use for the API URL.
port = 54321
# Schemas to expose in your API. Tables, views and stored procedures in this schema will get API
# endpoints. `public` is always included.
schemas = ["public", "graphql_public"]
# Extra schemas to add to the search_path of every request. `public` is always included.
extra_search_path = ["public", "extensions"]
# The maximum number of rows returns from a view, table, or stored procedure. Limits payload size
# for accidental or malicious requests.
max_rows = 1000

[api.tls]
enabled = false

[db]
# Port to use for the local database URL.
port = 54322
# Port used by db diff command to initialize the shadow database.
shadow_port = 54320
# The database major version to use. This has to be the same as your remote database's. Run `SHOW
# server_version;` on the remote database to check.
major_version = 15

[db.pooler]
enabled = false
# Port to use for the local connection pooler.
port = 54329
# Specifies when a server connection can be reused by other clients.
# Configure one of the supported pooler modes: `transaction`, `session`.
pool_mode = "transaction"
# How many server connections to allow per user/database pair.
default_pool_size = 20
# Maximum number of client connections allowed.
max_client_conn = 100

[db.seed]
# If enabled, seeds the database after migrations during a db reset.
enabled = true
# Specifies an ordered list of seed files to load during db reset.
# Supports glob patterns relative to supabase directory. For example:
# sql_paths = ['./seeds/*.sql', '../project-src/seeds/*-load-testing.sql']
sql_paths = ['./seed.sql']

[realtime]
enabled = true
# Bind realtime via either IPv4 or IPv6. (default: IPv4)
# ip_version = "IPv6"
# The maximum length in bytes of HTTP request headers. (default: 4096)
# max_header_length = 4096

[studio]
enabled = true
# Port to use for Supabase Studio.
port = 54323
# External URL of the API server that frontend connects to.
api_url = "http://127.0.0.1"
# OpenAI API Key to use for Supabase AI in the Supabase Studio.
openai_api_key = "env(OPENAI_API_KEY)"

# Email testing server. Emails sent with the local dev setup are not actually sent - rather, they
# are monitored, and you can view the emails that would have been sent from the web interface.
[inbucket]
enabled = true
# Port to use for the email testing server web interface.
port = 54324
# Uncomment to expose additional ports for testing user applications that send emails.
# smtp_port = 54325
# pop3_port = 54326

[storage]
enabled = true
# The maximum file size allowed (e.g. "5MB", "500KB").
file_size_limit = "50MiB"

[storage.image_transformation]
enabled = true

# Uncomment to configure local storage buckets
# [storage.buckets.images]
# public = false
# file_size_limit = "50MiB"
# allowed_mime_types = ["image/png", "image/jpeg"]
# objects_path = "./images"

[auth]
enabled = true
# The base URL of your website. Used as an allow-list for redirects and for constructing URLs used
# in emails.
site_url = "http://127.0.0.1:5173"
# A list of *exact* URLs that auth providers are permitted to redirect to post authentication.
additional_redirect_urls = ["https://127.0.0.1:5173"]
# How long tokens are valid for, in seconds. Defaults to 3600 (1 hour), maximum 604,800 (1 week).
jwt_expiry = 3600
# If disabled, the refresh token will never expire.
enable_refresh_token_rotation = true
# Allows refresh tokens to be reused after expiry, up to the specified interval in seconds.
# Requires enable_refresh_token_rotation = true.
refresh_token_reuse_interval = 10
# Allow/disallow new user signups to your project.
enable_signup = true
# Allow/disallow anonymous sign-ins to your project.
enable_anonymous_sign_ins = false
# Allow/disallow testing manual linking of accounts
enable_manual_linking = false

[auth.email]
# Allow/disallow new user signups via email to your project.
enable_signup = true
# If enabled, a user will be required to confirm any email change on both the old, and new email
# addresses. If disabled, only the new email is required to confirm.
double_confirm_changes = false
# If enabled, users need to confirm their email address before signing in.
enable_confirmations = false
# If enabled, users will need to reauthenticate or have logged in recently to change their password.
secure_password_change = false
# Controls the minimum amount of time that must pass before sending another signup confirmation or password reset email.
max_frequency = "1s"
# Number of characters used in the email OTP.
otp_length = 6
# Number of seconds before the email OTP expires (defaults to 1 hour).
otp_expiry = 3600

# Use a production-ready SMTP server
# [auth.email.smtp]
# host = "smtp.sendgrid.net"
# port = 587
# user = "apikey"
# pass = "env(SENDGRID_API_KEY)"
# admin_email = "admin@email.com"
# sender_name = "Admin"

# Uncomment to customize email template
# [auth.email.template.invite]
# subject = "You have been invited"
# content_path = "./supabase/templates/invite.html"

[auth.sms]
# Allow/disallow new user signups via SMS to your project.
enable_signup = false
# If enabled, users need to confirm their phone number before signing in.
enable_confirmations = false
# Template for sending OTP to users
template = "Your code is {{ .Code }} ."
# Controls the minimum amount of time that must pass before sending another sms otp.
max_frequency = "5s"

# Use pre-defined map of phone number to OTP for testing.
# [auth.sms.test_otp]
# 4152127777 = "123456"

# Configure logged in session timeouts.
# [auth.sessions]
# Force log out after the specified duration.
# timebox = "24h"
# Force log out if the user has been inactive longer than the specified duration.
# inactivity_timeout = "8h"

# This hook runs before a token is issued and allows you to add additional claims based on the authentication method used.
# [auth.hook.custom_access_token]
# enabled = true
# uri = "pg-functions://<database>/<schema>/<hook_name>"

# Configure one of the supported SMS providers: `twilio`, `twilio_verify`, `messagebird`, `textlocal`, `vonage`.
[auth.sms.twilio]
enabled = false
account_sid = ""
message_service_sid = ""
# DO NOT commit your Twilio auth token to git. Use environment variable substitution instead:
auth_token = "env(SUPABASE_AUTH_SMS_TWILIO_AUTH_TOKEN)"

[auth.mfa]
# Control how many MFA factors can be enrolled at once per user.
max_enrolled_factors = 10

# Control use of MFA via App Authenticator (TOTP)
[auth.mfa.totp]
enroll_enabled = true
verify_enabled = true

# Configure Multi-factor-authentication via Phone Messaging
# [auth.mfa.phone]
# enroll_enabled = true
# verify_enabled = true
# otp_length = 6
# template = "Your code is {{ .Code }} ."
# max_frequency = "10s"

# Configure Multi-factor-authentication via WebAuthn
# [auth.mfa.web_authn]
# enroll_enabled = true
# verify_enabled = true

# Use an external OAuth provider. The full list of providers are: `apple`, `azure`, `bitbucket`,
# `discord`, `facebook`, `github`, `gitlab`, `google`, `keycloak`, `linkedin_oidc`, `notion`, `twitch`,
# `twitter`, `slack`, `spotify`, `workos`, `zoom`.
[auth.external.apple]
enabled = false
client_id = ""
# DO NOT commit your OAuth provider secret to git. Use environment variable substitution instead:
secret = "env(SUPABASE_AUTH_EXTERNAL_APPLE_SECRET)"
# Overrides the default auth redirectUrl.
redirect_uri = ""
# Overrides the default auth provider URL. Used to support self-hosted gitlab, single-tenant Azure,
# or any other third-party OIDC providers.
url = ""
# If enabled, the nonce check will be skipped. Required for local sign in with Google auth.
skip_nonce_check = false

[auth.external.google]
enabled = true
client_id = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_ID)"
secret = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET)"
redirect_uri = "http://localhost:54321/auth/v1/callback"
url = ''
skip_nonce_check = false


# Use Firebase Auth as a third-party provider alongside Supabase Auth.
[auth.third_party.firebase]
enabled = false
# project_id = "my-firebase-project"

# Use Auth0 as a third-party provider alongside Supabase Auth.
[auth.third_party.auth0]
enabled = false
# tenant = "my-auth0-tenant"
# tenant_region = "us"

# Use AWS Cognito (Amplify) as a third-party provider alongside Supabase Auth.
[auth.third_party.aws_cognito]
enabled = false
# user_pool_id = "my-user-pool-id"
# user_pool_region = "us-east-1"

[edge_runtime]
enabled = true
# Configure one of the supported request policies: `oneshot`, `per_worker`.
# Use `oneshot` for hot reload, or `per_worker` for load testing.
policy = "oneshot"
inspector_port = 8083

[analytics]
enabled = true
port = 54327
# Configure one of the supported backends: `postgres`, `bigquery`.
backend = "postgres"

# Experimental features may be deprecated any time
[experimental]
# Configures Postgres storage engine to use OrioleDB (S3)
orioledb_version = ""
# Configures S3 bucket URL, eg. <bucket_name>.s3-<region>.amazonaws.com
s3_host = "env(S3_HOST)"
# Configures S3 bucket region, eg. us-east-1
s3_region = "env(S3_REGION)"
# Configures AWS_ACCESS_KEY_ID for S3 bucket
s3_access_key = "env(S3_ACCESS_KEY)"
# Configures AWS_SECRET_ACCESS_KEY for S3 bucket
s3_secret_key = "env(S3_SECRET_KEY)"

```

# migrations/20241116152556_create_table_unit.sql

```sql
-- Create the function for updating timestamps
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the unit table
CREATE TABLE unit (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY NOT NULL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on commonly searched columns
CREATE INDEX idx_unit_code ON unit(code);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON unit
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();


```

# migrations/20241116153626_create_table_nature_of_work.sql

```sql
-- create table
CREATE TABLE nature_of_work (
   id INTEGER GENERATED BY DEFAULT AS IDENTITY NOT NULL PRIMARY KEY,
   type VARCHAR(100) NOT NULL UNIQUE,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON nature_of_work
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();

```

# migrations/20241116155829_create_table_office.sql

```sql
CREATE TABLE office (
   id INTEGER GENERATED BY DEFAULT AS IDENTITY NOT NULL PRIMARY KEY,
   unit_id INTEGER NOT NULL REFERENCES unit(id),
   code VARCHAR(50) NOT NULL UNIQUE,
   name VARCHAR(200) NOT NULL,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for foreign key
CREATE INDEX idx_office_unit_id ON office(unit_id);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON office
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();

```

# migrations/20241116160732_create_table_program.sql

```sql
CREATE TABLE program (
   id INTEGER GENERATED BY DEFAULT AS IDENTITY NOT NULL PRIMARY KEY,
   unit_id INTEGER NOT NULL REFERENCES unit(id),
   office_id INTEGER NOT NULL REFERENCES office(id),
   name TEXT NOT NULL,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for foreign keys
CREATE INDEX idx_program_unit_id ON program(unit_id);
CREATE INDEX idx_program_office_id ON program(office_id);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON program
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();

```

# migrations/20241116161506_create_table_position.sql

```sql
CREATE TABLE position (
   id INTEGER GENERATED BY DEFAULT AS IDENTITY NOT NULL PRIMARY KEY,
   nature_of_work_id INTEGER NOT NULL REFERENCES nature_of_work(id),
   name VARCHAR(100) NOT NULL UNIQUE,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for foreign key
CREATE INDEX idx_position_nature_of_work_id ON position(nature_of_work_id);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON position
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();

```

# migrations/20241116161733_create_table_employee_status.sql

```sql
-- create table
CREATE TABLE employee_status (
   id INTEGER GENERATED BY DEFAULT AS IDENTITY NOT NULL PRIMARY KEY,
   type VARCHAR(100) NOT NULL UNIQUE,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);


-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON employee_status
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();

```

# migrations/20241116162523_create_table_profile.sql

```sql
-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  employee_id varchar(50) unique,
  email varchar(255) unique,
  first_name text,
  middle_name text,
  last_name text,
  avatar_url text,
  unit_id integer references unit(id),
  nature_of_work_id integer references nature_of_work(id),
  office_id integer references office(id),
  program_id integer references program(id),
  position_id integer references position(id),
  employee_status_id integer references employee_status(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Set up Row Level Security (RLS)
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- Create function to handle new user signup with Google OAuth data
create function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    first_name,
    last_name,
    avatar_url
  )
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'first_name',
      new.raw_user_meta_data->>'given_name',
      split_part(new.raw_user_meta_data->>'full_name', ' ', 1),
      'Anonymous'
    ),
    coalesce(
      new.raw_user_meta_data->>'last_name',
      new.raw_user_meta_data->>'family_name',
      array_to_string(
        array_remove(
          string_to_array(new.raw_user_meta_data->>'full_name', ' '),
          split_part(new.raw_user_meta_data->>'full_name', ' ', 1)
        ),
        ' '
      ),
      'User'
    ),
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture',
      new.raw_user_meta_data->>'avatar',
      null
    )
  );
  return new;
exception
  when others then
    raise log 'Error in handle_new_user: %', SQLERRM;
    return new;  -- Still return the user even if profile creation fails
end;
$$;

-- Create trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();
```

# migrations/20241122141115_add_cascade_on_delete.sql

```sql
-- First, drop existing foreign key constraints
ALTER TABLE office DROP CONSTRAINT office_unit_id_fkey;

ALTER TABLE program DROP CONSTRAINT program_unit_id_fkey;
ALTER TABLE program DROP CONSTRAINT program_office_id_fkey;

ALTER TABLE position DROP CONSTRAINT position_nature_of_work_id_fkey;

-- Then add them back with ON DELETE CASCADE
ALTER TABLE office 
    ADD CONSTRAINT office_unit_id_fkey 
    FOREIGN KEY (unit_id) 
    REFERENCES unit(id) 
    ON DELETE CASCADE;

ALTER TABLE program 
    ADD CONSTRAINT program_unit_id_fkey 
    FOREIGN KEY (unit_id) 
    REFERENCES unit(id) 
    ON DELETE CASCADE;

ALTER TABLE program 
    ADD CONSTRAINT program_office_id_fkey 
    FOREIGN KEY (office_id) 
    REFERENCES office(id) 
    ON DELETE CASCADE;

ALTER TABLE position 
    ADD CONSTRAINT position_nature_of_work_id_fkey 
    FOREIGN KEY (nature_of_work_id) 
    REFERENCES nature_of_work(id) 
    ON DELETE CASCADE;
```

# migrations/20241122170218_add_realtime_tables.sql

```sql
alter publication supabase_realtime 
add table unit,
           nature_of_work,
           office,
           program, 
           position,
           employee_status,
           profiles;
```

# migrations/20241127102744_scope_type.sql

```sql
-- Create scope type
CREATE TYPE scope_type AS ENUM ('all', 'office','program', 'unit');
```

# migrations/20241127115411_create_roles_table.sql

```sql
-- Roles table
CREATE TABLE roles (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

# migrations/20241127120413_create_permissions_table.sql

```sql
-- Permissions table 
CREATE TABLE permissions (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

# migrations/20241127121741_create_role_permissions_table.sql

```sql
-- Role permissions mapping with scope
CREATE TABLE role_permissions (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    scope scope_type NOT NULL DEFAULT 'unit',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(role_id, permission_id)
);
```

# migrations/20241127121931_create_user_roles_table.sql

```sql
-- User roles mapping (one role per user)
CREATE TABLE user_roles (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);
```

# migrations/20241127123124_create_auth_jwt_function.sql

```sql
-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO postgres, authenticated, anon;
GRANT SELECT ON TABLE user_roles TO supabase_auth_admin;
GRANT SELECT ON TABLE roles TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION auth.jwt() TO postgres, authenticated, anon;

-- Create the JWT function
CREATE OR REPLACE FUNCTION auth.jwt()
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER 
SET search_path = auth, public
AS $$
DECLARE
    result jsonb;
BEGIN
    SELECT jsonb_build_object(
        'role', roles.name,
        'role_id', roles.id
    )
    INTO result
    FROM user_roles
    JOIN roles ON user_roles.role_id = roles.id
    WHERE user_roles.user_id = auth.uid();
    
    RETURN COALESCE(result, '{}'::jsonb);
END;
$$;
```

# migrations/20241127123317_create_permission_check_function.sql

```sql
CREATE OR REPLACE FUNCTION check_permission(
    required_permission VARCHAR,
    target_office_id INTEGER DEFAULT NULL,
    target_unit_id INTEGER DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    user_permission_scope scope_type;
    user_assigned_office_id INTEGER;
    user_assigned_unit_id INTEGER;
    permission_exists BOOLEAN;
BEGIN
    -- Get user's scope and IDs
    SELECT 
        role_permission.scope,
        profile.office_id,
        profile.unit_id,
        EXISTS (
            SELECT 1 
            FROM role_permissions role_permission_check
            JOIN permissions permission ON permission.id = role_permission_check.permission_id
            WHERE role_permission_check.role_id = (auth.jwt()->>'role_id')::integer 
            AND permission.name = required_permission
        )
    INTO 
        user_permission_scope,
        user_assigned_office_id,
        user_assigned_unit_id,
        permission_exists
    FROM profiles profile
    JOIN user_roles user_role ON profile.id = user_role.user_id
    JOIN role_permissions role_permission ON user_role.role_id = role_permission.role_id
    JOIN permissions permission ON role_permission.permission_id = permission.id
    WHERE profile.id = auth.uid()
    AND permission.name = required_permission;

    -- No permission found
    IF NOT permission_exists THEN
        RETURN FALSE;
    END IF;

    -- Check scope access
    RETURN CASE user_permission_scope
        WHEN 'all' THEN TRUE
        WHEN 'office' THEN 
            target_office_id IS NULL OR target_office_id = user_assigned_office_id
        WHEN 'unit' THEN 
            target_unit_id IS NULL OR target_unit_id = user_assigned_unit_id
        ELSE FALSE
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

# migrations/20241127123726_create_test_permission.sql

```sql
INSERT INTO roles (name) 
VALUES ('office_admin')
ON CONFLICT (name) DO NOTHING;  -- Handle if role already exists

-- Create permission
INSERT INTO permissions (name, description) 
VALUES ('view_office', 'Can view office details')
ON CONFLICT (name) DO NOTHING;  -- Handle if permission already exists

-- Create role-permission mapping
INSERT INTO role_permissions (role_id, permission_id, scope) 
VALUES (
    (SELECT id FROM roles WHERE name = 'office_admin'), 
    (SELECT id FROM permissions WHERE name = 'view_office'), 
    'office'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;  -- Handle if mapping already exists

-- Enable RLS
ALTER TABLE office ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can view office data based on their role scope"
ON office 
FOR SELECT
USING (check_permission('view_office', id, unit_id));
```

# migrations/20241127152010_create_user_role_view.sql

```sql
CREATE VIEW user_role_view AS
SELECT 
    user_roles.user_id,
    roles.name as role_name,
    roles.id as role_id
FROM user_roles
JOIN roles ON user_roles.role_id = roles.id;

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TABLE (
    role_name VARCHAR,
    role_id INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        roles.name,
        roles.id
    FROM user_roles
    JOIN roles ON user_roles.role_id = roles.id
    WHERE user_roles.user_id = auth.uid();
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_user_role() TO authenticated;
```

# seed.sql

```sql
-- 1. Unit Seeder
INSERT INTO public.unit (code, name) VALUES
    ('OUS', 'Office of the University Secretary'),
    ('SLUC', 'South La Union Campus'),
    ('MLUC', 'Middle La Union campus'),
    ('NLUC', 'North La Union Campus'),
    ('NARTDI', 'National Apiculture Reasearch Training and Development Institute')
ON CONFLICT (code) DO UPDATE 
    SET name = EXCLUDED.name,
        updated_at = timezone('utc'::text, now());

-- 2. Nature of Work Seeder
INSERT INTO public.nature_of_work (type) VALUES
    ('Teaching'),
    ('Non-Teaching')
ON CONFLICT (type) DO UPDATE 
    SET updated_at = timezone('utc'::text, now());

-- 3. Office Seeder (Using a subquery to get unit_ids)
INSERT INTO public.office (unit_id, code, name) VALUES
    -- NLUC offices
    ((SELECT id FROM public.unit WHERE code = 'NLUC'), 'CAS', 'College of Arts and Sciences'),
    ((SELECT id FROM public.unit WHERE code = 'NLUC'), 'CVM', 'College of Veterinary Medicine'),
    ((SELECT id FROM public.unit WHERE code = 'NLUC'), 'IES', 'Institute of Environmental Studies'),

    -- MLUC offices
    ((SELECT id FROM public.unit WHERE code = 'MLUC'), 'COE', 'College of Engineering'),
    ((SELECT id FROM public.unit WHERE code = 'MLUC'), 'CIT', 'College of Information Technology'),
    ((SELECT id FROM public.unit WHERE code = 'MLUC'), 'COL', 'College of Law'),

    -- SLUC offices
    ((SELECT id FROM public.unit WHERE code = 'SLUC'), 'CM', 'College of Medicine'),
    ((SELECT id FROM public.unit WHERE code = 'SLUC'), 'CCHAMS', 'College of Community Health & Allied Medical Sciences'),
    ((SELECT id FROM public.unit WHERE code = 'SLUC'), 'CCS', 'College of Computer Science')
ON CONFLICT (code) DO UPDATE 
    SET name = EXCLUDED.name,
        unit_id = EXCLUDED.unit_id,
        updated_at = timezone('utc'::text, now());

-- 4. Programme Seeder (Using subqueries to get unit_ids and office_ids)
INSERT INTO public.program (unit_id, office_id, name) VALUES
    -- SLUC Programmes
    ((SELECT id FROM public.unit WHERE code = 'SLUC'),
     (SELECT id FROM public.office WHERE code = 'CCS'),
     'Bachelor of Science in Computer Science'),
    
    ((SELECT id FROM public.unit WHERE code = 'SLUC'),
     (SELECT id FROM public.office WHERE code = 'CCHAMS'),
     'Bachelor of Science in Nursing'),
    
    ((SELECT id FROM public.unit WHERE code = 'SLUC'),
     (SELECT id FROM public.office WHERE code = 'CCHAMS'),
     'Bachelor of Science in Midwifery'),
    
    ((SELECT id FROM public.unit WHERE code = 'SLUC'),
     (SELECT id FROM public.office WHERE code = 'CM'),
     'Doctor of Medicine'),

    -- MLUC Programmes
    ((SELECT id FROM public.unit WHERE code = 'MLUC'),
     (SELECT id FROM public.office WHERE code = 'COL'),
     'Juris Doctor'),
    
    ((SELECT id FROM public.unit WHERE code = 'MLUC'),
     (SELECT id FROM public.office WHERE code = 'CIT'),
     'Master in Information Technology'),
    
    ((SELECT id FROM public.unit WHERE code = 'MLUC'),
     (SELECT id FROM public.office WHERE code = 'CIT'),
     'Bachelor of Science in Information Technology'),
    
    ((SELECT id FROM public.unit WHERE code = 'MLUC'),
     (SELECT id FROM public.office WHERE code = 'COE'),
     'Bachelor of Science in Electrical Engineering'),
    
    ((SELECT id FROM public.unit WHERE code = 'MLUC'),
     (SELECT id FROM public.office WHERE code = 'COE'),
     'Bachelor of Science in Mechanical Engineering'),

    -- NLUC Programmes
    ((SELECT id FROM public.unit WHERE code = 'NLUC'),
     (SELECT id FROM public.office WHERE code = 'IES'),
     'Bachelor of Science in Environmental Science'),
    
    ((SELECT id FROM public.unit WHERE code = 'NLUC'),
     (SELECT id FROM public.office WHERE code = 'CVM'),
     'Doctor of Veterinary Medicine'),
    
    ((SELECT id FROM public.unit WHERE code = 'NLUC'),
     (SELECT id FROM public.office WHERE code = 'CAS'),
     'Bachelor of Science in Biology'),
    
    ((SELECT id FROM public.unit WHERE code = 'NLUC'),
     (SELECT id FROM public.office WHERE code = 'CAS'),
     'Bachelor of Science in English Language')
ON CONFLICT DO NOTHING;

-- 5. Position Seeder (Using subquery to get nature_of_work_id)
INSERT INTO public.position (nature_of_work_id, name) VALUES
    -- Teaching Positions
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Instructor'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Assistant Professor'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Associate Professor'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Professor'),

    -- Non-Teaching Positions
    ((SELECT id FROM public.nature_of_work WHERE type = 'Non-Teaching'), 'Administrative Assistant'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Non-Teaching'), 'Records Officer'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Non-Teaching'), 'Library Assistant'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Non-Teaching'), 'Laboratory Technician')
ON CONFLICT (name) DO UPDATE 
    SET nature_of_work_id = EXCLUDED.nature_of_work_id,
        updated_at = timezone('utc'::text, now());

-- 6. Employee Status Seeder
INSERT INTO public.employee_status (type) VALUES
    ('Permanent'),
    ('Contractual'),
    ('Probationary'),
    ('Temporary'),
    ('Part-Time')
ON CONFLICT (type) DO UPDATE 
    SET updated_at = timezone('utc'::text, now());
```

