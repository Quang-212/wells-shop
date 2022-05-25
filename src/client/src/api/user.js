import axiosJWT from '../config/axiosConfig.js'

const userCartUpdate = (cart) => {
    return axiosJWT({
        method: 'POST',
        url: '/user/personal-cart',
        data: cart
    })
}
const userFavoriteUpdate = (fav) => {
    return axiosJWT({
        method: 'POST',
        url: '/user/personal-favorites',
        data: fav
    })
}
export { userCartUpdate, userFavoriteUpdate }