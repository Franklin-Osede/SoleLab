/**
 * User Model
 * Modelo de datos para usuarios
 */
export interface User {
  id: string;
  email: string;
  username: string;
  walletAddress: string | null;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  walletAddress?: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  username: string;
  walletAddress: string | null;
  createdAt: string;
}

