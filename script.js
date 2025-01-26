import { fetchingPosts, getIdsArray } from './fetch.js';

//CONSTANTS
const VERBOSE = 2;
const POSTS_CONTAINER = document.getElementById("posts-container");
const BUTTONS = document.querySelectorAll(".selection");

//VARIABLES
let actual_theme = "beststories.json";
let POSTS = [];

//ON DOCUMENT LOAD
(async function initialize() {
    POSTS = await getIdsArray();
    add_10_Posts();
    verifyNewPost();
})();

async function verifyNewPost() {
    let actualID = await fetchingData("maxitem.json");
    const alertDiv = document.getElementById("alert");
  
    setInterval(async () => {
      try {
        const maxID = await fetchingData("maxitem.json");
        if (actualID !== maxID) {
          alertDiv.style.display = "block";
          actualID = maxID;
        }
      } catch (error) {
        console.error("Error checking for new posts:", error);
      }
    }, 5000);
  }

//Add 10 posts to the container
async function add_10_Posts() {
    if (POSTS.length === 0) {
        POSTS = await getIdsArray();
    }

    const actual_len = POSTS_CONTAINER.children.length;

    const slice = POSTS.slice(actual_len, actual_len + 10);

    //For each new post, add it to the container
    for (const id of slice) {
        const post = await fetchingPosts(id);
        if (VERBOSE >= 2) console.log("Post ID:", post.id);
        const newPostDiv = document.createElement("div");
        newPostDiv.classList.add("post");
        newPostDiv.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.score} points</p>
        <p class='info'>By <strong>${post.by}</strong></p>
        <p class='info'>${new Date(post.time * 1000).toLocaleString()}</p>
        <p class='info'>Type : ${post.type}</p>`;
        newPostDiv.onclick = () => {window.location.href = `post.html?post=${post.id}`};
        POSTS_CONTAINER.appendChild(newPostDiv);
    }
}

BUTTONS.forEach((button) => {
    button.addEventListener("click", async function () {
        POSTS_CONTAINER.innerHTML = "";
        actual_theme = this.id + ".json";
        POSTS = await getIdsArray();
        add_10_Posts();
    });
});

const throttled = _.throttle(add_10_Posts, 2000);
window.onscroll = function () {
    if (
        window.innerHeight + Math.round(window.scrollY) >=
        document.body.offsetHeight
    ) {
        if (VERBOSE >= 2) console.log("Triger bottom page");
        throttled();
    }
};