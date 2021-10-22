import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, ALL_USERS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, LIKES_STATE_CHANGE, FADES_STATE_CHANGE, USER_BLOCKING_STATE_CHANGE, USERS_LIKES_STATE_CHANGE, CLEAR_DATA } from "../constants"

const initialState = {
    currentUser: null,
    posts: [],
    following: [],
    blocking: [],
    liked: [],
    faded: [],
    allUsers: [],
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
        case USER_BLOCKING_STATE_CHANGE:
            return {
                ...state,
                blocking: action.blocking
            }
        case LIKES_STATE_CHANGE:
            return {
                ...state,
                liked: action.liked
            }
        case FADES_STATE_CHANGE:
            return {
                ...state,
                faded: action.faded
            }
        case ALL_USERS_STATE_CHANGE:
            return {
                ...state,
                allUsers: action.allUsers
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