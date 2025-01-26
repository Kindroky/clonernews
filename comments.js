import { fetchingPosts } from "./fetch.js";

// Affiche un message d'erreur et un bouton pour retourner à la page principale
function loadError() {
  const errorMsg = document.createElement("p");
  errorMsg.innerHTML =
    "You can't be here without specifying a post. Please go back to main page.";

  const indexBtn = document.createElement("button");
  indexBtn.onclick = window.history.back;

  document.body.appendChild(errorMsg);
  document.body.appendChild(indexBtn);
}

// Crée et retourne un élément de commentaire
function createCommentElement(comment) {
  const commentDiv = document.createElement("div");
  commentDiv.className = "comment";
  commentDiv.innerHTML = `
    <p class="info">
      by <strong>${comment.by}</strong> 
      on ${new Date(comment.time * 1000).toLocaleString()}
    </p>
    <p class="comment-text">${comment.text}</p>
  `;

  if (comment.kids && comment.kids.length > 0) {
    const viewRepliesBtn = document.createElement("button");
    viewRepliesBtn.textContent = "View Replies";
    viewRepliesBtn.onclick = () => {
      window.location.href = `?post=${comment.id}`;
    };
    commentDiv.appendChild(viewRepliesBtn);
  }

  return commentDiv;
}

// Crée et retourne un élément de chargement
function createLoadingDiv() {
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "loading";
  loadingDiv.innerHTML = "<p>Loading comments...</p>";
  return loadingDiv;
}

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.size === 0 || !urlParams.has("post")) {
    loadError();
    return;
  }

  let post = await fetchingPosts(Number(urlParams.get("post")));

  const postDiv = document.createElement("div");
  postDiv.className = "post";
  postDiv.innerHTML = `
    <h2>${post.title}</h2>
    <p>${post.text}</p>
    <p>${post.score} points</p>
    <p>by <strong>${post.by}</strong> on ${new Date(
    post.time * 1000
  ).toLocaleString()}</p>
    <p>URL : <a href="${post.url}" target="_blank">link</a></p>
  `;

  document.body.appendChild(postDiv);

  if (post.kids && post.kids.length > 0) {
    console.log(`Fetching all ${post.kids.length} comments...`);

    const loadingDiv = createLoadingDiv();
    postDiv.appendChild(loadingDiv);

    const commentsDiv = document.createElement("div");
    commentsDiv.id = "commentsDiv";

    await Promise.all(
      post.kids.map(async (commentId) => {
        const comment = await fetchingPosts(commentId);
        const commentElement = createCommentElement(comment);
        commentsDiv.appendChild(commentElement);
      })
    );

    postDiv.removeChild(loadingDiv);
    postDiv.appendChild(commentsDiv);
  }
});
