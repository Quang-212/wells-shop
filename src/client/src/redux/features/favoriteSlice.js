import { createSlice } from "@reduxjs/toolkit"

const initialState = JSON.parse(localStorage.getItem('fav')) || []

const favoriteSlice = createSlice({
    name: 'favorite',
    initialState,
    reducers: {
        favoritesAdd: (state, action) => {
            state.push(action.payload)
        },
        favAddFromServer(state, action) {
            localStorage.setItem('fav', JSON.stringify(action.payload))
            return action.payload
        },
        favoritesDelete(state, action) {
            return state.filter(e => e.id !== action.payload)
        },
        favoritesRemove(state, action) {
            return initialState
        }
    }
})
export const { favoritesAdd, favAddFromServer, favoritesRemove, favoritesDelete } = favoriteSlice.actions
export default favoriteSlice.reducer