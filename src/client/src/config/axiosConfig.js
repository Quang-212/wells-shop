
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { toast } from 'react-toastify'
import { addToken, logout } from '../redux/features/authSlice'
import { favoritesRemove } from '../redux/features/favoriteSlice'
import { cartRemove } from '../redux/features/cartSlice'
import { loginUpdate } from '../redux/features/authSlice'

// axios.defaults.baseURL = 'https://wells-shop.herokuapp.com'
axios.defaults.baseURL = 'http://localhost:8080'
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.timeout = 60000

let store
export const injectStore = _store => {
    store = _store
}

const axiosJWT = axios.create()

axiosJWT.defaults.withCredentials = true
axiosJWT.interceptors.request.use(async (config) => {

    const accessToken = store.getState().auth.accessToken
    config
        .headers = {
        'Authorization': `Bearer ${accessToken}`
    }
    const now = new Date()
    const expiresTime = jwt_decode(accessToken)
    if (expiresTime.exp * 1000 < now.getTime()) {
        try {
            if (store.getState().auth.user.provider === "system"
                && store.getState().auth.isLoggedIn === 1
            ) {
                const result = await axios({
                    method: 'POST',
                    url: '/auth/refreshToken',
                    withCredentials: true
                })
                config.headers = {
                    'Authorization': `Bearer ${result.data}`
                }
                store.dispatch(addToken(result.data))
            }
        } catch (err) {
            (async () => {
                if (err.response?.status !== 500) {
                    await store.dispatch(logout())
                    toast.warn("Your session has expired!", {
                        position: toast.POSITION.TOP_CENTER
                    })
                    store.dispatch(cartRemove())
                    store.dispatch(favoritesRemove())
                    store.dispatch(loginUpdate(0))
                } else {
                    console.log(err.response)
                }
            })()
        }
    }
    return config
}, (err) => {
    return Promise.reject(err)
})

export default axiosJWT
