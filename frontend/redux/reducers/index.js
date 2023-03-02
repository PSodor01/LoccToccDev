import { combineReducers } from 'redux'
import { user } from './user'
import { users } from './users'
import { nflGames, ncaafGames, mlbGames, ncaabGames, nbaGames, nhlGames, mmaGames, eplGames, futureGames, formula1Teams, formula1Races, formula1Drivers, formula1Rankings} from './games'

const Reducers = combineReducers({
    userState: user,
    usersState: users,
    nflGamesState: nflGames,
    nbaGamesState: nbaGames,
    nhlGamesState: nhlGames,
    ncaafGamesState: ncaafGames,
    mlbGamesState: mlbGames,
    ncaabGamesState: ncaabGames,
    mmaGamesState: mmaGames,
    futureGamesState: futureGames,

    eplGamesState: eplGames,
    formula1TeamsState: formula1Teams,
    formula1RacesState: formula1Races,
    formula1DriversState: formula1Drivers,
    formula1RankingsState: formula1Rankings,
    
})

export default Reducers