// src/app/models/user.model.ts
export interface User {
  id: string;
  username: string;
  email: string;
  password?: string; // Optional for security reasons
  firstName?: string;
  lastName?: string;
}
