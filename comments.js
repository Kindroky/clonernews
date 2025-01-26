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

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.size === 0 || !urlParams.has("post")) {
    loadError();
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
    const commentsDiv = document.createElement("div");
    commentsDiv.id = "commentsDiv";

    /*
        for (let element of getComments(post.kids)) {
            commentsDiv.appendChild(element);
        }
        */

    getAllComments(post.kids, commentsDiv, 0);

    postDiv.removeChild(loadingDiv);
    postDiv.appendChild(commentsDiv);
  }
});

/*
function getComments(comments) {
    let cmtList = [];
    let elementsList = [];

    for (let id of comments) {
        fetchingPosts(id).then(cmtInfo => cmtList.push(cmtInfo));
    }

    // If ID is greater, then comment is newer
    cmtList.sort((cmt1, cmt2) => {
        if (cmt1.id < cmt2.id) {
            return 1;
        }

        if (cmt1.id > cmt2.id) {
            return -1;
        }

        return 0;
    });

    console.log('Comments sorted.');

    console.log(cmtList);

    for (let cmt of cmtList) {
        const comment = document.createElement('div');
        comment.innerHTML = `<h3>${cmt.by}</h3>
        <p>${(cmt.text === '[dead]') ? '[This comment has been deleted]' : cmt.text}</p>
        <p class='info'>${new Date(cmt.time * 1000).toLocaleString()}</p>
        `;
        console.log(comment);
        elementsList.push(comment);
    }

    console.log('Comments created.');

    console.log(elementsList);

    return elementsList;
}
*/

function getAllComments(comments, commentsContainer, currentDepth) {
  const container = document.createElement("div");

  for (let id of comments) {
    fetchingPosts(id).then((cmtInfo) => {
      const comment = document.createElement("div");

      comment.style.marginLeft = String(currentDepth * 20) + "px";

      comment.innerHTML = `<h3>${cmtInfo.by}</h3>
            <p>${
              cmtInfo.text === "[dead]"
                ? "[This comment has been deleted]"
                : cmtInfo.text
            }</p>
            <p class='info'>${new Date(
              cmtInfo.time * 1000
            ).toLocaleString()}</p>
            `;

      if (cmtInfo.kids) {
        getAllComments(
          cmtInfo.kids.sort((cmt1, cmt2) => {
            if (cmt1.id < cmt2.id) {
              return 1;
            }

            if (cmt1.id > cmt2.id) {
              return -1;
            }

            return 0;
          }),
          comment,
          currentDepth + 1
        );
      }

      container.appendChild(comment);
    });
  }

  commentsContainer.appendChild(container);
}
