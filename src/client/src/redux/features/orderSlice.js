import { createSlice } from '@reduxjs/toolkit'


const initialState = JSON.parse(localStorage.getItem('order')) || {
    order: [],
    total: 0
}
const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        orderAdd(state, action) {
            localStorage.setItem('order', JSON.stringify(action.payload))
            return action.payload
        },
        orderRemove(state, action) {
            localStorage.removeItem('order')
            return initialState
        }
    }
})

export default orderSlice.reducer
export const { orderAdd, orderRemove } = orderSlice.actions