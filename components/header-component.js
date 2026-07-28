import { goToPage, logout, user } from "../index.js";
import { ADD_POSTS_PAGE, AUTH_PAGE, POSTS_PAGE } from "../routes.js";

export function renderHeaderComponent({ element }) {
  element.innerHTML = `
  <div class="d-flex justify-content-between align-items-center border-bottom py-3 px-3 mb-3">
      <h1 class="logo fs-3 fw-bold m-0" style="cursor: pointer;">instapro</h1>
      <button class="btn p-0 border-0 bg-transparent add-or-login-button">
      ${
        user
          ? `<div title="Добавить пост" class="add-post-sign"></div>`
          : "Войти"
      }
      </button>
      ${
        user
          ? `<button title="${user.name}" class="btn p-0 border-0 bg-transparent logout-button text-end" style="width: 130px;">Выйти</button>`
          : ""
      }  
  </div>
  `;

  element
    .querySelector(".add-or-login-button")
    .addEventListener("click", () => {
      if (user) {
        goToPage(ADD_POSTS_PAGE);
      } else {
        goToPage(AUTH_PAGE);
      }
    });

  element.querySelector(".logo").addEventListener("click", () => {
    goToPage(POSTS_PAGE);
  });

  element.querySelector(".logout-button")?.addEventListener("click", logout);

  return element;
}