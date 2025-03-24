export const updateUserDetails = userDetails => {
  return {
    type: 'UPDATE_USER',
    payload: userDetails
  }
}