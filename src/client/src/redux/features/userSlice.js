import { createSlice } from "@reduxjs/toolkit"


const initialState = {}

const userSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        add: (state, action) => {
            return action.payload
        },
        remove: (state, action) => {
            return initialState
        }
    }
})


export const { add, remove } = userSlice.actions
export default userSlice.reducer