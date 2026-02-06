import type { AdminMessage, Diary, Goal, Transcription, Writing } from "@/lib/storage";
import {
  listWritings,
  createWriting,
  updateWritingRow,
  deleteWritingRow,
  listDiaries,
  createDiary,
  updateDiaryRow,
  deleteDiaryRow,
  listGoals,
  createGoal,
  updateGoalRow,
  deleteGoalRow,
  listTranscriptions,
  createTranscription,
  listAdminMessages,
  createAdminMessage,
  updateAdminMessageRow,
  deleteAdminMessageRow,
} from "@/lib/storageRemote";

// A) 로그인 사용자(userId 존재)면 Supabase 사용
// B) 비회원(userId null)이면 기존 localStorage 사용

// localStorage impl (reuse current functions)
import * as local from "@/lib/storage";

const mapWriting = (r: any): Writing => ({
  id: r.id,
  userId: r.user_id,
  title: r.title,
  content: r.content,
  genre: r.genre,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const mapDiary = (r: any): Diary => ({
  id: r.id,
  userId: r.user_id,
  date: r.date,
  content: r.content,
  mood: r.mood ?? undefined,
  createdAt: r.created_at,
});

const mapGoal = (r: any): Goal => ({
  id: r.id,
  userId: r.user_id,
  title: r.title,
  description: r.description,
  targetDate: r.target_date,
  progress: r.progress,
  createdAt: r.created_at,
});

const mapTranscription = (r: any): Transcription => ({
  id: r.id,
  userId: r.user_id,
  originalText: r.original_text,
  transcribedText: r.transcribed_text,
  reflection: r.reflection,
  createdAt: r.created_at,
});

const mapAdminMessage = (r: any): AdminMessage => ({
  id: r.id,
  userId: r.user_id,
  userName: r.user_name,
  userEmail: r.user_email,
  title: r.title,
  content: r.content,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
  isRead: r.is_read,
  adminReply: r.admin_reply ?? undefined,
  adminReplyAt: r.admin_reply_at ?? undefined,
});

export const getWritingsAsync = async (userId: string | null) => {
  if (!userId) return local.getWritings(userId);
  const rows = await listWritings(userId);
  return rows.map(mapWriting);
};

export const saveWritingAsync = async (input: Omit<Writing, "id" | "createdAt" | "updatedAt">) => {
  if (!input.userId) return local.saveWriting(input);
  const row = await createWriting({
    userId: input.userId,
    title: input.title,
    content: input.content,
    genre: input.genre,
  });
  return mapWriting(row);
};

export const updateWritingAsync = async (id: string, userId: string | null, updates: Partial<Writing>) => {
  if (!userId) return local.updateWriting(id, updates);
  const row = await updateWritingRow(id, {
    userId,
    title: updates.title,
    content: updates.content,
    genre: updates.genre,
  });
  return mapWriting(row);
};

export const deleteWritingAsync = async (id: string, userId: string | null) => {
  if (!userId) return local.deleteWriting(id);
  await deleteWritingRow(id, userId);
};

export const getDiariesAsync = async (userId: string | null) => {
  if (!userId) return local.getDiaries(userId);
  const rows = await listDiaries(userId);
  return rows.map(mapDiary);
};

export const saveDiaryAsync = async (input: Omit<Diary, "id" | "createdAt">) => {
  if (!input.userId) return local.saveDiary(input);
  const row = await createDiary({
    userId: input.userId,
    date: input.date,
    content: input.content,
    mood: input.mood ?? null,
  });
  return mapDiary(row);
};

export const updateDiaryAsync = async (id: string, userId: string | null, updates: Partial<Diary>) => {
  if (!userId) return local.updateDiary(id, updates);
  const row = await updateDiaryRow(id, {
    userId,
    date: updates.date,
    content: updates.content,
    mood: updates.mood ?? null,
  });
  return mapDiary(row);
};

export const deleteDiaryAsync = async (id: string, userId: string | null) => {
  if (!userId) return local.deleteDiary(id);
  await deleteDiaryRow(id, userId);
};

export const getGoalsAsync = async (userId: string | null) => {
  if (!userId) return local.getGoals(userId);
  const rows = await listGoals(userId);
  return rows.map(mapGoal);
};

export const saveGoalAsync = async (input: Omit<Goal, "id" | "createdAt">) => {
  if (!input.userId) return local.saveGoal(input);
  const row = await createGoal({
    userId: input.userId,
    title: input.title,
    description: input.description ?? "",
    targetDate: input.targetDate,
    progress: input.progress ?? 0,
  });
  return mapGoal(row);
};

export const updateGoalAsync = async (id: string, userId: string | null, updates: Partial<Goal>) => {
  if (!userId) return local.updateGoal(id, updates);
  const row = await updateGoalRow(id, {
    userId,
    title: updates.title,
    description: updates.description,
    targetDate: updates.targetDate,
    progress: updates.progress,
  });
  return mapGoal(row);
};

export const deleteGoalAsync = async (id: string, userId: string | null) => {
  if (!userId) return local.deleteGoal(id);
  await deleteGoalRow(id, userId);
};

export const getTranscriptionsAsync = async (userId: string | null) => {
  if (!userId) return local.getTranscriptions(userId);
  const rows = await listTranscriptions(userId);
  return rows.map(mapTranscription);
};

export const saveTranscriptionAsync = async (input: Omit<Transcription, "id" | "createdAt">) => {
  if (!input.userId) return local.saveTranscription(input);
  const row = await createTranscription({
    userId: input.userId,
    originalText: input.originalText,
    transcribedText: input.transcribedText,
    reflection: input.reflection ?? "",
  });
  return mapTranscription(row);
};

export const getAdminMessagesAsync = async (userId: string | null, isAdmin: boolean) => {
  if (!userId) return local.getAdminMessages(userId);
  if (isAdmin) {
    const response = await fetch("/api/admin-messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "list" }),
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload?.error ?? "관리자 메시지 조회 실패");
    }
    return (payload?.data ?? []).map(mapAdminMessage);
  }
  const rows = await listAdminMessages(userId);
  return rows.map(mapAdminMessage);
};

export const saveAdminMessageAsync = async (input: Omit<AdminMessage, "id" | "createdAt" | "updatedAt" | "isRead">) => {
  if (!input.userId) return local.saveAdminMessage(input);
  const row = await createAdminMessage({
    userId: input.userId,
    userName: input.userName,
    userEmail: input.userEmail,
    title: input.title,
    content: input.content,
  });
  return mapAdminMessage(row);
};

export const updateAdminMessageAsync = async (
  id: string,
  userId: string | null,
  isAdmin: boolean,
  updates: Partial<AdminMessage>
) => {
  if (!userId) return local.updateAdminMessage(id, updates);
  if (isAdmin) {
    const response = await fetch("/api/admin-messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", payload: { id, updates } }),
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload?.error ?? "관리자 메시지 업데이트 실패");
    }
    return mapAdminMessage(payload.data);
  }
  const row = await updateAdminMessageRow(id, {
    userId,
    title: updates.title,
    content: updates.content,
  });
  return mapAdminMessage(row);
};

export const deleteAdminMessageAsync = async (id: string, userId: string | null, isAdmin: boolean) => {
  if (!userId) return local.deleteAdminMessage(id);
  if (isAdmin) {
    const response = await fetch("/api/admin-messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", payload: { id } }),
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload?.error ?? "관리자 메시지 삭제 실패");
    }
    return;
  }
  await deleteAdminMessageRow(id, userId);
};
