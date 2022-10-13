import { NFL_GAMES_STATE_CHANGE, 
    NCAAF_GAMES_STATE_CHANGE, 
    NCAAB_GAMES_STATE_CHANGE, 
    MLB_GAMES_STATE_CHANGE, 
    MMA_GAMES_STATE_CHANGE,
    FUTURE_GAMES_STATE_CHANGE,
    FORMULA1_TEAMS_STATE_CHANGE,
    FORMULA1_RACES_STATE_CHANGE,
    FORMULA1_DRIVERS_STATE_CHANGE,
    FORMULA1_RANKINGS_STATE_CHANGE,
    NHL_GAMES_STATE_CHANGE, 
    NBA_GAMES_STATE_CHANGE, 
    EPL_GAMES_STATE_CHANGE,
    CLEAR_DATA 
} from "../constants"

const initialState = {
    nflGames: [],
    ncaafGames: [],
    mlbGames: [],
    ncaabGames: [],
    mmaGames: [],
    nhlGames: [],
    nbaGames: [],
    eplGames: [],
    futureGames: [],
    formula1Teams: [],
    formula1Drivers: [],
    formula1Races: [],
    formula1Rankings: [],
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

export const nhlGames = (state = initialState, action) => {
    switch (action.type) {
        case NHL_GAMES_STATE_CHANGE:
            return {
                ...state,
                nhlGames: action.nhlGames
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

export const futureGames = (state = initialState, action) => {
    switch (action.type) {
        case FUTURE_GAMES_STATE_CHANGE:
            return {
                ...state,
                futureGames: action.futureGames
            }
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}

export const formula1Teams = (state = initialState, action) => {
    switch (action.type) {
        case FORMULA1_TEAMS_STATE_CHANGE:
            return {
                ...state,
                formula1Teams: action.formula1Teams
            }
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}

export const formula1Races = (state = initialState, action) => {
    switch (action.type) {
        case FORMULA1_RACES_STATE_CHANGE:
            return {
                ...state,
                formula1Races: action.formula1Races
            }
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}

export const formula1Drivers = (state = initialState, action) => {
    switch (action.type) {
        case FORMULA1_DRIVERS_STATE_CHANGE:
            return {
                ...state,
                formula1Drivers: action.formula1Drivers
            }
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}

export const formula1Rankings = (state = initialState, action) => {
    switch (action.type) {
        case FORMULA1_RANKINGS_STATE_CHANGE:
            return {
                ...state,
                formula1Rankings: action.formula1Rankings
            }
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}

export const mmaGames = (state = initialState, action) => {
    switch (action.type) {
        case MMA_GAMES_STATE_CHANGE:
            return {
                ...state,
                mmaGames: action.mmaGames
            }
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
} 


