import axiosJWT from '../config/axiosConfig'

const addOrderToDB = (data) => {
    return axiosJWT({
        method: 'POST',
        url: '/order/add',
        data
    })
}

export {addOrderToDB}