const BASE_URL = "https://hacker-news.firebaseio.com/v0/";

//fetching data
async function fetchingData(data) {
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

export async function getIdsArray() {
    const theme = actual_theme;
    const postIds = await fetchingData(theme);
    //if (VERBOSE >= 1) console.log("Post IDs:", postIds);
    return postIds;
}