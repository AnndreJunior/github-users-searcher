const GITHUB_API = "https://api.github.com";

const searchUserForm = document.querySelector("#search-user-form");
const usernameInput = document.querySelector("#username");

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

searchUserForm.addEventListener("submit", async (event) => {
  event.preventDefault();

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
    alert(error.message);
  }
});
