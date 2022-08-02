import { combineReducers } from 'redux'
import { user } from './user'
import { users } from './users'
import { nflGames, ncaafGames, mlbGames, ncaabGames, nhlGames, mmaGames, futureGames, formula1Teams, formula1Races, formula1Drivers, formula1Rankings} from './games'

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
    formula1TeamsState: formula1Teams,
    formula1RacesState: formula1Races,
    formula1DriversState: formula1Drivers,
    formula1RankingsState: formula1Rankings,
})

export default Reducers