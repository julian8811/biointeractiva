-- BioInteractiva Database Schema
-- Ejecutar en Supabase SQL Editor

-- Tabla de perfiles de usuarios
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de progreso por módulo
CREATE TABLE module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,  -- 'cli', 'db', 'genomics', 'phylo'
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- Tabla de ejercicios completados
CREATE TABLE exercise_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  exercise_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT TRUE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_id, exercise_id)
);

-- Tabla de logros/achievements
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_key TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_key)
);

-- Habilitar Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Policies para perfiles
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Policies para module_progress
CREATE POLICY "Users can view own progress" 
  ON module_progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" 
  ON module_progress FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" 
  ON module_progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policies para exercise_completions
CREATE POLICY "Users can view own exercises" 
  ON exercise_completions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exercises" 
  ON exercise_completions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policies para achievements
CREATE POLICY "Users can view own achievements" 
  ON achievements FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" 
  ON achievements FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Función para crear perfil automáticamente cuando se registra usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función para obtener progreso completo del usuario
CREATE OR REPLACE FUNCTION get_user_progress(user_uuid UUID)
RETURNS TABLE (
  module_id TEXT,
  completed BOOLEAN,
  score INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mp.module_id,
    mp.completed,
    mp.score,
    mp.completed_at
  FROM module_progress mp
  WHERE mp.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;
