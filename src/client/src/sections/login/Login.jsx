import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { BsXLg } from 'react-icons/bs'
import { login } from '../../redux/features/authSlice'
import styles from './login.module.scss'
import { SubmitButton, NormalButton } from '../../components/button/buttonStore'


const Login = () => {

    const serverUrl = 'https://wells-shop.herokuapp.com'
    // const serverUrl = 'http://localhost:8080'
    useEffect(() => {
        document.title = 'Login'
    }, [])
    const schema = yup.object().shape({
        email: yup
            .string()
            .required('Please enter username'),
        password: yup
            .string()
            .required('Please enter password')
    })

    const dispatch = useDispatch()
    const loading = useSelector(state => state.loading)
    const [loginInfo, setLoginInfo] = useState(null)
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })

    const formSubmit = async (data) => {
        try {
            await toast.promise(
                dispatch(login(data)).unwrap(),
                {
                    pending: 'Login...',
                    success: 'Welcome to WELLS shop',
                    error: 'Something wrong, take a look!'
                }
            )
            navigate('/', { replace: true })
        } catch (err) {
            if (err.status < 500) {
                setLoginInfo(err.data)
            } else {
                console.log(err)
            }
        }
    }
    const facebookLogin = () => {
        window.open(`${serverUrl}/auth/facebook`, '_self')
    }
    const googleLogin = () => {
        window.open(`${serverUrl}/auth/google`, '_self')
    }
    return (
        <>
            <form onSubmit={handleSubmit(formSubmit)} className={clsx(styles.modal)}>

                <div className={clsx(styles.wrapper)}>
                    <div className={clsx(styles.title)}>
                        <h1>Login</h1>
                    </div>
                    <div className={clsx(styles.formField)}>
                        <input type="text" placeholder='Email' autoComplete="on" {...register('email')} />
                        {errors.email && <p className={clsx(styles.err)}>{errors.email.message}</p>}
                    </div>
                    <div className={clsx(styles.formField)}>
                        <input type="password" placeholder='Password' autoComplete="off" {...register('password')} />
                        {errors.password && <p className={clsx(styles.err)}>{errors.password.message}</p>}
                    </div>
                    <div className={clsx(styles.forgotPass)}>
                        <Link to='/auth/recover'>
                            <span>Forgot Password?</span>
                        </Link>
                    </div>
                    <div className={clsx(styles.loginInfo)}>
                        {loginInfo && <p>{loginInfo}</p>}
                    </div>
                    <SubmitButton disabled={loading} className={styles.login}>
                        Login
                    </SubmitButton>
                    <span className={clsx(styles.ortherLogin)}>Or login with</span>
                    <div className={clsx(styles.ortherAuth)}>
                        <NormalButton
                            onClick={googleLogin}
                            className={[styles.social, styles.socialgg]}
                        >
                            Google
                        </NormalButton>
                        <NormalButton
                            onClick={facebookLogin}
                            className={[styles.social, styles.socialfb]}
                        >
                            Facebook
                        </NormalButton>
                    </div>

                    <div className={clsx(styles.createAcc)}>
                        <span>Don't have account?</span>
                        <Link to='/auth/signup'>Signup Now</Link>
                    </div>
                </div>

            </form>
            <div className={clsx(styles.close)} onClick={() => { navigate('/') }}>
                <BsXLg className={clsx(styles.icon)} />
            </div>
        </>
    )
}

export default Login