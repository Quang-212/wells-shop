import axios from 'axios'

const signupUserCheck = (data) => {
    return axios({
        method: 'POST',
        url: '/auth/check-user',
        data
    })
}
const signupSendVerifyCode = (data) => {
    return axios({
        method: 'POST',
        url: '/auth/send-verify-code',
        data
    })
}
const createAccount = (data) => {
    return axios({
        method: 'POST',
        url: '/auth/verify-and-register',
        data
    })
}


export { signupUserCheck, signupSendVerifyCode, createAccount }