//CONSTANTS
const VERBOSE = 1;
const BASE_URL = "https://hacker-news.firebaseio.com/v0/";
const POSTS_CONTAINER = document.getElementById("posts-container");
const BUTTONS = document.querySelectorAll(".selection");

//VARIABLES
let actual_theme = "beststories.json";
let POSTS = getIdsArray();

//ON DOCUMENT LOAD
add_10_Posts();
verifyNewPost();

BUTTONS.forEach((button) => {
  button.addEventListener("click", function () {
    POSTS_CONTAINER.innerHTML = "";
    actual_theme = this.id + ".json";
    add_10_Posts();
  });
});

//fetching data
async function fetchingData(data) {
  if (VERBOSE >= 2) {
    console.log("Fetching data");
  }
  try {
    const response = await fetch(`${BASE_URL}${data}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}

//fetching post data
async function fetchingPosts(id) {
  const post = await fetchingData(`item/${id}.json`);
  if (VERBOSE >= 1) {
    console.log(post);
  }
  return post;
}

async function getIdsArray() {
  const theme = actual_theme;
  const postIds = await fetchingData(theme);
  if (VERBOSE >= 1) console.log("Post IDs:", postIds);
  return postIds;
}

//Add 10 posts to the container
async function add_10_Posts() {
  if (POSTS.length === 0) {
    POSTS = await getIdsArray();
  }

  const actual_len =
    POSTS_CONTAINER.children.length - 1 > 0
      ? POSTS_CONTAINER.children.length - 1
      : 0;

  const tmp_posts = await POSTS;
  const slice = tmp_posts.slice(actual_len, actual_len + 10);

  //For each new post, add it to the container
  for (const id of slice) {
    const post = await fetchingPosts(id);
    if (VERBOSE >= 2) console.log("Post ID:", post.id);
    const newPostDiv = document.createElement("div");
    newPostDiv.classList.add("post");
    newPostDiv.innerHTML = `
    <h2>${post.title}</h2>
    <p>${post.score} points</p>
    <p>By <strong>${post.by}</strong></p>
    <p>${new Date(post.time * 1000).toLocaleString()}</p>
    <p>URL : <a href="${post.url} target="_blank"">link</a></p> `;
    POSTS_CONTAINER.appendChild(newPostDiv);
  }
}

const throttled = _.throttle(add_10_Posts, 2000);
window.onscroll = function () {
  if (
    window.innerHeight + Math.round(window.scrollY) >
    document.body.offsetHeight
  ) {
    console.log("triggering at the end of page");
    throttled();
  }
};

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
