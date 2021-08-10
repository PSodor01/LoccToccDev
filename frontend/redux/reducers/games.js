import { GAMES_STATE_CHANGE, CLEAR_DATA } from "../constants"

const initialState = {
    games: [],
}

export const games = (state = initialState, action) => {
    switch (action.type) {
        case GAMES_STATE_CHANGE:
            return {
                ...state,
                games: action.games
            }
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}
