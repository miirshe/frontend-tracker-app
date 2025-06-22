import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const setToken = (token) => {
  localStorage.setItem("token", token)
}

export const getToken = () => {
  return localStorage.getItem("token")
}

export const removeToken = () => {
  localStorage.removeItem("token")
}

export const saveUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user))
}

export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"))
}

export const removeUser = () => {
  localStorage.removeItem("user")
}