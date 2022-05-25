import { configureStore } from '@reduxjs/toolkit'
import favoriteSlice from './features/favoriteSlice'
import cartSlice from './features/cartSlice'
import orderSlice from './features/orderSlice'
import authSlice from './features/authSlice'
import userSlice from './features/userSlice'


const store = configureStore({
  reducer: {
    favorite: favoriteSlice,
    cart: cartSlice,
    order: orderSlice,
    auth: authSlice,
    user: userSlice,
  }
})

export default store