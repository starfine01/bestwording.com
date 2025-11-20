// 인증 관련 유틸리티 함수
export interface User {
  id: string;
  email: string;
  name: string;
  isMember: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'bestwording_user';
const USERS_KEY = 'bestwording_users';

// 사용자 목록 가져오기
const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// 사용자 목록 저장
const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// 현재 로그인한 사용자 가져오기
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem(STORAGE_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

// 로그인
export const login = (email: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  }
  return null;
};

// 회원가입
export const register = (email: string, password: string, name: string): User => {
  const users = getUsers();
  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    isMember: true,
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  saveUsers(users);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  return newUser;
};

// 로그아웃
export const logout = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

// 회원탈퇴
export const deleteAccount = (userId: string): void => {
  const users = getUsers();
  const filteredUsers = users.filter(u => u.id !== userId);
  saveUsers(filteredUsers);
  logout();
};

// 비회원 모드 확인
export const isGuestMode = (): boolean => {
  return !getCurrentUser();
};

// 관리자 확인
export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  // 관리자: 정성화, starfine@naver.com
  return user.email === "starfine@naver.com" || user.name === "정성화";
};


