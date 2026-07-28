import { renderHeaderComponent } from "./header-component.js";
import { user, posts, goToPage } from "../index.js";
import { USER_POSTS_PAGE } from "../routes.js";
import { getPostsByUser, likePost, dislikePost } from "../api.js";

export function renderUserPostsPageComponent({ appEl, token }) {
  const userId = posts.length > 0 ? posts[0].user.id : null;

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

  const isPostLikedByMe = (post) => {
    return post.isLiked === true;
  };

  const getLikeImage = (post) => {
    return isPostLikedByMe(post)
      ? "./assets/images/like-active.svg"
      : "./assets/images/like-not-active.svg";
  };

  const userInfoHtml =
    posts.length > 0
      ? `
      <div class="row mb-4">
        <div class="col-12 d-flex align-items-center gap-3">
          <img src="${escapeHtml(
            posts[0].user.imageUrl ||
              "https://i.pravatar.cc/70?u=" + posts[0].user.id
          )}" class="rounded-circle" width="70" height="70" style="object-fit: cover;">
          <h2 class="fs-1 fw-semibold m-0">${escapeHtml(posts[0].user.name)}</h2>
        </div>
      </div>
    `
      : `<p class="text-muted">У пользователя пока нет постов</p>`;

  const appHtml = `
    <div class="container py-3">
      <div class="header-container"></div>
      ${userInfoHtml}
      <div class="row">
        ${posts
          .map(
            (post) => `
          <div class="col-12 mb-4">
            <div class="card">
              <div class="card-header d-flex align-items-center gap-2 bg-white border-0" data-user-id="${escapeHtml(post.user.id)}" style="cursor: pointer;">
                <img src="${escapeHtml(
                  post.user.imageUrl ||
                    "https://i.pravatar.cc/40?u=" + post.user.id
                )}" class="rounded-circle" width="40" height="40" style="object-fit: cover;">
                <span class="fw-semibold">${escapeHtml(post.user.name)}</span>
              </div>
              <div class="bg-light d-flex justify-content-center">
                <img class="img-fluid" src="${escapeHtml(post.imageUrl)}" style="max-width: 500px; width: 100%;">
              </div>
              <div class="card-body">
                <div class="d-flex align-items-center gap-1 mb-2">
                  <button data-post-id="${escapeHtml(post.id)}" class="like-button btn p-0 border-0 bg-transparent">
                    <img src="${getLikeImage(post)}" width="30" height="30">
                  </button>
                  <span class="fw-semibold">Нравится: <strong>${post.likes.length}</strong></span>
                </div>
                <p class="card-text">
                  <span class="fw-semibold">${escapeHtml(post.user.name)}</span>
                  ${escapeHtml(post.description)}
                </p>
                <p class="card-text text-muted small">
                  ${formatDate(post.createdAt)}
                </p>
              </div>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".card-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  for (let likeButton of document.querySelectorAll(".like-button")) {
    likeButton.addEventListener("click", () => {
      if (!user) {
        alert("Авторизуйтесь, чтобы ставить лайки");
        return;
      }

      const postId = likeButton.dataset.postId;
      const postIndex = posts.findIndex((p) => p.id === postId);
      if (postIndex === -1) return;

      const isLiked = isPostLikedByMe(posts[postIndex]);

      const likePromise = isLiked
        ? dislikePost({ token, postId })
        : likePost({ token, postId });

      likePromise
        .then((updatedPost) => {
          posts[postIndex] = updatedPost;
          renderUserPostsPageComponent({ appEl, token });
        })
        .catch((error) => {
          console.error(error);
          alert("Не удалось обновить лайк");
        });
    });
  }
}