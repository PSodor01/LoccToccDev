import { combineReducers } from 'redux'
import { user } from './user'
import { users } from './users'
import { games } from './games'

const Reducers = combineReducers({
    userState: user,
    usersState: users,
    gamesState: games,
})

export default Reducers