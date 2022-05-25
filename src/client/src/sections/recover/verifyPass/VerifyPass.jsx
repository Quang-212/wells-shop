import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { sendVerifyCode, verifyCode } from '../../../api/recover'
import { useDispatch, useSelector } from 'react-redux'
import { add } from '../../../redux/features/userSlice'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { BsXLg } from 'react-icons/bs'
import Loading from '../../../components/loading/Loading'
import styles from './verifyPass.module.scss'
import { BackButton, SubmitButton } from '../../../components/button/buttonStore'
import { toast } from 'react-toastify'


const VerifyPass = () => {

    useEffect(() => {
        document.title = 'Recover | WELLS'
    }, [])
    const user = useSelector(state => state.user)
    const loading = useSelector(state => state.loading)
    const dispatch = useDispatch()
    const [countdown, setCountdown] = useState(5)
    const [recoverInfo, setRecoverInfo] = useState(null)
    const navigate = useNavigate()

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
            const res = await toast.promise(
                verifyCode(data),
                {
                    pending: "Verifying...",
                    success: "Change your password now.",
                    error: {
                        render({ data }) {
                            return `${data.response.data}`
                        }
                    }
                }
            )
            dispatch(add({
                ...user,
                isVerified: true
            }))
            setRecoverInfo(res.data)
            navigate('/auth/recover/change-password')
        } catch (err) {
            if (err.response.status !== 500) {
                setRecoverInfo(err.response.data)
            } else {
                console.error(err.response)
            }
        }
    }

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
        const { email, displayName } = user
        try {
            const res = await toast.promise(
                sendVerifyCode({
                    email,
                    displayName
                }),
                {
                    pending: 'Code is sending...',
                    success: 'Check your email.',
                    error: 'Something wrong, try again!'
                }
            )
            setRecoverInfo(res.data)
            setCountdown(5)
        } catch (err) {
            if (err.response.status < 500) {
                setRecoverInfo(err.response.data)
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
                        <h1>Verify code</h1>
                    </div>
                    <div className={clsx(styles.formField)}>
                        <input type="text" placeholder='Code' autoComplete="off" {...register('verifyCode')} />
                        {errors.verifyCode && <p className={clsx(styles.err)}>{errors.verifyCode.message}</p>}
                    </div>
                    <div className={clsx(styles.des)}>
                        <p>	Please enter code from your verify email</p>
                    </div>
                    {user.displayName
                        ?
                        <div className={clsx(styles.recoverInfo)}>
                            {(countdown > 0) ? <p>Verify code is expires in: {countdown}m</p> : <p>Verify code is expired</p>}
                        </div>
                        :
                        null
                    }
                    <div className={clsx(styles.recoverInfo)}>
                        {recoverInfo && <p>{recoverInfo}</p>}
                    </div>
                    <button
                        type="button"
                        className={clsx(styles.sendCode)}
                        onClick={handleSendCode}
                    >
                        Send another code
                    </button>
                    <SubmitButton className={styles.verify} disabled={loading}>
                        {loading ? <Loading /> : 'Verify'}
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

export default VerifyPass