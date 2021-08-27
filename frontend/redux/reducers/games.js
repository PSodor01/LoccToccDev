import { NFL_GAMES_STATE_CHANGE, NCAAF_GAMES_STATE_CHANGE, MLB_GAMES_STATE_CHANGE, CLEAR_DATA } from "../constants"

const initialState = {
    nflGames: [],
    ncaafGames: [],
    mlbGames: [],
}

export const nflGames = (state = initialState, action) => {
    switch (action.type) {
        case NFL_GAMES_STATE_CHANGE:
            return {
                ...state,
                nflGames: action.nflGames
            }
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}

export const ncaafGames = (state = initialState, action) => {
    switch (action.type) {
        case NCAAF_GAMES_STATE_CHANGE:
            return {
                ...state,
                ncaafGames: action.ncaafGames
            }
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}

export const mlbGames = (state = initialState, action) => {
    switch (action.type) {
        case MLB_GAMES_STATE_CHANGE:
            return {
                ...state,
                mlbGames: action.mlbGames
            }
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}
