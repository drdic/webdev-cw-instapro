import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";

  const render = () => {
    const appHtml = `
      <div class="container py-3">
        <div class="header-container"></div>
        <div class="row justify-content-center">
          <div class="col-12 col-md-6">
            <h3 class="text-center fs-2 fw-semibold mb-4">Добавить пост</h3>
            <div class="d-flex flex-column gap-3">
              <div class="upload-image-container"></div>
              <textarea
                class="form-control"
                id="description-input"
                placeholder="Введите описание поста"
                rows="4"
              ></textarea>
              <div id="form-error" class="text-danger small"></div>
              <button class="btn btn-primary w-100" id="add-button">Добавить</button>
            </div>
          </div>
        </div>
      </div>
    `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    renderUploadImageComponent({
      element: document.querySelector(".upload-image-container"),
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl;
      },
    });

    document.getElementById("add-button").addEventListener("click", () => {
      const description = document.getElementById("description-input").value;

      if (!description) {
        alert("Введите описание поста");
        return;
      }

      if (!imageUrl) {
        alert("Загрузите изображение");
        return;
      }

      onAddPostClick({ description, imageUrl });
    });
  };

  render();
}
