import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { sendVerifyCode } from '../../../api/recover'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { BsXLg } from 'react-icons/bs'
import Loading from '../../../components/loading/Loading'
import styles from './send.module.scss'
import { BackButton, SubmitButton } from '../../../components/button/buttonStore'


const Send = () => {

    useEffect(() => {
        document.title = 'Recover | WELLS'
    }, [])
    const user = useSelector(state => state.user)
    const loading = useSelector(state => state.loading)
    const { email, username } = user
    const [recoverInfo, setRecoverInfo] = useState(null)
    const navigate = useNavigate()

    const formSubmit = async (event) => {
        event.preventDefault()
        try {
            const res = await sendVerifyCode({
                email,
                username
            })
            setRecoverInfo(res.data)
            navigate('/auth/recover/verify-code')
        } catch (err) {
            if (err.response.status < 500) {
                setRecoverInfo(err.response.data)
            } else {
                console.error(err.response)
            }
        }
    }


    return (
        <>
            <form onSubmit={formSubmit} className={clsx(styles.modal)}>
                <div className={clsx(styles.wrapper)}>
                    <div className={clsx(styles.title)}>
                        <h1>Send code via email</h1>
                    </div>
                    <div className={clsx(styles.user)}>
                        <div className={clsx(styles.profilePic)} style={{ backgroundImage: `url(${user.profilePhoto})` }}></div>
                        <p>{user.email}</p>
                    </div>
                    <div className={clsx(styles.des)}>
                        <p>	We'll send a code via this email to recover account</p>
                    </div>
                    <div className={clsx(styles.recoverInfo)}>
                        {recoverInfo && <p>{recoverInfo}</p>}
                    </div>
                    <SubmitButton className={styles.verify} disabled={loading}>
                        {loading ? <Loading /> : 'Continue'}
                    </SubmitButton>
                    <BackButton />
                    <div className={clsx(styles.existAcc)}>
                        <span>Create an account?</span>
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

export default Send