import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from 'axios'


const initialState = {
    isFetching: false,
    isLoggedIn: JSON.parse(localStorage.getItem('logged in')) || 0,
    user: JSON.parse(localStorage.getItem('user')) || {},
    currentRequestId: undefined,
    accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0NTM0NTIzMSIsIm5hbWUiOiJ6ZGZnc2RmZyIsImFkbWluIjpmYWxzZSwiaWF0IjoxNjQ4NTQ2MjY3LCJleHAiOjIzNTY0MzM1M30.9Gvr6RsV8tbe3qUWQWE6SqneChggeZHRdRMtquwn5FU',
}

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue, requestId, getState }) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/auth/login',
            data,
            withCredentials: true
        })
        localStorage.setItem('user', JSON.stringify(res.data.user))
        localStorage.setItem('logged in', 1)
        return res.data
    } catch (err) {
        return rejectWithValue({
            data: err.response.data,
            status: err.response.status
        })
    }
})

export const logout = createAsyncThunk('auth/logout', async (data, { rejectWithValue, requestId, getState }) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/auth/logout',
            withCredentials: true
        })
        localStorage.clear()
        return res.data
    } catch (err) {
        return rejectWithValue({
            data: err.response.data,
            status: err.response.status
        })
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        addToken(state, action) {
            state.accessToken = action.payload
        },
        removeToken(state, action) {
            state.accessToken = initialState.accessToken
        },
        loginUpdate(state, action) {
            localStorage.setItem('logged in', JSON.stringify(action.payload))
            state.isLoggedIn = action.payload
        },
        userLogin(state, action) {
            localStorage.setItem('user', JSON.stringify(action.payload))
            state.user = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state, action) => {
                state.isFetching = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isFetching = false
                state.isLoggedIn = 1
                state.user = action.payload.user
                state.accessToken = action.payload.accessToken
            })
            .addCase(login.rejected, (state, action) => {
                state.isFetching = false
            })
            .addCase(logout.pending, (state, action) => {
                state.isFetching = true
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isFetching = false
                state = initialState
            })
            .addCase(logout.rejected, (state, action) => {
                state.isFetching = false
            })
    }
})

export const { addToken, removeToken, loginUpdate, userLogin } = authSlice.actions
export default authSlice.reducer