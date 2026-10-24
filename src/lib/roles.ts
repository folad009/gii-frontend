export const shellRoles = [
  "Learner",
  "Instructor",
  "GII Administrator",
  "Campus Coordinator",
  "GII Leadership",
] as const;

export type ShellRole = (typeof shellRoles)[number];

export type RoleHome = "/" | "/instructor" | "/admin" | "/campus" | "/leadership";

export type NavItem = { to: string; label: string };

const learnerNav: NavItem[] = [
  { to: "/", label: "My Growth" },
  { to: "/explore", label: "Explore Programmes" },
  { to: "/learn", label: "My Learning" },
  { to: "/classes", label: "My Classes" },
  { to: "/videos", label: "Study Videos" },
  { to: "/assignments", label: "Assignments" },
  { to: "/groups", label: "Prayer Groups" },
  { to: "/certificates", label: "Certificates" },
  { to: "/journey", label: "My Journey" },
];

const instructorNav: NavItem[] = [
  { to: "/instructor", label: "Instructor Workspace" },
  { to: "/cohorts", label: "Cohorts" },
  { to: "/classes", label: "Classes" },
  { to: "/checkin", label: "Class Check-In" },
  { to: "/videos", label: "Study Videos" },
  { to: "/groups", label: "Prayer Groups" },
];

const adminNav: NavItem[] = [
  { to: "/admin", label: "Dashboard" },
  { to: "/records", label: "Learner Records" },
  { to: "/explore", label: "Programmes" },
  { to: "/cohorts", label: "Cohorts" },
  { to: "/groups", label: "Prayer Groups" },
  { to: "/videos", label: "Study Videos" },
  { to: "/certificates", label: "Certificates" },
  { to: "/admin/profile", label: "My Profile" },
];

const coordinatorNav: NavItem[] = [
  { to: "/campus", label: "Campus Dashboard" },
  { to: "/cohorts", label: "Cohorts" },
  { to: "/classes", label: "Classes" },
  { to: "/checkin", label: "Class Check-In" },
  { to: "/groups", label: "Prayer Groups" },
  { to: "/videos", label: "Study Videos" },
  { to: "/records", label: "Learner Records" },
];

const leadershipNav: NavItem[] = [
  { to: "/leadership", label: "GII Intelligence" },
  { to: "/records", label: "Learner Records" },
  { to: "/cohorts", label: "Cohorts" },
  { to: "/explore", label: "Programmes" },
  { to: "/groups", label: "Prayer Groups" },
];

export function navFor(role: ShellRole): NavItem[] {
  switch (role) {
    case "Instructor":
      return instructorNav;
    case "GII Administrator":
      return adminNav;
    case "Campus Coordinator":
      return coordinatorNav;
    case "GII Leadership":
      return leadershipNav;
    default:
      return learnerNav;
  }
}

function hasNav(paths: readonly string[], path: string) {
  return paths.includes(path);
}

export function roleMayOpen(pathname: string, role: ShellRole): boolean {
  if (pathname === "/login") return true;
  const paths = navFor(role).map((item) => item.to);
  for (const path of paths) {
    if (path === "/") {
      if (pathname === "/") return true;
      continue;
    }
    if (pathname === path || pathname.startsWith(`${path}/`)) return true;
  }
  if (pathname.startsWith("/learn/") && (hasNav(paths, "/learn") || hasNav(paths, "/explore"))) return true;
  if (pathname.startsWith("/programmes/") && (hasNav(paths, "/") || hasNav(paths, "/journey") || hasNav(paths, "/explore"))) {
    return true;
  }
  if (
    pathname.startsWith("/learners/") &&
    (hasNav(paths, "/records") || hasNav(paths, "/cohorts") || hasNav(paths, "/instructor"))
  ) {
    return true;
  }
  return false;
}

export function homeFor(userRole: string | null | undefined): RoleHome {
  switch (userRole) {
    case "INSTRUCTOR":
      return "/instructor";
    case "GII_ADMINISTRATOR":
    case "SUPER_ADMIN":
      return "/admin";
    case "CAMPUS_COORDINATOR":
      return "/campus";
    case "GII_LEADERSHIP":
      return "/leadership";
    default:
      return "/";
  }
}

export function shellRole(userRole: string | null | undefined): ShellRole {
  switch (userRole) {
    case "INSTRUCTOR":
      return "Instructor";
    case "GII_ADMINISTRATOR":
    case "SUPER_ADMIN":
      return "GII Administrator";
    case "CAMPUS_COORDINATOR":
      return "Campus Coordinator";
    case "GII_LEADERSHIP":
      return "GII Leadership";
    default:
      return "Learner";
  }
}
