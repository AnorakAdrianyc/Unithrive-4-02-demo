export const MOCK_USER = {
  id: 'demo-student-001',
  full_name: 'Alex Chen',
  role: 'student',
  year: 2,
  department: 'Computer Science',
  avatar_initials: 'AC',
}

export const MOCK_RINGS = {
  mental:   { score: 72, label: 'Mental',   color: '#6366f1', desc: 'Mood & stress levels' },
  psych:    { score: 65, label: 'Psych',    color: '#8b5cf6', desc: 'Emotional resilience' },
  physical: { score: 81, label: 'Physical', color: '#10b981', desc: 'Sleep & activity' },
}

export const MOCK_WEEKLY_DATA = [
  { day: 'Mon', mental: 68, psych: 60, physical: 75 },
  { day: 'Tue', mental: 72, psych: 65, physical: 80 },
  { day: 'Wed', mental: 65, psych: 58, physical: 78 },
  { day: 'Thu', mental: 70, psych: 62, physical: 82 },
  { day: 'Fri', mental: 75, psych: 70, physical: 85 },
  { day: 'Sat', mental: 78, psych: 72, physical: 79 },
  { day: 'Sun', mental: 72, psych: 65, physical: 81 },
]

export const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Weekly summary ready', body: 'Your Week 13 wellness report is now available.', type: 'info',    is_read: false, created_at: new Date(Date.now() - 600_000).toISOString() },
  { id: '2', title: 'Check-in reminder',    body: "You haven't checked in today — how are you feeling?",            type: 'warning', is_read: false, created_at: new Date(Date.now() - 3_600_000).toISOString() },
  { id: '3', title: 'New opportunity',      body: 'Hackathon: Build for Good — registration closes Friday.',        type: 'success', is_read: true,  created_at: new Date(Date.now() - 86_400_000).toISOString() },
  { id: '4', title: 'Counsellor message',   body: 'Dr. Lam has reviewed your weekly summary.',                      type: 'info',    is_read: true,  created_at: new Date(Date.now() - 172_800_000).toISOString() },
]

export const MOCK_INSIGHTS = [
  { ring: 'mental'   as const, title: 'Stress Spike Mid-Week',   text: 'Your mental score dipped on Wednesday. This coincides with your exam schedule — consider a 10-min breathing break before study sessions.' },
  { ring: 'psych'    as const, title: 'Resilience Building',     text: 'Your emotional resilience score improved by 8 points this week. Consistent journaling and peer support appear to be helping.' },
  { ring: 'physical' as const, title: 'Sleep Quality Improving', text: 'Average sleep improved to 7.2 hours. Maintaining this over the next two weeks could boost your cognitive scores by ~15%.' },
]

export const MOCK_STUDENTS = [
  { id: 's1', name: 'Alex Chen',    year: 2, dept: 'CS',       mental: 72, psych: 65, physical: 81, risk: 'low',      last_checkin: '2026-04-02' },
  { id: 's2', name: 'Maria Santos', year: 3, dept: 'Business', mental: 41, psych: 38, physical: 55, risk: 'high',     last_checkin: '2026-04-01' },
  { id: 's3', name: 'Wei Zhang',    year: 1, dept: 'Physics',  mental: 55, psych: 50, physical: 68, risk: 'moderate', last_checkin: '2026-04-02' },
  { id: 's4', name: 'Jordan Lee',   year: 4, dept: 'Medicine', mental: 28, psych: 22, physical: 45, risk: 'crisis',   last_checkin: '2026-03-31' },
  { id: 's5', name: 'Priya Nair',   year: 2, dept: 'Law',      mental: 80, psych: 75, physical: 88, risk: 'low',      last_checkin: '2026-04-02' },
  { id: 's6', name: 'Sam Okafor',   year: 3, dept: 'Eng',      mental: 60, psych: 55, physical: 72, risk: 'low',      last_checkin: '2026-04-01' },
]

export const MOCK_STREAK = [true, true, true, false, true, true, true]

export const MOCK_ACHIEVEMENTS = [
  { label: '7-Day Streak 🔥',       earned: true  },
  { label: 'First Check-in ✅',     earned: true  },
  { label: 'Resource Explorer 📚',  earned: true  },
  { label: 'Wellness Warrior 🏅',   earned: false },
]

export const MOCK_RESOURCES = [
  { id: 'r1', title: 'Understanding Academic Stress', description: 'CBT-based techniques for exam anxiety and study burnout.', category: 'mental',   featured: true,  emoji: '🧠' },
  { id: 'r2', title: 'Sleep Hygiene for Students',   description: 'Evidence-backed sleep improvement guide.',                 category: 'physical', featured: false, emoji: '😴' },
  { id: 'r3', title: 'Time Blocking Template',        description: 'Notion template for weekly study planning.',               category: 'academic', featured: false, emoji: '📅' },
  { id: 'r4', title: 'Campus Counselling Centre',    description: 'Book a free session — no referral needed.',                category: 'mental',   featured: true,  emoji: '💬' },
  { id: 'r5', title: 'Nutrition on a Budget',         description: 'Healthy eating for HK university students.',              category: 'physical', featured: false, emoji: '🥗' },
  { id: 'r6', title: 'LinkedIn Profile Masterclass', description: 'Recruiter-ready profile in 30 minutes.',                   category: 'career',   featured: false, emoji: '💼' },
  { id: 'r7', title: 'Crisis Support Hotline',        description: 'Available 24/7 — 1800-THRIVE. Free & confidential.',     category: 'crisis',   featured: true,  emoji: '🆘' },
  { id: 'r8', title: 'Mindfulness & Breathing',       description: '5-minute daily meditation for stress relief.',            category: 'mental',   featured: false, emoji: '🌿' },
]

export const MOCK_OPPORTUNITIES = [
  { id: 'o1', title: 'Hackathon: Build for Good',       description: 'Win HKD 50k building social-impact tech.',             category: 'career',   date: '2026-04-20', location: 'HKBU Auditorium', emoji: '💻' },
  { id: 'o2', title: 'Yoga in the Quad',                description: 'Free outdoor yoga every Tuesday morning.',              category: 'physical', date: '2026-04-08', location: 'Main Quad',       emoji: '🧘' },
  { id: 'o3', title: 'Career Fair 2026',                description: 'Meet 80+ employers across tech, finance, NGO.',         category: 'career',   date: '2026-04-25', location: 'Shaw Campus',     emoji: '🎯' },
  { id: 'o4', title: 'Study Group: Quantum Computing',  description: 'Peer-led weekly study sessions.',                       category: 'academic', date: '2026-04-10', location: 'Library Rm 4',   emoji: '⚛️' },
  { id: 'o5', title: 'Volunteer: Community Kitchen',    description: 'Help serve meals Saturdays 10am–1pm.',                  category: 'social',   date: '2026-04-12', location: 'Sham Shui Po',   emoji: '🥘' },
  { id: 'o6', title: 'Mental Health Awareness Walk',    description: 'Campus-wide awareness walk — all welcome.',             category: 'mental',   date: '2026-04-15', location: 'Running Track',   emoji: '🌿' },
]
