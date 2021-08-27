import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_LIKES_STATE_CHANGE, CLEAR_DATA } from "../constants"

const initialState = {
    currentUser: null,
    posts: [],
    following: [],
}

export const user = (state = initialState, action) => {
    switch (action.type) {
        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser
            }
        case USER_POSTS_STATE_CHANGE:
            return {
                ...state,
                posts: action.posts
            }

        case USER_FOLLOWING_STATE_CHANGE:
            return {
                ...state,
                following: action.following
            }
        case USERS_LIKES_STATE_CHANGE:
            return {
                ...state,
                posts: state.posts.map(post => post.id == action.postId ? 
                    {...post, currentUserLike: action.currentUserLike} :
                    post)
            }
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}