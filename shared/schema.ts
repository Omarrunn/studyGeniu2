import { z } from "zod";

export const questionSchema = z.object({
  qid: z.number(),
  label: z.string(),
  post_title: z.string(),
  source_url: z.string(),
  question_text: z.string(),
  options: z.record(z.string()),
  correct: z.array(z.string()),
  explanation: z.string(),
});

export const topicSchema = z.object({
  label: z.string(),
  questions: z.array(questionSchema),
});

export const surgerySecretSchema = z.object({
  number: z.number(),
  point: z.string(),
});

export const userProgressSchema = z.object({
  topicLabel: z.string(),
  completedQuestions: z.array(z.number()),
  correctAnswers: z.array(z.number()),
});

export type Question = z.infer<typeof questionSchema>;
export type Topic = z.infer<typeof topicSchema>;
export type SurgerySecret = z.infer<typeof surgerySecretSchema>;
export type UserProgress = z.infer<typeof userProgressSchema>;
