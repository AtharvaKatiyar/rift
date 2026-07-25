export interface TaskHistoryEntry {
  date: string;
  destination: string;
  isCurrent: boolean;
}

export interface TaskData {
  name: string;
  slug: string;
  publicId: string;
  fullLink: string;
  history: TaskHistoryEntry[];
}

export interface Feature {
  title: string;
  desc: string;
  color: string;
}

export interface UseCase {
  role: string;
  desc: string;
}
