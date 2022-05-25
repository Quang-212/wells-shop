import { createSlice } from '@reduxjs/toolkit'

const initialState = JSON.parse(localStorage.getItem('cart')) || []

const productIndex = (state, action) => {
    let result = null
    state.forEach((ele, i) => {
        if (ele.id === action.payload.id) {
            result = i
        }
    })
    return result
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        cartAdd: {
            reducer: (state, action) => {

                let res = productIndex(state, action)
                if (res === null || state[res].size !== action.payload.size) {
                    state.push(action.payload)
                } else {
                    state[res].count++
                }
            },
            prepare: (productInfor) => {
                let count = 1
                return {
                    payload: {
                        id: productInfor.id,
                        count,
                        size: productInfor.size,
                        price: productInfor.price,
                        image: productInfor.image,
                        name: productInfor.name
                    }
                }
            }

        },
        cartAddFromServer(state, action) {
            localStorage.setItem('cart', JSON.stringify(action.payload))
            return action.payload
        }
        ,
        cartDelete(state, action) {
            state.splice(action.payload.index, 1)
        },
        cartSelectDelete(state, action) {
            return state.filter((product, i) => {
                return !action.payload.includes(i)
            })
        },
        cartQuantityPick(state, action) {
            let res = productIndex(state, action)
            state[res].count = action.payload.quantity
        },
        cartRemove(state, action) {
            return []
        }
    }
})
export const { cartAdd, cartDelete, cartSelectDelete, cartRemove, cartAddFromServer, cartQuantityPick } = cartSlice.actions
export default cartSlice.reducer