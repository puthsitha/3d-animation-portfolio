// Central place for all personal content — edit this file to update the site.

export const site = {
  name: "Puthsitha Mouern",
  firstName: "Puthsitha",
  role: "Mobile Developer",
  roleDetail: "iOS · Swift/SwiftUI · Flutter",
  tagline:
    "I craft polished, native-feeling mobile experiences — from pixel-perfect SwiftUI interfaces to cross-platform Flutter apps that ship fast and feel right.",
  email: "puthsithamouern@gmail.com",
  location: "Phnom Penh, Cambodia",
  socials: {
    github: "https://github.com/puthsithamouern",
    linkedin: "https://www.linkedin.com/in/puthsithamouern",
  },
};

export const about = {
  intro:
    "I'm a mobile developer who cares about the details — the spring of an animation, the weight of a font, the half-second saved on a cold start.",
  paragraphs: [
    "My home turf is the Apple ecosystem: Swift, SwiftUI, UIKit when it's the right tool, and the full set of platform frameworks that make iOS apps feel like they belong on the device.",
    "When a product needs to reach both platforms, I build with Flutter — sharing one codebase without giving up native polish, backed by Hive for fast local storage and Firebase for the cloud half.",
    "I like small teams, fast feedback loops, and shipping things people actually use.",
  ],
  stats: [
    { value: "3+", label: "Years building mobile apps" },
    { value: "10+", label: "Apps shipped" },
    { value: "2", label: "Platforms, one standard" },
  ],
};

export type SkillGroup = {
  title: string;
  description: string;
  skills: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "iOS — Native",
    description: "The Apple platform, end to end.",
    skills: [
      "Swift",
      "SwiftUI",
      "UIKit",
      "Combine",
      "Swift Concurrency",
      "Core Data",
      "XCTest",
    ],
  },
  {
    title: "Cross-Platform",
    description: "One codebase, two app stores.",
    skills: [
      "Flutter",
      "Dart",
      "Riverpod",
      "Bloc",
      "Hive",
      "Platform Channels",
    ],
  },
  {
    title: "Backend & Cloud",
    description: "Everything behind the screen.",
    skills: [
      "Firebase Auth",
      "Cloud Firestore",
      "Cloud Functions",
      "Push Notifications",
      "REST APIs",
      "GraphQL",
    ],
  },
  {
    title: "Craft & Tooling",
    description: "How the work gets shipped.",
    skills: [
      "Xcode",
      "Git",
      "CI/CD (Fastlane)",
      "App Store Connect",
      "Figma",
      "TestFlight",
    ],
  },
];

export type Project = {
  title: string;
  description: string;
  tags: string[];
  accent: string;
  link?: string;
};

export const projects: Project[] = [
  {
    title: "Habitto",
    description:
      "A habit tracker built entirely in SwiftUI — streaks, widgets, and haptic-rich interactions, with Core Data persistence and iCloud sync.",
    tags: ["SwiftUI", "Core Data", "WidgetKit", "CloudKit"],
    accent: "#3b82f6",
  },
  {
    title: "Marketly",
    description:
      "Cross-platform marketplace app in Flutter with real-time chat, offline-first product browsing via Hive, and Firebase-powered auth and storage.",
    tags: ["Flutter", "Hive", "Firebase", "Riverpod"],
    accent: "#8b5cf6",
  },
  {
    title: "FitPulse",
    description:
      "Workout companion for iPhone and Apple Watch — HealthKit integration, live-activity workout sessions, and charts built with Swift Charts.",
    tags: ["Swift", "HealthKit", "WatchOS", "Swift Charts"],
    accent: "#10b981",
  },
  {
    title: "Lexio",
    description:
      "Language flashcard app with spaced repetition, fully offline thanks to Hive, and a Flutter animation layer that makes reviewing feel like a game.",
    tags: ["Flutter", "Hive", "Animations", "Bloc"],
    accent: "#f59e0b",
  },
  {
    title: "QueueLess",
    description:
      "Restaurant queue management — customer iOS app in SwiftUI plus a staff tablet app, synced in real time over Firestore with push notifications.",
    tags: ["SwiftUI", "Firestore", "FCM", "Combine"],
    accent: "#ef4444",
  },
  {
    title: "Snapfolio",
    description:
      "Portfolio generator for photographers: drag-and-drop layout editing on iPad with PencilKit annotations and one-tap static-site export.",
    tags: ["Swift", "PencilKit", "iPadOS", "Cloud Functions"],
    accent: "#06b6d4",
  },
];

export type ExperienceItem = {
  period: string;
  role: string;
  company: string;
  description: string;
  highlights: string[];
};

export const experience: ExperienceItem[] = [
  {
    period: "2024 — Present",
    role: "Mobile Developer",
    company: "Freelance / Contract",
    description:
      "Building iOS and Flutter apps end-to-end for startups and small businesses — from first Figma frame to App Store release.",
    highlights: [
      "Shipped 4 client apps across iOS and Android from a single Flutter codebase",
      "Cut one client's app cold-start time by 40% through lazy initialization and Hive caching",
      "Set up CI/CD pipelines with Fastlane and GitHub Actions for one-tap releases",
    ],
  },
  {
    period: "2023 — 2024",
    role: "iOS Developer",
    company: "Product Studio",
    description:
      "Owned the iOS side of a consumer product — SwiftUI feature work, performance, and App Store releases on a two-week cadence.",
    highlights: [
      "Rebuilt the onboarding flow in SwiftUI, lifting completion rate by 25%",
      "Introduced Swift Concurrency, replacing callback pyramids with async/await",
      "Added home-screen widgets and live activities that doubled daily opens",
    ],
  },
  {
    period: "2022 — 2023",
    role: "Junior Mobile Developer",
    company: "Software Agency",
    description:
      "First professional role — learned the craft shipping production Flutter features under senior review.",
    highlights: [
      "Delivered features across 3 client Flutter apps with Firebase backends",
      "Built an offline-first sync layer with Hive that survived spotty networks",
      "Wrote widget and integration tests that caught regressions before QA did",
    ],
  },
];
