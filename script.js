//CONSTANTS
const VERBOSE = 1;
const BASE_URL = "https://hacker-news.firebaseio.com/v0/";
const THEME = "newstories.json";
const POSTS_CONTAINER = document.getElementById("posts-container");

//VARIABLES
let POSTS = getIdsArray();

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
  const postIds = await fetchingData(THEME);
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
    <p>URL : <a href="${post.url}">link</a></p> `;
    POSTS_CONTAINER.appendChild(newPostDiv);
  }
}

add_10_Posts();
