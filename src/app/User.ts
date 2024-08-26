// src/app/models/user.model.ts
export interface User {
  id?:number;
  email: string;
  password?: string; // Optional for security reasons
  firstName?: string;
  lastName?: string;
}
