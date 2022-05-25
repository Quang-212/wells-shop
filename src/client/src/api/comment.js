import axios from 'axios'
import axiosJWT from '../config/axiosConfig'

const addComment = (data) => {
    return axiosJWT({
        method: 'POST',
        url: `/comment/product`,
        data
    })
}
const getRootComment = (productId) => {
    return axios({
        method: "GET",
        url: `/comment/product/root/${productId}`,
    })
}
const getChildComment = (commentId) => {
    return axios({
        method: "GET",
        url: `/comment/product/child/${commentId}`,
    })
}

export { addComment, getRootComment, getChildComment }