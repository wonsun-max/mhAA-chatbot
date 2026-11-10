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
  name: z
    .string()
    .min(2, "성명은 최소 2자 이상이어야 합니다.")
    .max(30, "성명은 30자 이하여야 합니다.")
    .trim()
    .optional(),
  nickname: z
    .string()
    .min(2, "닉네임은 최소 2자 이상이어야 합니다.")
    .max(20, "닉네임은 20자 이하여야 합니다.")
    .trim()
    .optional(),
  role: z.enum(["STUDENT", "TEACHER"]).optional(),
  grade: z.string().nullable().optional(),
  qtGroup: z.string().nullable().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다.").optional(),
});

/**
 * Shared Registration Schema (Strictly disallows ADMIN self-registration)
 */
export const registerSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력해주세요.").trim(),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
  name: z.string().min(2, "성명을 2자 이상 입력해주세요.").trim(),
  nickname: z.string().min(2, "닉네임은 최소 2자 이상이어야 합니다.").trim(),
  role: z.enum(["STUDENT", "TEACHER"]).default("STUDENT"),
  grade: z.string().nullable().optional(),
  qtGroup: z.string().nullable().optional(),
});
