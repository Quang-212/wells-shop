import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { signupSendVerifyCode, createAccount } from '../../../api/auth'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { BsXLg } from 'react-icons/bs'
import Loading from '../../../components/loading/Loading'
import styles from './verifyEmail.module.scss'
import { BackButton, SubmitButton } from '../../../components/button/buttonStore'
import { toast } from 'react-toastify'


const VerifyEmail = () => {

    useEffect(() => {
        document.title = 'Email verify | WELLS'
    }, [])
    const userData = useSelector(state => state.user)
    const loading = useSelector(state => state.loading)
    const [info, setInfo] = useState(null)
    const [countdown, setCountdown] = useState(5)
    const navigate = useNavigate()
    useEffect(() => {
        const myCountdown = setInterval(() => {
            setCountdown(prev => {
                if (prev > 0) {
                    return prev - 1
                } else {
                    return 0
                }
            })
        }, 60000)
        return () => {
            clearInterval(myCountdown)
        }
    }, [])

    const handleSendCode = async () => {
        const { email, displayName } = userData
        try {
            const res = await toast.promise(
                signupSendVerifyCode({
                    email,
                    displayName
                }),
                {
                    pending: 'Code is sending...',
                    success: 'Check your email.',
                    error: 'Something wrong, try again!'
                }
            )
            setInfo(res.data)
            setCountdown(5)
        } catch (err) {
            if (err.response.status < 500) {
                setInfo(err.response.data)
            } else {
                console.log(err.response)
            }
        }
    }
    const schema = yup.object().shape({
        verifyCode: yup
            .number()
            .required('Please enter your verify code')
            .typeError('Verify code must be a number')
    })
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })

    const formSubmit = async (data) => {
        try {
            await toast.promise(
                createAccount({
                    ...userData,
                    verifyCode: data.verifyCode
                }),
                {
                    pending: "Server checking...",
                    success: "Your account has been created. Get started!",
                    error: {
                        render({ data }) {

                            return `${data.response.data}`
                        }
                    }
                }
            )
            navigate('/auth/login')
        } catch (err) {
            if (err.response.status < 500) {
                setInfo(err.response.data)
            } else {
                console.log(err.response)
            }
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(formSubmit)} className={clsx(styles.modal)}>
                <div className={clsx(styles.wrapper)}>
                    <div className={clsx(styles.title)}>
                        <h1>Verify email</h1>
                    </div>
                    <div className={clsx(styles.formField)}>
                        <input type="text" placeholder='Code' autoComplete="off" {...register('verifyCode')} />
                        {errors.verifyCode && <p className={clsx(styles.err)}>{errors.verifyCode.message}</p>}
                    </div>
                    <div className={clsx(styles.des)}>
                        <p>	Please enter verify code from your email</p>
                    </div>
                    {userData.displayName
                        ?
                        <div className={clsx(styles.info)}>
                            {(countdown > 0) ? <p>Verify code is expires in: {countdown}m</p> : <p>Verify code is expired</p>}
                        </div>
                        :
                        null
                    }
                    <div className={clsx(styles.info)}>
                        {info && <p>{info}</p>}
                    </div>
                    <button
                        type="button"
                        className={clsx(styles.sendCode)}
                        onClick={handleSendCode}
                    >
                        Send another code
                    </button>
                    <SubmitButton className={styles.verify} disabled={loading}>
                        {loading ? <Loading /> : 'Confirm'}
                    </SubmitButton>
                    <BackButton />
                </div>

            </form>
            <div className={clsx(styles.close)} onClick={() => { navigate('/') }}>
                <BsXLg className={clsx(styles.icon)} />
            </div>
        </>
    )
}

export default VerifyEmail