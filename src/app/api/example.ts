/**
 * Hướng dẫn thêm API mới
 * 
 * Format chuẩn:
 * 1. Define types cho request/response
 * 2. Dùng post/get/put/del từ client.ts
 * 3. Export function async để components sử dụng
 */

import { post, get, put } from "./client";

// ============ EXAMPLE: USER API ============

// 1. Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  plan?: string;
  createdAt: string;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// 2. API Functions
export async function getProfile(): Promise<User> {
  return get<User>("/user/profile");
}

export async function updateProfile(data: UpdateProfileRequest): Promise<User> {
  return put<User>("/user/profile", data);
}

export async function changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
  return post("/user/change-password", data);
}

// ============ EXAMPLE: CONVERSATION API ============

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export async function listConversations(): Promise<Conversation[]> {
  return get<Conversation[]>("/conversation");
}

export async function getConversation(id: string): Promise<Conversation> {
  return get<Conversation>(`/conversation/${id}`);
}

export async function sendMessage(conversationId: string, content: string): Promise<Message> {
  return post<Message>(`/conversation/${conversationId}/message`, { content });
}

// ============ EXAMPLE: USAGE IN COMPONENT ============

/**
import { useEffect, useState } from "react";
import { getProfile, ApiError } from "@/app/api";

export function ProfilePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        }
      }
    })();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Loading...</div>;
  return <div>Welcome, {user.name}</div>;
}
*/
