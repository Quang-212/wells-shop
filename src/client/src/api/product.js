import axios from 'axios'
import axiosJWT from '../config/axiosConfig.js'

const getAllWithPagination = (query) => {
    return axios({
        method: 'GET',
        url: `product?${query}`
    })
}
const getAllProducts = () => {
    return axiosJWT({
        method: 'GET',
        url: '/product/all'
    })
}
const getOneById = (id) => {
    return axios({
        method: 'GET',
        url: `/product/${id}`
    })
}
const addProduct = (data) => {
    return axiosJWT({
        method: 'POST',
        url: '/product/add',
        data
    })
}
export { getAllWithPagination, getOneById, getAllProducts, addProduct }