export interface User {
  id: string;
  email: string;
  name: string;
  profileImage: string | null;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
