import { combineReducers } from 'redux'
import { user } from './user'
import { users } from './users'
import { nflGames, ncaafGames, mlbGames } from './games'

const Reducers = combineReducers({
    userState: user,
    usersState: users,
    nflGamesState: nflGames,
    ncaafGamesState: ncaafGames,
    mlbGamesState: mlbGames,
})

export default Reducers