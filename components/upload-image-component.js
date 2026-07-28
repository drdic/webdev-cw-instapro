import { uploadImage } from "../api.js";

export function renderUploadImageComponent({ element, onImageUrlChange }) {
  let imageUrl = "";

  const render = () => {
    element.innerHTML = `
      <div>
        ${
          imageUrl
            ? `
            <div class="d-flex align-items-center gap-2">
              <img class="rounded" src="${imageUrl}" alt="Загруженное изображение" style="width: 100px; height: 100px; object-fit: cover; border: 1px solid #dee2e6;">
              <button class="btn btn-outline-secondary btn-sm file-upload-remove-button">Заменить фото</button>
            </div>
            `
            : `
            <label class="btn btn-outline-primary w-100 file-upload-label">
              <input type="file" class="file-upload-input" style="display:none" />
              Выберите фото
            </label>
          `
        }
      </div>
    `;

    const fileInputElement = element.querySelector(".file-upload-input");
    fileInputElement?.addEventListener("change", () => {
      const file = fileInputElement.files[0];
      if (file) {
        const labelEl = element.querySelector(".file-upload-label");
        if (labelEl) {
          labelEl.classList.add("disabled");
          labelEl.textContent = "Загружаю файл...";
        }

        uploadImage({ file }).then(({ fileUrl }) => {
          imageUrl = fileUrl;
          onImageUrlChange(imageUrl);
          render();
        });
      }
    });

    element
      .querySelector(".file-upload-remove-button")
      ?.addEventListener("click", () => {
        imageUrl = "";
        onImageUrlChange(imageUrl);
        render();
      });
  };

  render();
}