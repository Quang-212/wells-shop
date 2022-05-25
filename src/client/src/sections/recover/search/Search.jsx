import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { searchUserByEmail } from '../../../api/recover'
import { useDispatch, useSelector } from 'react-redux'
import { add } from '../../../redux/features/userSlice'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { BsXLg } from 'react-icons/bs'
import Loading from '../../../components/loading/Loading'
import styles from './search.module.scss'
import { BackButton, SubmitButton } from '../../../components/button/buttonStore'


const Signup = () => {

  useEffect(() => {
    document.title = 'Recover | WELLS'
  }, [])
  const dispatch = useDispatch()
  const loading = useSelector(state => state.loading)
  const [recoverInfo, setRecoverInfo] = useState(null)
  const navigate = useNavigate()

  const schema = yup.object().shape({
    email: yup
      .string()
      .required('Please enter email')
      .matches(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, 'Email incorrect format')
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })
  const formSubmit = async (data) => {
    try {
      const response = await searchUserByEmail(data)
      dispatch(add(response.data))
      navigate('/auth/recover/send')
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
      <form onSubmit={handleSubmit(formSubmit)} className={clsx(styles.modal)}>
        <div className={clsx(styles.wrapper)}>
          <div className={clsx(styles.title)}>
            <h1>Account Recover</h1>
          </div>

          <div className={clsx(styles.formField)}>
            <input type="email" placeholder='Email' autoComplete="off" {...register('email')} />
            {errors.email && <p className={clsx(styles.err)}>{errors.email.message}</p>}
          </div>
          <div className={clsx(styles.des)}>
            <p>	Please enter your email address to search for your account.</p>
          </div>
          <div className={clsx(styles.recoverInfo)}>
            {recoverInfo && <p>{recoverInfo}</p>}
          </div>
          <SubmitButton className={styles.verify} disabled={loading}>
            {loading ? <Loading /> : 'Verify'}
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

export default Signup