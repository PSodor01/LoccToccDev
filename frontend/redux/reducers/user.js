import { USER_STATE_CHANGE, 
    ALL_USERS_STATE_CHANGE, 
    ALL_POSTS_STATE_CHANGE, 
    USER_FOLLOWING_STATE_CHANGE,
    USER_NOTIFICATIONS_STATE_CHANGE,
    LIKES_STATE_CHANGE, 
    FADES_STATE_CHANGE, 
    USER_BLOCKING_STATE_CHANGE, 
    CLEAR_DATA } from "../constants"

const initialState = {
    currentUser: [],
    following: [],
    userNotifications: [],
    blocking: [],
    liked: [],
    faded: [],
    allUsers: [],
    allPosts: [],
}

export const user = (state = initialState, action) => {
    switch (action.type) {
        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser
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
        case USER_NOTIFICATIONS_STATE_CHANGE:
            return {
                ...state,
                userNotifications: action.userNotifications
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
        case ALL_POSTS_STATE_CHANGE:
            return {
                ...state,
                allPosts: action.allPosts
            }
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}