import { type Topic, type SurgerySecret, type UserProgress } from "@shared/schema";
import mcqData from "../attached_assets/mcqs_by_label_1755405418356.json";
import surgerySecretsData from "../attached_assets/100_surgery_secret_1755405432312.json";

export interface IStorage {
  getTopics(): Promise<Topic[]>;
  getTopicByLabel(label: string): Promise<Topic | undefined>;
  getSurgerySecrets(): Promise<SurgerySecret[]>;
  searchQuestions(query: string): Promise<any[]>;
  searchSecrets(query: string): Promise<SurgerySecret[]>;
  getUserProgress(topicLabel: string): Promise<UserProgress | undefined>;
  updateUserProgress(progress: UserProgress): Promise<UserProgress>;
  resetAllProgress(): Promise<void>;
}

export class MemStorage implements IStorage {
  private topics: Topic[];
  private secrets: SurgerySecret[];
  private userProgress: Map<string, UserProgress>;

  constructor() {
    this.topics = mcqData as Topic[];
    this.secrets = surgerySecretsData as SurgerySecret[];
    this.userProgress = new Map();
  }

  async getTopics(): Promise<Topic[]> {
    return this.topics;
  }

  async getTopicByLabel(label: string): Promise<Topic | undefined> {
    return this.topics.find(topic => topic.label === label);
  }

  async getSurgerySecrets(): Promise<SurgerySecret[]> {
    return this.secrets;
  }

  async searchQuestions(query: string): Promise<any[]> {
    const results: any[] = [];
    const lowerQuery = query.toLowerCase();

    this.topics.forEach(topic => {
      topic.questions.forEach(question => {
        if (
          question.question_text.toLowerCase().includes(lowerQuery) ||
          question.explanation.toLowerCase().includes(lowerQuery) ||
          Object.values(question.options).some(option => 
            option.toLowerCase().includes(lowerQuery)
          )
        ) {
          results.push({
            ...question,
            topicLabel: topic.label
          });
        }
      });
    });

    return results;
  }

  async searchSecrets(query: string): Promise<SurgerySecret[]> {
    const lowerQuery = query.toLowerCase();
    return this.secrets.filter(secret =>
      secret.point.toLowerCase().includes(lowerQuery)
    );
  }

  async getUserProgress(topicLabel: string): Promise<UserProgress | undefined> {
    return this.userProgress.get(topicLabel);
  }

  async updateUserProgress(progress: UserProgress): Promise<UserProgress> {
    this.userProgress.set(progress.topicLabel, progress);
    return progress;
  }

  async resetAllProgress(): Promise<void> {
    this.userProgress.clear();
  }
}

export const storage = new MemStorage();
