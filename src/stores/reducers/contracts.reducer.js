const initialState = {
    contracts: []
  }

const contractsReducer = (state = initialState, action) => {
    const { payload } = action
    switch(action.type) {
       case 'UPDATE':
        return {
            ...state,
            contracts: payload
          }
     
       default:
         return state;
     }
  };

  export default contractsReducer