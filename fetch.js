const BASE_URL = "https://hacker-news.firebaseio.com/v0/";

//fetching data
export async function fetchingData(data) {
  // if (VERBOSE >= 2) {
  //     console.log("Fetching data");
  // }
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
export async function fetchingPosts(id) {
  const post = await fetchingData(`item/${id}.json`);
  // if (VERBOSE >= 1) {
  //     console.log(post);
  // }
  return post;
}

export async function getIdsArray(theme) {
  const response = await fetch(BASE_URL + theme);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();
  return data;
}
