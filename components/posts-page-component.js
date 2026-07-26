import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { user, posts, goToPage } from "../index.js";
import { getPosts, likePost, dislikePost } from "../api.js";

export function renderPostsPageComponent({ appEl, token }) {
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

  const isPostLikedByMe = (post) => {
    if (!user) return false;
    return post.likes.some((like) => like.id === user.id);
  };

  const getLikeImage = (post) => {
    return isPostLikedByMe(post)
      ? "./assets/images/like-active.svg"
      : "./assets/images/like-not-active.svg";
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
                  "https://i.pravatar.cc/40?u=" + post.user.id,
              )}" class="post-header__user-image">
              <p class="post-header__user-name">${escapeHtml(
                post.user.name,
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
        `,
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

  for (let likeButton of document.querySelectorAll(".like-button")) {
    likeButton.addEventListener("click", () => {
      if (!user) {
        alert("Авторизуйтесь, чтобы ставить лайки");
        return;
      }

      const postId = likeButton.dataset.postId;
      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      const isLiked = isPostLikedByMe(post);

      const likePromise = isLiked
        ? dislikePost({ token, postId })
        : likePost({ token, postId });

      likePromise
        .then(() => getPosts({ token }))
        .then((newPosts) => {
          posts.length = 0;
          posts.push(...newPosts);
          renderPostsPageComponent({ appEl, token });
        })
        .catch((error) => {
          console.error(error);
          alert("Не удалось обновить лайк");
        });
    });
  }
}
