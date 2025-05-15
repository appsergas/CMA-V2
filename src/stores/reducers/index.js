import { combineReducers } from 'redux'
import userReducer from './user.reducer'
import contractsReducer from './contracts.reducer'
//insert another reducers here to be combined

const reducers = combineReducers({
  userReducer,
  contractsReducer
})

export default reducers
