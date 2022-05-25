import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { BsXLg } from 'react-icons/bs'
import { resetPassword } from '../../../api/recover'
import { remove } from '../../../redux/features/userSlice'
import Loading from '../../../components/loading/Loading'
import styles from './changePass.module.scss'
import { BackButton, SubmitButton } from '../../../components/button/buttonStore'
import { toast } from 'react-toastify'


const ChangePassword = () => {

  useEffect(() => {
    document.title = 'Reset password | WELLS'
  }, [])
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const loading = useSelector(state => state.loading)
  const { email, isVerified } = user
  const [resetInfo, setResetInfo] = useState(null)
  const navigate = useNavigate()

  const schema = yup.object().shape({
    password: yup
      .string()
      .required('Please enter password')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Minimum of 8 characters, at least one letter and one number'),
    passwordConfirm: yup
      .string()
      .required('Please enter password again')
      .oneOf([yup.ref('password'), null], 'Password must match')
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })
  const formSubmit = async (data) => {
    try {
      await toast.promise(
        resetPassword({
          email,
          isVerified,
          password: data.password
        }),
        {
          pending: 'Checking...',
          success: 'Reset password success. Login now',
          error: 'Something wrong here!'
        }
      )

      dispatch(remove())
      navigate('/auth/login', { replace: true })
    } catch (err) {
      if (err.response.status < 500) {
        setResetInfo(err.response.data)
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
            <h1>Reset your password</h1>
          </div>
          <div className={clsx(styles.formField)}>
            <input type="password" placeholder='New password' autoComplete="off" {...register('password')} />
            {errors.password && <p className={clsx(styles.err)}>{errors.password.message}</p>}
          </div>
          <div className={clsx(styles.formField)}>
            <input type="password" placeholder='New confirm password' autoComplete="off" {...register('passwordConfirm')} />
            {errors.passwordConfirm && <p className={clsx(styles.err)}>{errors.passwordConfirm.message}</p>}
          </div>
          <div className={clsx(styles.resetInfo)}>
            {resetInfo && <p>{resetInfo}</p>}
          </div>
          <SubmitButton className={styles.verify} disabled={loading}>
            {loading ? <Loading /> : 'Reset Password'}
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

export default ChangePassword