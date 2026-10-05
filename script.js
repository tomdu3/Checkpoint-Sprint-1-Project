import { getUserIds } from "./storage.js";

const userElement = document.getElementById("user_Id");

const userIds = getUserIds();

userIds.forEach((userId) => {
  const options = document.createElement("option");

  options.value = userId;

  options.textContent = `User ${userId}`;

  userElement.appendChild(options);
});
