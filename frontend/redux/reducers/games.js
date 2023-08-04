import { NFL_GAMES_STATE_CHANGE, 
    NCAAF_GAMES_STATE_CHANGE, 
    NCAAB_GAMES_STATE_CHANGE, 
    MLB_GAMES_STATE_CHANGE, 
    MMA_GAMES_STATE_CHANGE,
    FUTURE_GAMES_STATE_CHANGE,
    TEAM_LOGOS_STATE_CHANGE,
    FORMULA1_TEAMS_STATE_CHANGE,
    FORMULA1_RACES_STATE_CHANGE,
    FORMULA1_DRIVERS_STATE_CHANGE,
    FORMULA1_RANKINGS_STATE_CHANGE,
    NHL_GAMES_STATE_CHANGE, 
    NBA_GAMES_STATE_CHANGE, 
    WNBA_GAMES_STATE_CHANGE, 
    EPL_GAMES_STATE_CHANGE,
    GOLF_GAMES_STATE_CHANGE,
    BLOG_DETAILS_STATE_CHANGE,
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
    wnbaGames: [],
    futureGames: [],
    eplGames: [],
    formula1Teams: [],
    formula1Drivers: [],
    formula1Races: [],
    formula1Rankings: [],
    golfGames: [],
    teamLogos: [],
    blogDetails:[],
}

export const nflGames = (state = initialState, action) => {
    switch (action.type) {
        case NFL_GAMES_STATE_CHANGE:
            return { ...state, loading: false, nflGames: action.nflGames };
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}

export const ncaafGames = (state = initialState, action) => {
    switch (action.type) {
        case NCAAF_GAMES_STATE_CHANGE:
            return { ...state, loading: false, ncaafGames: action.ncaafGames };
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}

export const ncaabGames = (state = initialState, action) => {
    switch (action.type) {
        case NCAAB_GAMES_STATE_CHANGE:
            return { ...state, loading: false, ncaabGames: action.ncaabGames };
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}

export const mlbGames = (state = initialState, action) => {
    switch (action.type) {
        case MLB_GAMES_STATE_CHANGE:
            return { ...state, loading: false, mlbGames: action.mlbGames };
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}

export const nbaGames = (state = initialState, action) => {
    switch (action.type) {
        case NBA_GAMES_STATE_CHANGE:
            return { ...state, loading: false, nbaGames: action.nbaGames };
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}

export const wnbaGames = (state = initialState, action) => {
    switch (action.type) {
        case WNBA_GAMES_STATE_CHANGE:
            return { ...state, loading: false, wnbaGames: action.wnbaGames };
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}

export const nhlGames = (state = initialState, action) => {
    switch (action.type) {
        case NHL_GAMES_STATE_CHANGE:
            return { ...state, loading: false, nhlGames: action.nhlGames };
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}

export const futureGames = (state = initialState, action) => {
    switch (action.type) {
        case FUTURE_GAMES_STATE_CHANGE:
            return { ...state, loading: false, futureGames: action.futureGames };
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}

export const teamLogos = (state = initialState, action) => {
    switch (action.type) {
        case TEAM_LOGOS_STATE_CHANGE:
            return { ...state, loading: false, teamLogos: action.teamLogos };
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}

export const blogDetails = (state = initialState, action) => {
    switch (action.type) {
        case BLOG_DETAILS_STATE_CHANGE:
            return {
                ...state,
                blogDetails: action.blogDetails
            }
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}

export const golfGames = (state = initialState, action) => {
    switch (action.type) {
        case GOLF_GAMES_STATE_CHANGE:
            return { ...state, loading: false, golfGames: action.golfGames };
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}

export const eplGames = (state = initialState, action) => {
    switch (action.type) {
        case EPL_GAMES_STATE_CHANGE:
            return { ...state, loading: false, eplGames: action.eplGames };
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}

export const formula1Teams = (state = initialState, action) => {
    switch (action.type) {
        case FORMULA1_TEAMS_STATE_CHANGE:
            return { ...state, loading: false, formula1Teams: action.fromula1Teams };
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}

export const formula1Races = (state = initialState, action) => {
    switch (action.type) {
        case FORMULA1_RACES_STATE_CHANGE:
            return { ...state, loading: false, formula1Races: action.formula1Races };
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}

export const formula1Drivers = (state = initialState, action) => {
    switch (action.type) {
        case FORMULA1_DRIVERS_STATE_CHANGE:
            return { ...state, loading: false, formula1Drivers: action.formula1Drivers };
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}

export const formula1Rankings = (state = initialState, action) => {
    switch (action.type) {
        case FORMULA1_RANKINGS_STATE_CHANGE:
            return { ...state, loading: false, formula1Rankings: action.formula1Rankings };
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}


export const mmaGames = (state = initialState, action) => {
    switch (action.type) {
        case MMA_GAMES_STATE_CHANGE:
            return { ...state, loading: false, mmaGames: action.mmaGames };
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
} 


