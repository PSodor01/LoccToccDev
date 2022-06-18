import { combineReducers } from 'redux'
import { user } from './user'
import { users } from './users'
import { nflGames, ncaafGames, mlbGames, ncaabGames, nhlGames, mmaGames, futureGames} from './games'

const Reducers = combineReducers({
    userState: user,
    usersState: users,
    nflGamesState: nflGames,
    ncaafGamesState: ncaafGames,
    mlbGamesState: mlbGames,
    ncaabGamesState: ncaabGames,
    nhlGamesState: nhlGames,
    mmaGamesState: mmaGames,
    futureGamesState: futureGames,
})

export default Reducers