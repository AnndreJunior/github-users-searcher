const GITHUB_API = "https://api.github.com";

const searchUserForm = document.querySelector("#search-user-form");
const usernameInput = document.querySelector("#username");

const notificationBox = document.getElementById("notification-box");

function clearNotifications() {
  notificationBox.innerHTML = "";
}

function addErrorNotification(error) {
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.classList.add("error-notification");
  notification.setAttribute("role", "alert");

  const closeNotificationBtn = document.createElement("span");
  closeNotificationBtn.classList.add("close-notificaton-btn");
  closeNotificationBtn.setAttribute("role", "button");
  closeNotificationBtn.setAttribute("aria-label", "Fechar");

  const closeNotificationIcon = document.createElement("i");
  closeNotificationIcon.classList.add("bi");
  closeNotificationIcon.classList.add("bi-x-lg");

  closeNotificationBtn.appendChild(closeNotificationIcon);

  notification.innerText = error;
  notification.appendChild(closeNotificationBtn);

  notificationBox.appendChild(notification);
}

async function searchUser(username) {
  const response = await fetch(`${GITHUB_API}/users/${username}`);
  if (response.status === 404)
    throw new Error(`Usuário ${username} não encontrado`);

  const {
    name,
    followers,
    following,
    avatar_url: avatarUrl,
    html_url: profileUrl,
    public_repos: publicRepos,
  } = await response.json();

  return {
    name,
    followers,
    following,
    avatarUrl,
    profileUrl,
    publicRepos,
  };
}

// Buscar perfil do github
searchUserForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearNotifications();

  const username = usernameInput.value;
  if (!username) alert("Preencha o input");

  try {
    const { name, avatarUrl, followers, following, profileUrl, publicRepos } =
      await searchUser(username);

    const userInfoHtml = `
      <header class="article-header">
        <img
          src="${avatarUrl}"
          alt="Foto de perfil"
        />

        <div class="user-details">
          <h1 class="user-name">${name}</h1>
          <a
            href="${profileUrl}"
            target="_blank"
            rel="noopener noreferrer"
            class="github-link"
          >
            @${username}
          </a>
        </div>
      </header>

      <ul>
        <li><strong>${publicRepos}</strong> repositórios públicos</li>
        <li>Seguindo <strong>${following}</strong> usuários</li>
        <li><strong>${followers}</strong> seguidores</li>
      </ul>
    `;

    let userInfoArticle = document.querySelector(".user-info");
    if (!userInfoArticle) {
      userInfoArticle = document.createElement("article");
      userInfoArticle.classList.add("user-info");
      document.body.appendChild(userInfoArticle);
    }

    userInfoArticle.innerHTML = "";
    userInfoArticle.innerHTML = userInfoHtml;
  } catch (error) {
    addErrorNotification(error.message);
  }
});

// Fechar notificações
notificationBox.addEventListener("click", (event) => {
  const closeBtn = event.target.closest(".close-notification-btn");

  if (closeBtn) {
    const notification = closeBtn.closest(".notification");
    if (notification) {
      notification.remove();
    }
  }
});
