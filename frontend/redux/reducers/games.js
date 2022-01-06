import { NFL_GAMES_STATE_CHANGE, NCAAF_GAMES_STATE_CHANGE, NCAAB_GAMES_STATE_CHANGE, MLB_GAMES_STATE_CHANGE, NBA_GAMES_STATE_CHANGE, EPL_GAMES_STATE_CHANGE, CLEAR_DATA } from "../constants"

const initialState = {
    nflGames: [],
    ncaafGames: [],
    mlbGames: [],
    nbaGames: [],
    ncaabGames: [],
    eplGames: [],
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

export const ncaabGames = (state = initialState, action) => {
    switch (action.type) {
        case NCAAB_GAMES_STATE_CHANGE:
            return {
                ...state,
                ncaabGames: action.ncaabGames
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

export const nbaGames = (state = initialState, action) => {
    switch (action.type) {
        case NBA_GAMES_STATE_CHANGE:
            return {
                ...state,
                nbaGames: action.nbaGames
            }
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}

export const eplGames = (state = initialState, action) => {
    switch (action.type) {
        case EPL_GAMES_STATE_CHANGE:
            return {
                ...state,
                eplGames: action.eplGames
            }
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}


