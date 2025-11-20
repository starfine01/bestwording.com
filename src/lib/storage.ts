// 로컬 스토리지 기반 데이터 관리
export interface Writing {
  id: string;
  userId: string | null; // null이면 비회원
  title: string;
  content: string;
  genre: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transcription {
  id: string;
  userId: string | null;
  originalText: string;
  transcribedText: string;
  reflection: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  userId: string | null;
  title: string;
  description: string;
  targetDate: string;
  progress: number; // 0-100
  createdAt: string;
}

export interface Diary {
  id: string;
  userId: string | null;
  date: string;
  content: string;
  mood?: string;
  createdAt: string;
}

export interface Award {
  id: string;
  userId: string | null;
  title: string;
  description: string;
  period: string; // 'weekly' | 'monthly' | 'yearly' | 'hall-of-fame'
  rank: number;
  createdAt: string;
}

export interface AdminMessage {
  id: string;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
  adminReply?: string;
  adminReplyAt?: string;
}

const STORAGE_KEYS = {
  writings: 'bestwording_writings',
  transcriptions: 'bestwording_transcriptions',
  goals: 'bestwording_goals',
  diaries: 'bestwording_diaries',
  awards: 'bestwording_awards',
  adminMessages: 'bestwording_admin_messages',
};

// Writings
export const getWritings = (userId?: string | null): Writing[] => {
  const writings = localStorage.getItem(STORAGE_KEYS.writings);
  const allWritings: Writing[] = writings ? JSON.parse(writings) : [];
  return userId !== undefined 
    ? allWritings.filter(w => w.userId === userId)
    : allWritings;
};

export const saveWriting = (writing: Omit<Writing, 'id' | 'createdAt' | 'updatedAt'>): Writing => {
  const writings = getWritings();
  const newWriting: Writing = {
    ...writing,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  writings.push(newWriting);
  localStorage.setItem(STORAGE_KEYS.writings, JSON.stringify(writings));
  return newWriting;
};

export const updateWriting = (id: string, updates: Partial<Writing>): Writing | null => {
  const writings = getWritings();
  const index = writings.findIndex(w => w.id === id);
  if (index === -1) return null;
  
  writings[index] = {
    ...writings[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.writings, JSON.stringify(writings));
  return writings[index];
};

export const deleteWriting = (id: string): void => {
  const writings = getWritings();
  const filtered = writings.filter(w => w.id !== id);
  localStorage.setItem(STORAGE_KEYS.writings, JSON.stringify(filtered));
};

// Transcriptions
export const getTranscriptions = (userId?: string | null): Transcription[] => {
  const transcriptions = localStorage.getItem(STORAGE_KEYS.transcriptions);
  const allTranscriptions: Transcription[] = transcriptions ? JSON.parse(transcriptions) : [];
  return userId !== undefined
    ? allTranscriptions.filter(t => t.userId === userId)
    : allTranscriptions;
};

export const saveTranscription = (transcription: Omit<Transcription, 'id' | 'createdAt'>): Transcription => {
  const transcriptions = getTranscriptions();
  const newTranscription: Transcription = {
    ...transcription,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  transcriptions.push(newTranscription);
  localStorage.setItem(STORAGE_KEYS.transcriptions, JSON.stringify(transcriptions));
  return newTranscription;
};

// Goals
export const getGoals = (userId?: string | null): Goal[] => {
  const goals = localStorage.getItem(STORAGE_KEYS.goals);
  const allGoals: Goal[] = goals ? JSON.parse(goals) : [];
  return userId !== undefined
    ? allGoals.filter(g => g.userId === userId)
    : allGoals;
};

export const saveGoal = (goal: Omit<Goal, 'id' | 'createdAt'>): Goal => {
  const goals = getGoals();
  const newGoal: Goal = {
    ...goal,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  goals.push(newGoal);
  localStorage.setItem(STORAGE_KEYS.goals, JSON.stringify(goals));
  return newGoal;
};

export const updateGoal = (id: string, updates: Partial<Goal>): Goal | null => {
  const goals = getGoals();
  const index = goals.findIndex(g => g.id === id);
  if (index === -1) return null;
  
  goals[index] = { ...goals[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.goals, JSON.stringify(goals));
  return goals[index];
};

export const deleteGoal = (id: string): void => {
  const goals = getGoals();
  const filtered = goals.filter(g => g.id !== id);
  localStorage.setItem(STORAGE_KEYS.goals, JSON.stringify(filtered));
};

// Diaries
export const getDiaries = (userId?: string | null): Diary[] => {
  const diaries = localStorage.getItem(STORAGE_KEYS.diaries);
  const allDiaries: Diary[] = diaries ? JSON.parse(diaries) : [];
  return userId !== undefined
    ? allDiaries.filter(d => d.userId === userId)
    : allDiaries;
};

export const saveDiary = (diary: Omit<Diary, 'id' | 'createdAt'>): Diary => {
  const diaries = getDiaries();
  const newDiary: Diary = {
    ...diary,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  diaries.push(newDiary);
  localStorage.setItem(STORAGE_KEYS.diaries, JSON.stringify(diaries));
  return newDiary;
};

export const updateDiary = (id: string, updates: Partial<Diary>): Diary | null => {
  const diaries = getDiaries();
  const index = diaries.findIndex(d => d.id === id);
  if (index === -1) return null;
  
  diaries[index] = { ...diaries[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.diaries, JSON.stringify(diaries));
  return diaries[index];
};

export const deleteDiary = (id: string): void => {
  const diaries = getDiaries();
  const filtered = diaries.filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEYS.diaries, JSON.stringify(filtered));
};

// Awards
export const getAwards = (userId?: string | null, period?: string): Award[] => {
  const awards = localStorage.getItem(STORAGE_KEYS.awards);
  const allAwards: Award[] = awards ? JSON.parse(awards) : [];
  let filtered = userId !== undefined
    ? allAwards.filter(a => a.userId === userId)
    : allAwards;
  
  if (period) {
    filtered = filtered.filter(a => a.period === period);
  }
  
  return filtered.sort((a, b) => a.rank - b.rank);
};

export const saveAward = (award: Omit<Award, 'id' | 'createdAt'>): Award => {
  const awards = getAwards();
  const newAward: Award = {
    ...award,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  awards.push(newAward);
  localStorage.setItem(STORAGE_KEYS.awards, JSON.stringify(awards));
  return newAward;
};

// Admin Messages
export const getAdminMessages = (userId?: string | null): AdminMessage[] => {
  const messages = localStorage.getItem(STORAGE_KEYS.adminMessages);
  const allMessages: AdminMessage[] = messages ? JSON.parse(messages) : [];
  return userId !== undefined
    ? allMessages.filter(m => m.userId === userId)
    : allMessages;
};

export const saveAdminMessage = (message: Omit<AdminMessage, 'id' | 'createdAt' | 'updatedAt' | 'isRead'>): AdminMessage => {
  const messages = getAdminMessages();
  const newMessage: AdminMessage = {
    ...message,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRead: false,
  };
  messages.push(newMessage);
  localStorage.setItem(STORAGE_KEYS.adminMessages, JSON.stringify(messages));
  return newMessage;
};

export const updateAdminMessage = (id: string, updates: Partial<AdminMessage>): AdminMessage | null => {
  const messages = getAdminMessages();
  const index = messages.findIndex(m => m.id === id);
  if (index === -1) return null;
  
  messages[index] = {
    ...messages[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.adminMessages, JSON.stringify(messages));
  return messages[index];
};

export const deleteAdminMessage = (id: string): void => {
  const messages = getAdminMessages();
  const filtered = messages.filter(m => m.id !== id);
  localStorage.setItem(STORAGE_KEYS.adminMessages, JSON.stringify(filtered));
};


