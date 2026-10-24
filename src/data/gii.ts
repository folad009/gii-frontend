// All data below is FICTIONAL demo content for the GII prototype.

export type Pathway = "Foundation" | "Growth" | "Service" | "Leadership";
export type DeliveryMode = "Blended" | "Online" | "Physical";

export const campuses = ["The Goodland", "City Central", "Harbour View"] as const;

export const learner = {
  name: "David Adeyemi",
  firstName: "David",
  gicId: "GIC-DEMO-001",
  campus: "The Goodland",
  membership: "Member",
  joined: "Jan 2026",
  certificates: 1,
};

export type Programme = {
  slug: string;
  title: string;
  pathway: Pathway;
  summary: string;
  description: string;
  outcomes: string[];
  caseStudies: { title: string; scenario: string; discussion: string[] }[];
  instructor: string;
  duration: string;
  mode: DeliveryMode;
  campus: string;
  startDate: string;
  modules: { title: string; lessons: number }[];
  prerequisites: { title: string; met: boolean }[];
  assessment: string;
  completion: string;
  certificate: string;
  progress?: number;
  state: "completed" | "current" | "available" | "locked";
};

export const programmes: Programme[] = [
  {
    slug: "welcome-to-gods-family",
    title: "Welcome to God's Family",
    pathway: "Foundation",
    summary: "Discover your identity in Christ and your place in God's family.",
    description: "Introduces new believers to their identity in Christ, their place in God's family, and what it means to begin a relationship with God.",
    outcomes: ["Explain your new identity in Christ", "Describe the value of Christian community", "Identify practical ways to belong and grow"],
    caseStudies: [{ title: "A new beginning", scenario: "Tola is new to faith and unsure how to build relationships in church while navigating questions from home.", discussion: ["How can the group welcome Tola well?", "Which Scriptures speak to belonging in God's family?", "What practical next step could Tola take this week?"] }],
    instructor: "Pastor Tunde Bakare",
    duration: "4 weeks",
    mode: "Blended",
    campus: "The Goodland",
    startDate: "12 Jan 2026",
    modules: [{ title: "A New Life", lessons: 3 }, { title: "Belonging to God's Family", lessons: 3 }, { title: "Growing Together", lessons: 4 }],
    prerequisites: [],
    assessment: "One short quiz per module and a group case study",
    completion: "Complete all modules, the case study and attend 3 of 4 classes",
    certificate: "GII Welcome to God's Family Certificate",
    progress: 100,
    state: "completed",
  },
  {
    slug: "word-foundation",
    title: "Word Foundation",
    pathway: "Foundation",
    summary: "Learn to read, understand, study and apply God's Word.",
    description: "Establishes the importance of God's Word and teaches participants how to read, understand, study, and practically apply Scripture.",
    outcomes: ["Explain the authority and purpose of Scripture", "Use a simple method to study a Bible passage", "Build a sustainable daily Word habit"],
    caseStudies: [{ title: "Truth in a noisy world", scenario: "A group member receives conflicting advice online and wants to know how Scripture should guide the decision.", discussion: ["What does it mean to read the passage in context?", "Which biblical principles apply?", "How should the group respond with truth and grace?"] }],
    instructor: "Sarah Okafor",
    duration: "6 weeks",
    mode: "Blended",
    campus: "The Goodland",
    startDate: "05 Sep 2026",
    modules: [{ title: "Understanding the Bible", lessons: 4 }, { title: "Reading in Context", lessons: 4 }, { title: "Studying and Applying the Word", lessons: 3 }, { title: "A Daily Word Rhythm", lessons: 3 }],
    prerequisites: [{ title: "Welcome to God's Family", met: true }],
    assessment: "Module quizzes, one group case study and a final assessment",
    completion: "All modules complete, case study discussed and 70% final score",
    certificate: "GII Word Foundation Certificate",
    progress: 65,
    state: "current",
  },
  {
    slug: "prayer-power",
    title: "Prayer Power",
    pathway: "Growth",
    summary: "Grow a consistent prayer life across every dimension of prayer.",
    description: "Introduces participants to prayer as a vital expression of their relationship with God, covering different dimensions of prayer and practical principles for developing a consistent prayer life.",
    outcomes: ["Practise biblical patterns of prayer", "Build a sustainable prayer rhythm", "Participate confidently in group prayer"],
    caseStudies: [{ title: "When answers seem delayed", scenario: "A small group has prayed for a difficult situation for months and some members are becoming discouraged.", discussion: ["What can the group learn from persistent prayer?", "How can members care for one another while they wait?", "Which Scriptures would guide the group?"] }],
    instructor: "Grace Mensah",
    duration: "5 weeks",
    mode: "Blended",
    campus: "All campuses",
    startDate: "19 Sep 2026",
    modules: [{ title: "Why We Pray", lessons: 3 }, { title: "Praying the Word", lessons: 4 }, { title: "Intercession and Group Prayer", lessons: 3 }],
    prerequisites: [{ title: "Word Foundation", met: false }],
    assessment: "Prayer journal, group case study and one short assignment",
    completion: "All modules, group case study and journal submitted",
    certificate: "GII Prayer Power Certificate",
    state: "available",
  },
  {
    slug: "kingdom-service",
    title: "Kingdom Service",
    pathway: "Service",
    summary: "Serve God, His people and His Kingdom with purpose.",
    description: "Teaches believers the biblical significance of serving God, His people, and His Kingdom, while helping them discover opportunities to contribute meaningfully within the church and beyond.",
    outcomes: ["Explain the biblical heart of service", "Identify gifts and suitable serving opportunities", "Serve effectively as part of a healthy team"],
    caseStudies: [{ title: "Serving when it is inconvenient", scenario: "A team is short-handed during a demanding season, and tension is growing between committed volunteers.", discussion: ["What does servant-hearted leadership look like here?", "How should the team balance sacrifice and healthy limits?", "What practical action should the team leader take?"] }],
    instructor: "Daniel Eze",
    duration: "6 weeks",
    mode: "Blended",
    campus: "All campuses",
    startDate: "24 Oct 2026",
    modules: [{ title: "The Heart of Service", lessons: 3 }, { title: "Gifts and Grace", lessons: 3 }, { title: "Serving With Excellence", lessons: 4 }],
    prerequisites: [{ title: "Welcome to God's Family", met: true }, { title: "Word Foundation", met: false }],
    assessment: "Group case study, gifts reflection and team orientation checklist",
    completion: "All modules, case study and orientation checklist",
    certificate: "GII Kingdom Service Certificate",
    state: "available",
  },
  {
    slug: "holy-spirit-1",
    title: "Holy Spirit 1",
    pathway: "Growth",
    summary: "Know the person, presence and work of the Holy Spirit.",
    description: "Provides an introduction to the person, presence, and work of the Holy Spirit, helping believers understand His role in their relationship with God and daily Christian walk.",
    outcomes: ["Describe the person and work of the Holy Spirit", "Recognise the Spirit's role in Christian growth", "Practise daily dependence on the Holy Spirit"],
    caseStudies: [{ title: "Learning to discern", scenario: "Two group members have different impressions about an important decision and both believe the Holy Spirit is leading them.", discussion: ["How should their impressions be tested biblically?", "What role should wisdom and community play?", "How can the discussion remain gracious?"] }],
    instructor: "Emmanuel Idowu",
    duration: "6 weeks",
    mode: "Online",
    campus: "All campuses",
    startDate: "10 Oct 2026",
    modules: [{ title: "Who Is the Holy Spirit?", lessons: 3 }, { title: "The Spirit in the Believer", lessons: 4 }, { title: "Living Spirit-Led", lessons: 4 }],
    prerequisites: [{ title: "Word Foundation", met: false }],
    assessment: "Module quizzes, reflection and a group case study",
    completion: "All lessons, reflection and case study complete",
    certificate: "GII Holy Spirit 1 Certificate",
    state: "available",
  },
  {
    slug: "know-your-church",
    title: "Know Your Church",
    pathway: "Foundation",
    summary: "Understand the vision, values and pathway of Global Impact Ministries.",
    description: "Introduces participants to the vision, values, structure, culture, beliefs, and discipleship pathway of Global Impact Ministries, helping them understand how they can grow and contribute within the church family.",
    outcomes: ["Describe GIC's vision and values", "Understand the church's structure and ministries", "Identify a clear next step for participation"],
    caseStudies: [{ title: "One church across cultures", scenario: "Members from different countries are planning a shared GIC initiative and have different expectations about communication and leadership.", discussion: ["Which shared GIC values should guide them?", "How can cultural differences become a strength?", "What communication agreement should the group make?"] }],
    instructor: "Pastor Tunde Bakare",
    duration: "3 weeks",
    mode: "Online",
    campus: "All campuses",
    startDate: "03 Oct 2026",
    modules: [{ title: "Our Story and Vision", lessons: 3 }, { title: "One Church, Many Campuses", lessons: 3 }, { title: "Ministries and Your Next Step", lessons: 3 }],
    prerequisites: [{ title: "Welcome to God's Family", met: true }],
    assessment: "One final quiz and a group case study",
    completion: "Complete all lessons, the case study and final quiz",
    certificate: "GII Know Your Church Certificate",
    state: "available",
  },
];

export const pathwayOrder: Pathway[] = ["Foundation", "Growth", "Service", "Leadership"];

export const journey = [
  { pathway: "Foundation" as Pathway, state: "current" as const, note: "Word Foundation · 65%" },
  { pathway: "Growth" as Pathway, state: "available" as const, note: "Prayer Power · Holy Spirit 1" },
  { pathway: "Service" as Pathway, state: "available" as const, note: "Kingdom Service" },
  { pathway: "Leadership" as Pathway, state: "locked" as const, note: "Complete Service to unlock" },
];

export type Lesson = {
  id: string;
  title: string;
  kind: "Video" | "Audio" | "Text" | "PDF" | "Quiz" | "Assignment" | "Reflection";
  minutes: number;
  done: boolean;
};

export const courseOutline: { module: string; lessons: Lesson[] }[] = [
  {
    module: "Module 1 — Understanding the Bible",
    lessons: [
      { id: "1-1", title: "Why God's Word Matters", kind: "Video", minutes: 14, done: true },
      { id: "1-2", title: "The Story of Scripture", kind: "Text", minutes: 9, done: true },
      { id: "1-3", title: "Module 1 Quiz", kind: "Quiz", minutes: 10, done: true },
    ],
  },
  {
    module: "Module 2 — Reading in Context",
    lessons: [
      { id: "2-1", title: "Who, What, When and Why", kind: "Video", minutes: 18, done: true },
      { id: "2-2", title: "Reading a Passage in Context", kind: "Audio", minutes: 22, done: false },
      { id: "2-3", title: "Reflection — Hearing and Doing", kind: "Reflection", minutes: 15, done: false },
    ],
  },
  {
    module: "Module 3 — Studying and Applying the Word",
    lessons: [
      { id: "3-1", title: "A Simple Study Method", kind: "Video", minutes: 16, done: false },
      { id: "3-2", title: "Bible Study Workbook", kind: "PDF", minutes: 12, done: false },
      { id: "3-3", title: "Module 3 Assessment", kind: "Quiz", minutes: 20, done: false },
    ],
  },
  {
    module: "Module 4 — A Daily Word Rhythm",
    lessons: [
      { id: "4-1", title: "Building a Consistent Habit", kind: "Video", minutes: 15, done: false },
      { id: "4-2", title: "Seven-Day Reading Plan", kind: "Assignment", minutes: 30, done: false },
    ],
  },
];

export const classes = [
  {
    id: "c1",
    course: "Word Foundation",
    when: "Saturday, 12 Sep 2026 · 10:00 AM",
    mode: "Physical" as const,
    location: "The Goodland · Hall 2",
    instructor: "Sarah Okafor",
    status: "Upcoming" as const,
    attendance: "—",
    country: "Nigeria",
    joiningFrom: [] as { country: string; learners: number }[],
  },
  {
    id: "c2",
    course: "Word Foundation",
    when: "Saturday, 19 Sep 2026 · 10:00 AM",
    mode: "Online" as const,
    location: "Online class link",
    instructor: "Sarah Okafor",
    status: "Upcoming" as const,
    attendance: "—",
    country: "Global (virtual)",
    joiningFrom: [
      { country: "Nigeria", learners: 18 },
      { country: "Ghana", learners: 7 },
      { country: "United Kingdom", learners: 6 },
      { country: "United States", learners: 4 },
      { country: "Canada", learners: 2 },
      { country: "United Arab Emirates", learners: 2 },
      { country: "South Africa", learners: 1 },
    ] as { country: string; learners: number }[],
  },
  {
    id: "c3",
    course: "Word Foundation",
    when: "Saturday, 05 Sep 2026 · 10:00 AM",
    mode: "Physical" as const,
    location: "The Goodland · Hall 2",
    instructor: "Sarah Okafor",
    status: "Past" as const,
    attendance: "Present",
    country: "Nigeria",
    joiningFrom: [] as { country: string; learners: number }[],
  },
  {
    id: "c4",
    course: "Welcome to God's Family",
    when: "Saturday, 08 Feb 2026 · 10:00 AM",
    mode: "Physical" as const,
    location: "The Goodland · Room 4",
    instructor: "Pastor Tunde Bakare",
    status: "Past" as const,
    attendance: "Present",
    country: "Nigeria",
    joiningFrom: [] as { country: string; learners: number }[],
  },
];

// Discipleship video library — PYD "Achieve Greatness with Yemi Davids" study series.
export type StudyVideo = {
  id: string;
  /** YouTube video id */
  youtubeId: string;
  title: string;
  series: string;
  speaker: string;
  date: string;
  length: string;
  programme: string;
  scripture: string;
  questions: string[];
};

export const studyVideos: StudyVideo[] = [
  {
    id: "v1",
    youtubeId: "5GaBDPUB2dk",
    title: "Achieve Greatness — 22nd July 2026",
    series: "PYD · Achieve Greatness with Yemi Davids",
    speaker: "Pastor Yemi Davids",
    date: "22 Jul 2026",
    length: "Full teaching",
    programme: "Word Foundation",
    scripture: "Discussion notes to be added by the study leader",
    questions: [
      "What one truth from this teaching spoke to you most?",
      "Which area of your life is God asking you to steward better?",
      "What will you do differently this week?",
    ],
  },
];

export const assignments = [
  {
    title: "Reflection — New Life in Christ",
    course: "Word Foundation",
    due: "Fri, 11 Sep 2026",
    status: "In Progress" as const,
    score: "—",
  },
  {
    title: "Module 3 Assessment",
    course: "Word Foundation",
    due: "Sun, 13 Sep 2026",
    status: "Not Started" as const,
    score: "—",
  },
  {
    title: "Serving Your Campus",
    course: "Word Foundation",
    due: "Fri, 25 Sep 2026",
    status: "Not Started" as const,
    score: "—",
  },
  {
    title: "Module 2 Quiz",
    course: "Word Foundation",
    due: "Sun, 30 Aug 2026",
    status: "Completed" as const,
    score: "80%",
  },
  {
    title: "Belonging Reflection",
    course: "Welcome to God's Family",
    due: "Fri, 20 Feb 2026",
    status: "Awaiting Review" as const,
    score: "—",
  },
];

export const certificates = [
  {
    id: "GII-2026-000418",
    programme: "Welcome to God's Family",
    issued: "06 Mar 2026",
    signatory: "Director, Global Impact Institute",
  },
];

export const assessment = {
  course: "Word Foundation",
  title: "Module 3 Assessment",
  passMark: 70,
  questions: [
    {
      type: "Multiple Choice" as const,
      prompt: "According to Acts 2:42, what were the early believers devoted to?",
      options: [
        "The apostles' teaching and fellowship",
        "Building larger meeting places",
        "Recording attendance registers",
        "Public debate in the marketplace",
      ],
      answer: 0,
    },
    {
      type: "True / False" as const,
      prompt: "Prayer is only meaningful when spoken aloud in a gathering.",
      options: ["True", "False"],
      answer: 1,
    },
    {
      type: "Multiple Choice" as const,
      prompt: "Which practice best supports a sustainable daily rhythm with Scripture?",
      options: [
        "Reading a whole book in one sitting each month",
        "A short, consistent daily reading with reflection",
        "Only reading during classes",
        "Memorising without understanding context",
      ],
      answer: 1,
    },
    {
      type: "Short Answer" as const,
      prompt: "In one or two sentences, describe what changed for you at salvation.",
      options: [],
      answer: -1,
    },
  ],
  result: {
    score: 80,
    status: "PASSED" as const,
    feedback: "Good understanding of the foundational concepts.",
  },
};

export const instructorDashboard = {
  course: "Word Foundation",
  cohort: "The Goodland · September 2026",
  learners: 48,
  active: 42,
  onTrack: 35,
  followUp: 7,
  awaitingReview: 12,
  questions: 4,
};

export const cohorts = [
  {
    id: "chr-goodland-sep26",
    course: "Word Foundation",
    campus: "The Goodland",
    label: "September 2026 Cohort",
    instructor: "Sarah Okafor",
    registered: 48,
    started: 45,
    active: 42,
    completed: 0,
  },
  {
    id: "chr-city-sep26",
    course: "Word Foundation",
    campus: "City Central",
    label: "September 2026 Cohort",
    instructor: "Emmanuel Idowu",
    registered: 36,
    started: 34,
    active: 30,
    completed: 0,
  },
  {
    id: "mem-goodland-jul26",
    course: "Welcome to God's Family",
    campus: "The Goodland",
    label: "July 2026 Cohort",
    instructor: "Pastor Tunde Bakare",
    registered: 62,
    started: 60,
    active: 12,
    completed: 48,
  },
  {
    id: "gifts-harbour-aug26",
    course: "Kingdom Service",
    campus: "Harbour View",
    label: "August 2026 Cohort",
    instructor: "Grace Mensah",
    registered: 24,
    started: 22,
    active: 19,
    completed: 3,
  },
];

export const cohortLearners = [
  { name: "David Adeyemi", progress: 65, attendance: "3 / 3", status: "On Track", outstanding: "Reflection" },
  { name: "Amaka Nwosu", progress: 88, attendance: "3 / 3", status: "On Track", outstanding: "—" },
  { name: "Segun Balogun", progress: 41, attendance: "2 / 3", status: "Learning Follow-Up", outstanding: "Module 2 Quiz" },
  { name: "Ifeoma Chukwu", progress: 100, attendance: "3 / 3", status: "On Track", outstanding: "—" },
  { name: "Musa Bello", progress: 12, attendance: "1 / 3", status: "Attendance Follow-Up", outstanding: "Module 1 Quiz" },
  { name: "Blessing Etim", progress: 74, attendance: "3 / 3", status: "On Track", outstanding: "—" },
  { name: "Tobi Ajayi", progress: 55, attendance: "2 / 3", status: "Assignment Outstanding", outstanding: "Reflection" },
  { name: "Chiamaka Obi", progress: 92, attendance: "3 / 3", status: "On Track", outstanding: "—" },
];

export const leadership = {
  totalLearners: 1284,
  activeLearners: 906,
  programmesRunning: 6,
  coursesRunning: 14,
  completionRate: 68,
  attendance: 81,
  assessmentCompletion: 74,
  certificatesIssued: 412,
  awaitingNextStep: 137,
  byCampus: [
    { campus: "The Goodland", learners: 612, completion: 71 },
    { campus: "City Central", learners: 428, completion: 66 },
    { campus: "Harbour View", learners: 244, completion: 61 },
  ],
  funnel: [
    { stage: "First Timer", people: 2400 },
    { stage: "Membership", people: 1480 },
    { stage: "GII Foundation", people: 1284 },
    { stage: "Growth", people: 640 },
    { stage: "Service", people: 318 },
    { stage: "Leadership", people: 96 },
    { stage: "Impact", people: 34 },
  ],
};

export const adminStats = {
  programmes: 6,
  courses: 26,
  cohorts: 18,
  instructors: 21,
  awaitingApproval: 3,
  certificatesThisMonth: 37,
};

export const contentQueue = [
  { title: "Word Foundation v2.1", stage: "Theological Approval", owner: "Sarah Okafor", updated: "08 Sep 2026" },
  { title: "Holy Spirit 1 — Module 2", stage: "Review", owner: "Bisi Ade-Ola", updated: "07 Sep 2026" },
  { title: "Prayer Power — Module 3 Quiz", stage: "Draft", owner: "Grace Mensah", updated: "05 Sep 2026" },
];

export const learnerTimeline = [
  { label: "Joined GIC", date: "Jan 2026", done: true },
  { label: "Membership", date: "Feb 2026", done: true },
  { label: "GII Registration", date: "Feb 2026", done: true },
  { label: "Course Started", date: "Sep 2026", done: true },
  { label: "Course Completed", date: "Pending", done: false },
  { label: "Certificate", date: "Pending", done: false },
  { label: "Next Step", date: "Pending", done: false },
];

// Study calendar length can be expressed in days, weeks or months.
export function durationInDays(duration: string) {
  const value = parseFloat(duration) || 0;
  if (/month/i.test(duration)) return value * 30;
  if (/week/i.test(duration)) return value * 7;
  return value;
}

export function formatDuration(value: number, unit: "days" | "weeks" | "months") {
  const label = value === 1 ? unit.slice(0, -1) : unit;
  return `${value} ${label}`;
}
