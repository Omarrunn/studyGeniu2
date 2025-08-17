// Offline storage utilities using localStorage for simplicity
import { type Topic, type SurgerySecret, type UserProgress } from "@shared/schema";

const STORAGE_KEYS = {
  TOPICS: 'medquiz_topics',
  SECRETS: 'medquiz_secrets',
  PROGRESS: 'medquiz_progress',
  OFFLINE_QUEUE: 'medquiz_offline_queue'
};

// Store data for offline use
export const storeTopicsOffline = (topics: Topic[]) => {
  localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(topics));
};

export const storeSecretsOffline = (secrets: SurgerySecret[]) => {
  localStorage.setItem(STORAGE_KEYS.SECRETS, JSON.stringify(secrets));
};

export const storeProgressOffline = (progress: UserProgress) => {
  const existing = getOfflineProgress();
  const updated = { ...existing, [progress.topicLabel]: progress };
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(updated));
};

// Retrieve data when offline
export const getTopicsOffline = (): Topic[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TOPICS);
  return data ? JSON.parse(data) : [];
};

export const getSecretsOffline = (): SurgerySecret[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SECRETS);
  return data ? JSON.parse(data) : [];
};

export const getOfflineProgress = (): Record<string, UserProgress> => {
  const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  return data ? JSON.parse(data) : {};
};

export const getProgressForTopic = (topicLabel: string): UserProgress | undefined => {
  const allProgress = getOfflineProgress();
  return allProgress[topicLabel];
};

// Queue operations for when back online
export const queueOfflineOperation = (operation: {
  type: 'progress';
  data: UserProgress;
  timestamp: number;
}) => {
  const queue = getOfflineQueue();
  queue.push(operation);
  localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
};

export const getOfflineQueue = () => {
  const data = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
  return data ? JSON.parse(data) : [];
};

export const clearOfflineQueue = () => {
  localStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);
};

// Check if app is offline
export const isOffline = () => !navigator.onLine;

// Clear all offline data (for reset functionality)
export const clearAllOfflineData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

// Initialize offline storage with current data
export const initializeOfflineStorage = async () => {
  try {
    // Only fetch if online and storage is empty
    if (navigator.onLine) {
      if (!localStorage.getItem(STORAGE_KEYS.TOPICS)) {
        const topicsResponse = await fetch('/api/topics');
        if (topicsResponse.ok) {
          const topics = await topicsResponse.json();
          storeTopicsOffline(topics);
        }
      }

      if (!localStorage.getItem(STORAGE_KEYS.SECRETS)) {
        const secretsResponse = await fetch('/api/secrets');
        if (secretsResponse.ok) {
          const secrets = await secretsResponse.json();
          storeSecretsOffline(secrets);
        }
      }
    }
  } catch (error) {
    console.log('Failed to initialize offline storage:', error);
  }
};