-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    nickname TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    level INTEGER DEFAULT 1,
    points INTEGER DEFAULT 0,
    city TEXT,
    region TEXT,
    country TEXT DEFAULT 'Slovakia',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create groups table for multi-level gaming
CREATE TABLE IF NOT EXISTS public.groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    max_members INTEGER DEFAULT 8,
    current_members INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    points INTEGER DEFAULT 0,
    city TEXT,
    region TEXT,
    country TEXT DEFAULT 'Slovakia',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create group_members table
CREATE TABLE IF NOT EXISTS public.group_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin', 'owner')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- Create interactions table for tracking game activities
CREATE TABLE IF NOT EXISTS public.interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL,
    points_earned INTEGER DEFAULT 0,
    level_type TEXT CHECK (level_type IN ('individual', 'group', 'city', 'region', 'country', 'global')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create levels table for tracking progression thresholds
CREATE TABLE IF NOT EXISTS public.levels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    level_number INTEGER NOT NULL,
    level_type TEXT NOT NULL CHECK (level_type IN ('individual', 'group', 'city', 'region', 'country', 'global')),
    points_required INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    rewards JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(level_number, level_type)
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for groups table
CREATE POLICY "Anyone can view groups" ON public.groups
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create groups" ON public.groups
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Group owners can update groups" ON public.groups
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.group_members 
            WHERE group_id = id AND user_id = auth.uid() AND role = 'owner'
        )
    );

-- Create policies for group_members table
CREATE POLICY "Anyone can view group members" ON public.group_members
    FOR SELECT USING (true);

CREATE POLICY "Users can join groups" ON public.group_members
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups or owners can remove members" ON public.group_members
    FOR DELETE USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM public.group_members gm 
            WHERE gm.group_id = group_id AND gm.user_id = auth.uid() AND gm.role IN ('owner', 'admin')
        )
    );

-- Create policies for interactions table
CREATE POLICY "Users can view their own interactions" ON public.interactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own interactions" ON public.interactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for levels table
CREATE POLICY "Anyone can view levels" ON public.levels
    FOR SELECT USING (true);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON public.groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default levels
INSERT INTO public.levels (level_number, level_type, points_required, title, description) VALUES
-- Individual levels
(1, 'individual', 0, 'Začiatočník', 'Vitaj v hre na radosť zo života!'),
(2, 'individual', 50, 'Hráč', 'Získal si prvé skúsenosti'),
(3, 'individual', 150, 'Skúsený hráč', 'Už sa orientuješ v hre'),
(4, 'individual', 300, 'Expert', 'Ovládaš základy hry'),
(5, 'individual', 500, 'Majster', 'Si skutočný majster hry!'),

-- Group levels
(1, 'group', 0, 'Nová skupina', 'Skupina sa práve vytvorila'),
(2, 'group', 100, 'Aktívna skupina', 'Skupina je aktívna'),
(3, 'group', 300, 'Skúsená skupina', 'Skupina má skúsenosti'),
(4, 'group', 600, 'Expertná skupina', 'Skupina je expertná'),
(5, 'group', 1000, 'Majstrovská skupina', 'Skupina je na najvyššej úrovni!'),

-- City levels
(1, 'city', 0, 'Nové mesto', 'Mesto sa zapojilo do hry'),
(2, 'city', 500, 'Aktívne mesto', 'Mesto je aktívne v hre'),
(3, 'city', 1500, 'Skúsené mesto', 'Mesto má skúsenosti'),
(4, 'city', 3000, 'Expertné mesto', 'Mesto je expertné'),
(5, 'city', 5000, 'Majstrovské mesto', 'Mesto je na najvyššej úrovni!'),

-- Region levels
(1, 'region', 0, 'Nový kraj', 'Kraj sa zapojil do hry'),
(2, 'region', 2000, 'Aktívny kraj', 'Kraj je aktívny v hre'),
(3, 'region', 6000, 'Skúsený kraj', 'Kraj má skúsenosti'),
(4, 'region', 12000, 'Expertný kraj', 'Kraj je expertný'),
(5, 'region', 20000, 'Majstrovský kraj', 'Kraj je na najvyššej úrovni!'),

-- Country levels
(1, 'country', 0, 'Nová krajina', 'Krajina sa zapojila do hry'),
(2, 'country', 10000, 'Aktívna krajina', 'Krajina je aktívna v hre'),
(3, 'country', 30000, 'Skúsená krajina', 'Krajina má skúsenosti'),
(4, 'country', 60000, 'Expertná krajina', 'Krajina je expertná'),
(5, 'country', 100000, 'Majstrovská krajina', 'Krajina je na najvyššej úrovni!'),

-- Global levels
(1, 'global', 0, 'Globálny začiatok', 'Globálna hra sa začala'),
(2, 'global', 50000, 'Globálna aktivita', 'Globálna hra je aktívna'),
(3, 'global', 150000, 'Globálne skúsenosti', 'Globálna hra má skúsenosti'),
(4, 'global', 300000, 'Globálna expertíza', 'Globálna hra je expertná'),
(5, 'global', 500000, 'Globálne majstrovstvo', 'Globálna hra je na najvyššej úrovni!');

-- Create function to handle user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, nickname)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'nickname', split_part(NEW.email, '@', 1)));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
