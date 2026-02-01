import { supabase } from "@/lib/supabaseClient";

export type WritingRow = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  genre: string;
  created_at: string;
  updated_at: string;
};

export type DiaryRow = {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  content: string;
  mood: string | null;
  created_at: string;
  updated_at: string;
};

export type GoalRow = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  target_date: string; // YYYY-MM-DD
  progress: number;
  created_at: string;
  updated_at: string;
};

export type TranscriptionRow = {
  id: string;
  user_id: string;
  original_text: string;
  transcribed_text: string;
  reflection: string;
  created_at: string;
};

export type AdminMessageRow = {
  id: string;
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  title: string;
  content: string;
  is_read: boolean;
  admin_reply: string | null;
  admin_reply_at: string | null;
  created_at: string;
  updated_at: string;
};

const requireUserId = (userId: string | null | undefined) => {
  if (!userId) throw new Error("로그인이 필요합니다.");
  return userId;
};

// Writings
export const listWritings = async (userId: string | null) => {
  const uid = requireUserId(userId);
  const { data, error } = await supabase
    .from("writings")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as WritingRow[];
};

export const createWriting = async (input: {
  userId: string | null;
  title: string;
  content: string;
  genre: string;
}) => {
  const uid = requireUserId(input.userId);
  const { data, error } = await supabase
    .from("writings")
    .insert({ user_id: uid, title: input.title, content: input.content, genre: input.genre })
    .select("*")
    .single();
  if (error) throw error;
  return data as WritingRow;
};

export const updateWritingRow = async (
  id: string,
  input: { userId: string | null; title?: string; content?: string; genre?: string }
) => {
  const uid = requireUserId(input.userId);
  const { data, error } = await supabase
    .from("writings")
    .update({
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.content !== undefined ? { content: input.content } : {}),
      ...(input.genre !== undefined ? { genre: input.genre } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", uid)
    .select("*")
    .single();
  if (error) throw error;
  return data as WritingRow;
};

export const deleteWritingRow = async (id: string, userId: string | null) => {
  const uid = requireUserId(userId);
  const { error } = await supabase.from("writings").delete().eq("id", id).eq("user_id", uid);
  if (error) throw error;
};

// Diaries
export const listDiaries = async (userId: string | null) => {
  const uid = requireUserId(userId);
  const { data, error } = await supabase
    .from("diaries")
    .select("*")
    .eq("user_id", uid)
    .order("date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as DiaryRow[];
};

export const createDiary = async (input: {
  userId: string | null;
  date: string;
  content: string;
  mood?: string | null;
}) => {
  const uid = requireUserId(input.userId);
  const { data, error } = await supabase
    .from("diaries")
    .insert({ user_id: uid, date: input.date, content: input.content, mood: input.mood ?? null })
    .select("*")
    .single();
  if (error) throw error;
  return data as DiaryRow;
};

export const updateDiaryRow = async (
  id: string,
  input: { userId: string | null; date?: string; content?: string; mood?: string | null }
) => {
  const uid = requireUserId(input.userId);
  const { data, error } = await supabase
    .from("diaries")
    .update({
      ...(input.date !== undefined ? { date: input.date } : {}),
      ...(input.content !== undefined ? { content: input.content } : {}),
      ...(input.mood !== undefined ? { mood: input.mood } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", uid)
    .select("*")
    .single();
  if (error) throw error;
  return data as DiaryRow;
};

export const deleteDiaryRow = async (id: string, userId: string | null) => {
  const uid = requireUserId(userId);
  const { error } = await supabase.from("diaries").delete().eq("id", id).eq("user_id", uid);
  if (error) throw error;
};

// Goals
export const listGoals = async (userId: string | null) => {
  const uid = requireUserId(userId);
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as GoalRow[];
};

export const createGoal = async (input: {
  userId: string | null;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
}) => {
  const uid = requireUserId(input.userId);
  const { data, error } = await supabase
    .from("goals")
    .insert({
      user_id: uid,
      title: input.title,
      description: input.description ?? "",
      target_date: input.targetDate,
      progress: input.progress ?? 0,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as GoalRow;
};

export const updateGoalRow = async (
  id: string,
  input: { userId: string | null; title?: string; description?: string; targetDate?: string; progress?: number }
) => {
  const uid = requireUserId(input.userId);
  const payload: any = {
    updated_at: new Date().toISOString(),
  };
  if (input.title !== undefined) payload.title = input.title;
  if (input.description !== undefined) payload.description = input.description;
  if (input.targetDate !== undefined) payload.target_date = input.targetDate;
  if (input.progress !== undefined) payload.progress = input.progress;

  const { data, error } = await supabase
    .from("goals")
    .update(payload)
    .eq("id", id)
    .eq("user_id", uid)
    .select("*")
    .single();
  if (error) throw error;
  return data as GoalRow;
};

export const deleteGoalRow = async (id: string, userId: string | null) => {
  const uid = requireUserId(userId);
  const { error } = await supabase.from("goals").delete().eq("id", id).eq("user_id", uid);
  if (error) throw error;
};

// Transcriptions
export const listTranscriptions = async (userId: string | null) => {
  const uid = requireUserId(userId);
  const { data, error } = await supabase
    .from("transcriptions")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as TranscriptionRow[];
};

export const createTranscription = async (input: {
  userId: string | null;
  originalText: string;
  transcribedText: string;
  reflection: string;
}) => {
  const uid = requireUserId(input.userId);
  const { data, error } = await supabase
    .from("transcriptions")
    .insert({
      user_id: uid,
      original_text: input.originalText,
      transcribed_text: input.transcribedText,
      reflection: input.reflection ?? "",
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as TranscriptionRow;
};

// Admin messages (user scope only for now)
export const listAdminMessages = async (userId: string | null) => {
  const uid = requireUserId(userId);
  const { data, error } = await supabase
    .from("admin_messages")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as AdminMessageRow[];
};

export const createAdminMessage = async (input: {
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  title: string;
  content: string;
}) => {
  const uid = requireUserId(input.userId);
  const { data, error } = await supabase
    .from("admin_messages")
    .insert({
      user_id: uid,
      user_name: input.userName,
      user_email: input.userEmail,
      title: input.title,
      content: input.content,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as AdminMessageRow;
};

export const updateAdminMessageRow = async (
  id: string,
  input: { userId: string | null; title?: string; content?: string }
) => {
  const uid = requireUserId(input.userId);
  const { data, error } = await supabase
    .from("admin_messages")
    .update({
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.content !== undefined ? { content: input.content } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", uid)
    .select("*")
    .single();
  if (error) throw error;
  return data as AdminMessageRow;
};

export const deleteAdminMessageRow = async (id: string, userId: string | null) => {
  const uid = requireUserId(userId);
  const { error } = await supabase
    .from("admin_messages")
    .delete()
    .eq("id", id)
    .eq("user_id", uid);
  if (error) throw error;
};
