import type { Feature, TaskData, UseCase } from "@/types/landing";

export const TASKS_DATA: TaskData[] = [
  {
    name: "Portfolio",
    slug: "portfolio",
    publicId: "A7XK29M4PQ8L",
    fullLink: "rift.dpdns.org/portfolio/A7XK29M4PQ8L",
    history: [
      { date: "Jan 2024", destination: "portfolio-v1.com", isCurrent: false },
      { date: "Sep 2024", destination: "portfolio-v2.com", isCurrent: false },
      { date: "", destination: "personal-website.com", isCurrent: true },
    ],
  },
  {
    name: "Resume",
    slug: "resume",
    publicId: "F3JKP92MLX8A",
    fullLink: "rift.dpdns.org/resume/F3JKP92MLX8A",
    history: [
      { date: "Mar 2024", destination: "drive.google.com/resume-v1", isCurrent: false },
      { date: "Aug 2024", destination: "drive.google.com/resume-v2", isCurrent: false },
      { date: "", destination: "notion.site/resume", isCurrent: true },
    ],
  },
  {
    name: "Startup",
    slug: "startup",
    publicId: "Q8T2MN6PWK5Z",
    fullLink: "rift.dpdns.org/startup/Q8T2MN6PWK5Z",
    history: [
      { date: "Jun 2024", destination: "waitlist page", isCurrent: false },
      { date: "Dec 2024", destination: "beta page", isCurrent: false },
      { date: "", destination: "product launch", isCurrent: true },
    ],
  },
  {
    name: "Docs",
    slug: "docs",
    publicId: "R9MLP42ATXQ1",
    fullLink: "rift.dpdns.org/docs/R9MLP42ATXQ1",
    history: [
      { date: "Oct 2024", destination: "docs-v1.myproduct.com", isCurrent: false },
      { date: "", destination: "docs.myproduct.com", isCurrent: true },
    ],
  },
];

export const FEATURES: Feature[] = [
  {
    title: "One link, one task",
    desc: "Each link is scoped to a single purpose and fully independent of every other link in your account.",
    color: "#C79A3E",
  },
  {
    title: "Update anytime",
    desc: "Swap a link's destination as often as you need. The public URL never changes, no matter how many times you edit it.",
    color: "#A6503B",
  },
  {
    title: "Custom slugs",
    desc: "Choose a slug that names the task — /portfolio, /resume, /startup — Rift adds a unique public ID automatically.",
    color: "#4C5A78",
  },
  {
    title: "Reserved-route protection",
    desc: "Slugs like login, admin, and api are protected so your links can never collide with the platform itself.",
    color: "#6E7C5C",
  },
  {
    title: "Fast, every time",
    desc: "Links resolve quickly and consistently, whether they get five clicks a month or five thousand.",
    color: "#7C6E92",
  },
  {
    title: "Full control, one dashboard",
    desc: "Create, update, deactivate, or reactivate any of your links from a single place, any time you need to.",
    color: "#C79A3E",
  },
];

export const USE_CASES: UseCase[] = [
  { role: "Developers", desc: "One permanent portfolio link, always current." },
  { role: "Job seekers", desc: "Never re-share a resume link again." },
  { role: "Startups", desc: "One URL through waitlist, beta and launch." },
  { role: "Businesses", desc: "QR codes and print that never go stale." },
];
