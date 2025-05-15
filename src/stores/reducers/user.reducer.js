const initialState = {
  userDetails: {}
}

const userReducer = (state = initialState, action) => {
  const { payload } = action
  switch(action.type) {
     case 'UPDATE_USER':
      return {
          ...state,
          userDetails: payload
        }
   
     default:
       return state;
   }
};

export default userReducer