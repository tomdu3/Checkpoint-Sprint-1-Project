import { getUserIds } from "./storage.js";

// Set up user selection dropdown
export function setupUserDropdown(renderBookmarks) {
  const userElement = document.getElementById("user_Id");

  if (!userElement) return;

  const userIds = getUserIds();

  userIds.forEach((userId) => {
    const option = document.createElement("option");
    option.value = userId;
    option.textContent = `User ${userId}`;
    userElement.appendChild(option);
  });

  // Fetch and display bookmarks when user selection changes
  userElement.addEventListener("change", (event) => {
    const selectedUserId = event.target.value;

    if (selectedUserId) {
      clearUserError();
    }

    renderBookmarks(selectedUserId);
  });

  if (userElement.value) {
    renderBookmarks(userElement.value);
  }
}

// clear error message after selecting a user
function clearUserError() {
  const userError = document.querySelector("#user-error");
  if (userError) {
    userError.textContent = "";
  }
}