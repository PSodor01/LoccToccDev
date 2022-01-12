import { combineReducers } from 'redux'
import { user } from './user'
import { users } from './users'
import { nflGames, ncaafGames, mlbGames, nbaGames, ncaabGames, eplGames, nhlGames } from './games'

const Reducers = combineReducers({
    userState: user,
    usersState: users,
    nflGamesState: nflGames,
    ncaafGamesState: ncaafGames,
    mlbGamesState: mlbGames,
    nbaGamesState: nbaGames,
    ncaabGamesState: ncaabGames,
    eplGamesState: eplGames,
    nhlGamesState: nhlGames,
})

export default Reducers