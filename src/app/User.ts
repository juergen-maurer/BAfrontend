// src/app/models/user.model.ts
export interface User {
  email: string;
  password?: string; // Optional for security reasons
  firstName?: string;
  lastName?: string;
}
