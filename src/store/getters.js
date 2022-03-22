const getters = {
  avatar: state => state.user.avatar != '' ? state.user.avatar : localStorage.getItem('avatar'),
}
export default getters
