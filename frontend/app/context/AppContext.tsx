"use client"

export const user_service = "http://localhost:5000";
export const chat_service = "http://localhost:5002";

export interface User {
 _id: string;
 name: string;
 email: string;
}