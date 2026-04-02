-- UNI-THRIVE Database Schema with RLS
create extension if not exists "uuid-ossp";

-- Profiles
create table public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  full_name   text not null default '',
  role        text not null default 'student' check (role in ('student','counselor','admin')),
  avatar_url  text,
  year        int default 1,
  department  text default 'General',
  created_at  timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Own profile read"      on public.profiles for select using (auth.uid() = id);
create policy "Own profile update"    on public.profiles for update using (auth.uid() = id);
create policy "Own profile insert"    on public.profiles for insert with check (auth.uid() = id);
create policy "Counselor reads all"   on public.profiles for select
  using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('counselor','admin')));

-- Checkins
create table public.checkins (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid references public.profiles on delete cascade,
  mood           text not null check (mood in ('great','good','okay','low','struggling')),
  mental_score   int  check (mental_score  between 1 and 10),
  psych_score    int  check (psych_score   between 1 and 10),
  physical_score int  check (physical_score between 1 and 10),
  note           text check (char_length(note) <= 500),
  created_at     timestamptz default now()
);
alter table public.checkins enable row level security;
create policy "Own checkins"           on public.checkins for all  using (auth.uid() = user_id);
create policy "Counselor reads checkins" on public.checkins for select
  using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('counselor','admin')));

-- Notifications
create table public.notifications (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references public.profiles on delete cascade,
  title      text not null check (char_length(title) <= 200),
  body       text check (char_length(body) <= 500),
  type       text default 'info' check (type in ('info','warning','success','alert')),
  is_read    boolean default false,
  created_at timestamptz default now()
);
alter table public.notifications enable row level security;
create policy "Own notifications read"   on public.notifications for select using (auth.uid() = user_id);
create policy "Own notifications update" on public.notifications for update using (auth.uid() = user_id);

-- Resources
create table public.resources (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  description text,
  category    text not null check (category in ('mental','physical','academic','career','social','crisis')),
  url         text,
  is_featured boolean default false,
  created_at  timestamptz default now()
);
alter table public.resources enable row level security;
create policy "Public resources" on public.resources for select using (true);

-- Opportunities
create table public.opportunities (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  description text,
  category    text not null,
  event_date  date,
  location    text,
  emoji       text default '📅',
  created_at  timestamptz default now()
);
alter table public.opportunities enable row level security;
create policy "Public opportunities" on public.opportunities for select using (true);

-- Seed resources
insert into public.resources (title,description,category,url,is_featured) values
  ('Understanding Academic Stress','CBT-based techniques for exam anxiety and study burnout.','mental','https://www.mind.org.uk',true),
  ('Sleep Hygiene for Students','Evidence-backed sleep improvement guide for academic performance.','physical',null,false),
  ('Time Blocking Template','Notion template for weekly study planning and task management.','academic','https://notion.so',false),
  ('Campus Counselling Centre','Book a free session with a trained counsellor — no referral needed.','mental',null,true),
  ('Nutrition on a Budget','Healthy eating guide specifically for university students.','physical',null,false),
  ('LinkedIn Profile Masterclass','Craft a recruiter-ready profile in 30 minutes.','career','https://linkedin.com',false),
  ('Crisis Support Hotline','Available 24/7 — call 1800-THRIVE. Confidential and free.','crisis',null,true),
  ('Mindfulness & Breathing','5-minute daily meditation for stress relief and focus.','mental',null,false);

-- Seed opportunities
insert into public.opportunities (title,description,category,event_date,location,emoji) values
  ('Hackathon: Build for Good','Win HKD 50k building social-impact technology.','career','2026-04-20','HKBU Auditorium','💻'),
  ('Yoga in the Quad','Free outdoor yoga every Tuesday morning.','physical','2026-04-08','Main Quad','🧘'),
  ('Career Fair 2026','Meet 80+ employers across tech, finance, and NGO sectors.','career','2026-04-25','Shaw Campus','🎯'),
  ('Study Group: Quantum Computing','Peer-led weekly study sessions for physics students.','academic','2026-04-10','Library Rm 4','⚛️'),
  ('Volunteer: Community Kitchen','Help serve meals every Saturday 10am–1pm.','social','2026-04-12','Sham Shui Po','🥘'),
  ('Mental Health Awareness Walk','Campus-wide awareness walk — all students welcome.','mental','2026-04-15','Running Track','🌿');
