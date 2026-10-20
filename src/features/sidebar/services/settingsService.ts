import { Profile, UpdateProfileValues } from "../types/profile";

const API_URL = "/api";

async function updateUser(
  id: string,
  changes: UpdateProfileValues,
): Promise<Profile> {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

async function deleteUser(userId: string) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "DELETE",
  });

  if (response.ok) return;
  const data = await response.json().catch(() => null);
  throw new Error(data?.message);
}

const SettingsService = {
  updateUser,
  deleteUser,
};

export default SettingsService;
