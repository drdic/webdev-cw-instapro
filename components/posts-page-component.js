We need to apply the SUGGESTED EDIT to the ORIGINAL CODE. The original code has hardcoded HTML for posts. The suggested edit replaces that with dynamic rendering from the `posts` array, using `formatDate`, `escapeHtml`, and `getLikeImage` functions. The output should be the complete modified file, preserving all comments (including TODO comments) but implementing the dynamic rendering. Also note that the original code had a comment about using date-fns, which is replaced by the custom `formatDate`. We should keep the existing import lines, and the function signature. The suggested edit removes the hardcoded HTML and adds the dynamic rendering. We'll output the code exactly as per the suggested edit, but with the original comments preserved (the /* @TODO: ... */ comments are there, but the suggested edit includes a new TODO comment in getLikeImage). We'll include the new functions and the updated appHtml. Also note that the original code had a console.log statement, which is kept. We'll output the entire modified content.

Thus, the final answer is the code block containing the modified file.```javascript
import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";

export function renderPostsPageComponent({ appEl }) {
  // @TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "только что";
    if (minutes < 60) return `${minutes} минут назад`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} часов назад`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} дней назад`;
    return date.toLocaleDateString("ru-RU");
  };

  const escapeHtml = (str) => {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const getLikeImage = (post) => {
    // @TODO: позже будем проверять, лайкнул ли текущий пользователь
    return "./assets/images/like-not-active.svg";
  };
  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
        ${posts
          .map(
            (post) => `
                  <li class="post">
            <div class="post-header" data-user-id="${escapeHtml(post.user.id)}">
              <img src="${escapeHtml(
                post.user.imageUrl ||
                  "https://i.pravatar.cc/40?u=" + post.user.id
              )}" class="post-header__user-image">
              <p class="post-header__user-name">${escapeHtml(
                post.user.name
              )}</p>
                    </div>
                    <div class="post-image-container">
              <img class="post-image" src="${escapeHtml(post.imageUrl)}">
                    </div>
                    <div class="post-likes">
              <button data-post-id="${escapeHtml(post.id)}" class="like-button">
                <img src="${getLikeImage(post)}">
                      </button>
                      <p class="post-likes-text">
                Нравится: <strong>${post.likes.length}</strong>
                      </p>
                    </div>
                    <p class="post-text">
              <span class="user-name">${escapeHtml(post.user.name)}</span>
              ${escapeHtml(post.description)}
                    </p>
                    <p class="post-date">
              ${formatDate(post.createdAt)}
                    </p>
                  </li>
        `
          )
          .join("")}
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
}

