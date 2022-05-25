import axios from 'axios'

const sendContact = (data) => {
    return axios({
        method: 'POST',
        url: '/contact/add',
        data
    })
}

export { sendContact }