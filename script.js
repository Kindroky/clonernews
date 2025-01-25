//CONSTANTS
const VERBOSE = 1;
const BASE_URL = "https://hacker-news.firebaseio.com/v0/";
const POSTS = getIdsArray();
const POSTS_CONTAINER = document.getElementById("posts-container");

//fetching data
async function fetchingPostIds() {
  try {
    const response = await fetch(`${BASE_URL}topstories.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}
async function getIdsArray() {
  const postIds = await fetchingPostIds();
  if (VERBOSE >= 1) console.log("Post IDs:", postIds);
  return postIds;
}

//Add 10 posts to the container
