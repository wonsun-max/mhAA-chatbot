import { z } from "zod";

/**
 * Community Post Validation Schema
 */
export const postSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters")
    .trim(),
  content: z
    .string()
    .min(1, "Content is required")
    .max(10000, "Content must be less than 10,000 characters")
    .trim(),
});

/**
 * User Profile Update Schema
 */
export const profileSchema = z.object({
  nickname: z
    .string()
    .min(2, "Nickname must be at least 2 characters")
    .max(20, "Nickname must be less than 20 characters")
    .regex(/^[a-zA-Z0-9가-힣\s]+$/, "Nickname can only contain letters, numbers, and Korean characters")
    .optional(),
  grade: z.string().optional(),
  qtGroup: z.string().optional(),
});

/**
 * Shared Registration Schema
 */
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
  grade: z.string().optional(),
});
