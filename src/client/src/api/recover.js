import axios from 'axios'

const searchUserByEmail = (data) => {
    return axios({
        method: 'POST',
        url: '/auth/recover/search',
        data
    })
}
const sendVerifyCode = (data) => {
    return axios({
        method: 'POST',
        url: '/auth/recover/send',
        data
    })
}
const verifyCode = (data) => {
    return axios({
        method: 'POST',
        url: '/auth/recover/verify',
        data
    })
}
const resetPassword = (data) => {
    return axios({
        method: 'POST',
        url: '/auth/recover/change-password',
        data
      })
}
export { searchUserByEmail, sendVerifyCode, verifyCode, resetPassword }