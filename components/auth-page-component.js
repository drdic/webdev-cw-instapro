import { loginUser, registerUser } from "../api.js";
import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAuthPageComponent({ appEl, setUser }) {
  let isLoginMode = true;
  let imageUrl = "";

  const renderForm = () => {
    const appHtml = `
      <div class="container py-3">
          <div class="header-container"></div>
          <div class="row justify-content-center">
              <div class="col-12 col-md-6 col-lg-4">
                  <div class="card shadow-sm">
                      <div class="card-body">
                          <h3 class="card-title text-center fs-2 fw-semibold mb-4">
                            ${
                              isLoginMode
                                ? "Вход в Instapro"
                                : "Регистрация в Instapro"
                            }
                          </h3>
                          <div class="d-flex flex-column gap-3">
                              ${
                                !isLoginMode
                                  ? `
                                  <div class="upload-image-container"></div>
                                  <input type="text" id="name-input" class="form-control" placeholder="Имя" />
                                  `
                                  : ""
                              }
                              <input type="text" id="login-input" class="form-control" placeholder="Логин" />
                              <input type="password" id="password-input" class="form-control" placeholder="Пароль" />
                              <div id="form-error" class="text-danger small"></div>
                              <button class="btn btn-primary w-100" id="login-button">${
                                isLoginMode ? "Войти" : "Зарегистрироваться"
                              }</button>
                          </div>
                          <div class="text-center mt-4">
                            <p class="mb-0">
                              ${isLoginMode ? "Нет аккаунта?" : "Уже есть аккаунт?"}
                              <button class="btn btn-link p-0 align-baseline" id="toggle-button">
                                ${isLoginMode ? "Зарегистрироваться." : "Войти."}
                              </button>
                            </p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>    
    `;

    appEl.innerHTML = appHtml;

    const setError = (message) => {
      appEl.querySelector("#form-error").textContent = message;
    };

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: uploadImageContainer,
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }

    document.getElementById("login-button").addEventListener("click", () => {
      setError("");

      if (isLoginMode) {
        const login = document.getElementById("login-input").value;
        const password = document.getElementById("password-input").value;

        if (!login) {
          alert("Введите логин");
          return;
        }

        if (!password) {
          alert("Введите пароль");
          return;
        }

        loginUser({ login, password })
          .then((user) => {
            setUser(user.user);
          })
          .catch((error) => {
            console.warn(error);
            setError(error.message);
          });
      } else {
        const login = document.getElementById("login-input").value;
        const name = document.getElementById("name-input").value;
        const password = document.getElementById("password-input").value;

        if (!name) {
          alert("Введите имя");
          return;
        }

        if (!login) {
          alert("Введите логин");
          return;
        }

        if (!password) {
          alert("Введите пароль");
          return;
        }

        if (!imageUrl) {
          alert("Не выбрана фотография");
          return;
        }

        registerUser({ login, password, name, imageUrl })
          .then((user) => {
            setUser(user.user);
          })
          .catch((error) => {
            console.warn(error);
            setError(error.message);
          });
      }
    });

    document.getElementById("toggle-button").addEventListener("click", () => {
      isLoginMode = !isLoginMode;
      renderForm();
    });
  };

  renderForm();
}
