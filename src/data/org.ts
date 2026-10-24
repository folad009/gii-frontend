// Fictional demo data — multi-country structure, records and small groups.

export type Country = {
  code: string;
  name: string;
  flag: string;
  timezone: string;
  language: string;
  campuses: { name: string; city: string; learners: number; coordinator: string }[];
};

/** Country name → flag, including places people join virtual classes from. */
export const countryFlags: Record<string, string> = {
  Nigeria: "🇳🇬",
  Ghana: "🇬🇭",
  "United Kingdom": "🇬🇧",
  "United States": "🇺🇸",
  Canada: "🇨🇦",
  "South Africa": "🇿🇦",
  Kenya: "🇰🇪",
  "United Arab Emirates": "🇦🇪",
  Germany: "🇩🇪",
  Australia: "🇦🇺",
  India: "🇮🇳",
};

export const flagFor = (country: string) => countryFlags[country] ?? "🌍";

export const countries: Country[] = [
  {
    code: "NG",
    flag: "🇳🇬",
    name: "Nigeria",
    timezone: "WAT (UTC+1)",
    language: "English",
    campuses: [
      { name: "The Goodland", city: "Lagos", learners: 612, coordinator: "Ada Okonkwo" },
      { name: "City Central", city: "Abuja", learners: 428, coordinator: "Kunle Sanni" },
    ],
  },
  {
    code: "GH",
    flag: "🇬🇭",
    name: "Ghana",
    timezone: "GMT (UTC+0)",
    language: "English",
    campuses: [{ name: "Harbour View", city: "Accra", learners: 244, coordinator: "Grace Mensah" }],
  },
  {
    code: "GB",
    flag: "🇬🇧",
    name: "United Kingdom",
    timezone: "BST (UTC+1)",
    language: "English",
    campuses: [{ name: "GIC London", city: "London", learners: 186, coordinator: "Ruth Adeleke" }],
  },
  {
    code: "US",
    flag: "🇺🇸",
    name: "United States",
    timezone: "EDT (UTC-4)",
    language: "English",
    campuses: [{ name: "GIC Houston", city: "Houston", learners: 121, coordinator: "Samuel Iheanacho" }],
  },
];

export type LearnerRecord = {
  gicId: string;
  name: string;
  country: string;
  campus: string;
  membership: "Member" | "First Timer" | "Guest";
  programme: string;
  progress: number;
  attendance: string;
  certificates: number;
  lastActivity: string;
  status: "On Track" | "Learning Follow-Up" | "Attendance Follow-Up" | "Completed";
};

export const learnerRecords: LearnerRecord[] = [
  { gicId: "GIC-DEMO-001", name: "David Adeyemi", country: "Nigeria", campus: "The Goodland", membership: "Member", programme: "Word Foundation", progress: 65, attendance: "3 / 3", certificates: 1, lastActivity: "10 Sep 2026", status: "On Track" },
  { gicId: "GIC-DEMO-002", name: "Amaka Nwosu", country: "Nigeria", campus: "The Goodland", membership: "Member", programme: "Word Foundation", progress: 88, attendance: "3 / 3", certificates: 2, lastActivity: "09 Sep 2026", status: "On Track" },
  { gicId: "GIC-DEMO-003", name: "Segun Balogun", country: "Nigeria", campus: "The Goodland", membership: "Member", programme: "Word Foundation", progress: 41, attendance: "2 / 3", certificates: 1, lastActivity: "02 Sep 2026", status: "Learning Follow-Up" },
  { gicId: "GIC-DEMO-004", name: "Ifeoma Chukwu", country: "Nigeria", campus: "City Central", membership: "Member", programme: "Welcome to God's Family", progress: 100, attendance: "4 / 4", certificates: 1, lastActivity: "28 Aug 2026", status: "Completed" },
  { gicId: "GIC-DEMO-005", name: "Musa Bello", country: "Nigeria", campus: "City Central", membership: "First Timer", programme: "Welcome to God's Family", progress: 12, attendance: "1 / 3", certificates: 0, lastActivity: "24 Aug 2026", status: "Attendance Follow-Up" },
  { gicId: "GIC-DEMO-006", name: "Kwame Asare", country: "Ghana", campus: "Harbour View", membership: "Member", programme: "Kingdom Service", progress: 57, attendance: "3 / 4", certificates: 2, lastActivity: "08 Sep 2026", status: "On Track" },
  { gicId: "GIC-DEMO-007", name: "Abena Owusu", country: "Ghana", campus: "Harbour View", membership: "Member", programme: "Bible Study", progress: 74, attendance: "4 / 4", certificates: 3, lastActivity: "07 Sep 2026", status: "On Track" },
  { gicId: "GIC-DEMO-008", name: "Ruth Adeleke", country: "United Kingdom", campus: "GIC London", membership: "Member", programme: "Holy Spirit 1", progress: 33, attendance: "2 / 3", certificates: 4, lastActivity: "06 Sep 2026", status: "Learning Follow-Up" },
  { gicId: "GIC-DEMO-009", name: "Daniel Osei", country: "United Kingdom", campus: "GIC London", membership: "Member", programme: "Holy Spirit 1", progress: 91, attendance: "3 / 3", certificates: 2, lastActivity: "09 Sep 2026", status: "On Track" },
  { gicId: "GIC-DEMO-010", name: "Grace Nkemdirim", country: "United States", campus: "GIC Houston", membership: "Member", programme: "Prayer", progress: 48, attendance: "2 / 4", certificates: 1, lastActivity: "01 Sep 2026", status: "Attendance Follow-Up" },
  { gicId: "GIC-DEMO-011", name: "Tobi Ajayi", country: "United States", campus: "GIC Houston", membership: "Member", programme: "Word Foundation", progress: 55, attendance: "2 / 3", certificates: 0, lastActivity: "05 Sep 2026", status: "Learning Follow-Up" },
  { gicId: "GIC-DEMO-012", name: "Blessing Etim", country: "Nigeria", campus: "The Goodland", membership: "Member", programme: "Word Foundation", progress: 74, attendance: "3 / 3", certificates: 1, lastActivity: "10 Sep 2026", status: "On Track" },
];

export type SmallGroup = {
  id: string;
  name: string;
  kind: "Prayer Meeting" | "Study Group" | "Class Group" | "Daily Bible Study";
  campus: string;
  country: string;
  leader: string;
  meets: string;
  mode: "Physical" | "Online";
  location: string;
  members: number;
  capacity: number;
  /** Daily Bible study groups only */
  dailyTime?: string;
  timezone?: string;
  plan?: string;
};

export const smallGroups: SmallGroup[] = [
  { id: "g1", name: "Goodland Early Morning Prayer", kind: "Prayer Meeting", campus: "The Goodland", country: "Nigeria", leader: "Sarah Okafor", meets: "Tue & Thu · 5:30 AM", mode: "Physical", location: "Prayer Room 1", members: 14, capacity: 20 },
  { id: "g2", name: "Foundations Cohort Prayer Circle", kind: "Prayer Meeting", campus: "The Goodland", country: "Nigeria", leader: "David Adeyemi", meets: "Wed · 8:00 PM", mode: "Online", location: "Online meeting link", members: 9, capacity: 12 },
  { id: "g3", name: "City Central Midweek Intercession", kind: "Prayer Meeting", campus: "City Central", country: "Nigeria", leader: "Kunle Sanni", meets: "Wed · 6:30 PM", mode: "Physical", location: "Chapel", members: 22, capacity: 30 },
  { id: "g4", name: "Harbour View Family Prayer", kind: "Prayer Meeting", campus: "Harbour View", country: "Ghana", leader: "Abena Owusu", meets: "Sat · 7:00 AM", mode: "Physical", location: "Community Hall", members: 17, capacity: 25 },
  { id: "g5", name: "London Night Watch", kind: "Prayer Meeting", campus: "GIC London", country: "United Kingdom", leader: "Ruth Adeleke", meets: "Fri · 10:00 PM", mode: "Online", location: "Online meeting link", members: 11, capacity: 20 },
  { id: "g6", name: "Bible Study Group A", kind: "Study Group", campus: "Harbour View", country: "Ghana", leader: "Emmanuel Idowu", meets: "Sun · 4:00 PM", mode: "Physical", location: "Room 3", members: 12, capacity: 15 },
  { id: "g7", name: "Houston Morning Prayer", kind: "Prayer Meeting", campus: "GIC Houston", country: "United States", leader: "Samuel Iheanacho", meets: "Mon · 6:00 AM", mode: "Online", location: "Online meeting link", members: 8, capacity: 15 },
  { id: "g8", name: "Daily Word · Lagos Dawn", kind: "Daily Bible Study", campus: "The Goodland", country: "Nigeria", leader: "Blessing Etim", meets: "Every day · 5:45 AM WAT", mode: "Online", location: "Online meeting link", members: 24, capacity: 50, dailyTime: "05:45", timezone: "WAT (UTC+1)", plan: "Gospel of Luke · 15 min a day" },
  { id: "g9", name: "Daily Word · Accra Evening", kind: "Daily Bible Study", campus: "Harbour View", country: "Ghana", leader: "Kwame Asare", meets: "Every day · 8:30 PM GMT", mode: "Online", location: "Online meeting link", members: 12, capacity: 25, dailyTime: "20:30", timezone: "GMT (UTC+0)", plan: "Proverbs a day" },
  { id: "g10", name: "Daily Word · London Commute", kind: "Daily Bible Study", campus: "GIC London", country: "United Kingdom", leader: "Daniel Osei", meets: "Every day · 7:15 AM BST", mode: "Online", location: "Online meeting link", members: 9, capacity: 20, dailyTime: "07:15", timezone: "BST (UTC+1)", plan: "Psalms & Acts" },
  { id: "g11", name: "Daily Word · Houston Nightly", kind: "Daily Bible Study", campus: "GIC Houston", country: "United States", leader: "Grace Nkemdirim", meets: "Every day · 9:00 PM EDT", mode: "Online", location: "Online meeting link", members: 6, capacity: 30, dailyTime: "21:00", timezone: "EDT (UTC-4)", plan: "Bible in one year" },
  { id: "g12", name: "Daily Word · Abuja Family Table", kind: "Daily Bible Study", campus: "City Central", country: "Nigeria", leader: "Ifeoma Chukwu", meets: "Every day · 7:00 PM WAT", mode: "Physical", location: "Chapel side room", members: 5, capacity: 12, dailyTime: "19:00", timezone: "WAT (UTC+1)", plan: "Sermon on the Mount" },
];

export const adminProfile = {
  name: "Adaeze Obi",
  role: "GII Administrator",
  gicId: "GIC-STAFF-014",
  email: "gii.admin@demo.gic.org",
  phone: "+234 800 000 0000",
  campus: "All campuses",
  countries: ["Nigeria", "Ghana", "United Kingdom", "United States"],
  since: "Feb 2025",
  mfa: true,
  lastSignIn: "10 Sep 2026 · 08:42 WAT",
  permissions: [
    { area: "Programmes & Courses", level: "Create, edit, publish" },
    { area: "Cohorts & Enrolments", level: "Full access" },
    { area: "Learner Records", level: "View, edit, export" },
    { area: "Certificates", level: "Issue and revoke" },
    { area: "Content Approval", level: "Submit and review (no theological approval)" },
    { area: "Users & Roles", level: "Assign roles below administrator" },
    { area: "Audit Log", level: "View only" },
  ],
  activity: [
    { date: "10 Sep 2026", action: "Published Word Foundation v2.1", status: "Completed" },
    { date: "09 Sep 2026", action: "Issued 12 certificates — Welcome to God's Family", status: "Completed" },
    { date: "08 Sep 2026", action: "Created cohort — Harbour View, October 2026", status: "Completed" },
    { date: "07 Sep 2026", action: "Exported learner record report (Ghana)", status: "Completed" },
  ],
};
