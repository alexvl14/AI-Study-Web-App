export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: User;
  // If we were using JWT, we'd have a token here, but we're using cookies.
}
