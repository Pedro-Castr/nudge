import { apiFetch } from "@/lib/api";

import { Profile, UpdateProfileValues } from "../types/profile";

const API_URL = "/api";

const updateUser = (id: string, changes: UpdateProfileValues) => {
  apiFetch(`${API_URL}/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });
};

const deleteUser = (userId: string) =>
  apiFetch(`${API_URL}/users/${userId}`, {
    method: "DELETE",
  });

const logOutUser = () =>
  apiFetch(`${API_URL}/session`, {
    method: "DELETE",
  });

const SettingsService = {
  updateUser,
  deleteUser,
  logOutUser,
};

export default SettingsService;
