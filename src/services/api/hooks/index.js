import { useReducer } from "react";
import axios from "axios";
import reducer, { initialState } from "./reducer/api-reducer";
import { fetching, success, error } from "./actions/api-actions";

const ApiRequest = (endpoint, { verb = "get", params = {} } = {}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const makeRequest = async () => {
    dispatch(fetching());
    try {
      const response = await axios[verb](endpoint, params);
      dispatch(success(response));
    } catch (e) {
      dispatch(error(e));
    }
  };

  return [state, makeRequest];
};

export default ApiRequest;
