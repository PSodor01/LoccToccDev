import { combineReducers } from 'redux'
import { user } from './user'
import { users } from './users'
import { nflGames, ncaafGames, mlbGames, nbaGames } from './games'

const Reducers = combineReducers({
    userState: user,
    usersState: users,
    nflGamesState: nflGames,
    ncaafGamesState: ncaafGames,
    mlbGamesState: mlbGames,
    nbaGamesState: nbaGames,
})

export default Reducers