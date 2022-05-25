import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AuthGuard = ({ children }) => {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn)
    if (!isLoggedIn) {
        return <Navigate to='/auth/login' />
    }
    return <>{children}</>
}

export default AuthGuard
