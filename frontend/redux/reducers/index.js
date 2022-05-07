import { combineReducers } from 'redux'
import { user } from './user'
import { users } from './users'
import { nflGames, ncaafGames, mlbGames, nbaGames, ncaabGames, eplGames, nhlGames, mmaGames, golfGames, futureGames} from './games'

const Reducers = combineReducers({
    userState: user,
    usersState: users,
    nflGamesState: nflGames,
    ncaafGamesState: ncaafGames,
    mlbGamesState: mlbGames,
    ncaabGamesState: ncaabGames,
    nbaGamesState: nbaGames,
    eplGamesState: eplGames,
    nhlGamesState: nhlGames,
    mmaGamesState: mmaGames,
    golfGamesState: golfGames,
    futureGamesState: futureGames,
})

export default Reducers