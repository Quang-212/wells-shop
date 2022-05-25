import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { signupUserCheck } from '../../api/auth'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { BsXLg } from 'react-icons/bs'
import { add } from '../../redux/features/userSlice'
import Loading from '../../components/loading/Loading'
import styles from './signup.module.scss'
import { SubmitButton } from '../../components/button/buttonStore'
import { toast } from 'react-toastify'


const Signup = () => {

  useEffect(() => {
    document.title = 'Sign up'
  }, [])
  const dispatch = useDispatch()
  const [registerInfo, setRegisterInfo] = useState(null)
  const navigate = useNavigate()
  const loading = useSelector(state => state.loading)
  const schema = yup.object().shape({
    firstName: yup
      .string()
      .required('Please enter first name'),
    lastName: yup
      .string()
      .required('Please enter last name'),
    email: yup
      .string()
      .required('Please enter email')
      .matches(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, 'Email incorrect format'),
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
    const { password, email, } = data
    try {
      const res = await
        await toast.promise(
          signupUserCheck({
            displayName: `${data.lastName} ${data.firstName}`,
            email,
            password
          }),
          {
            pending: 'Checking...',
            success: {
              render({ data }) {
                return `${data.data}`
              }
            },
            error: {
              render({ data }) {
                return `${data.response.data}`
              }
            }
          }
        )

      setRegisterInfo(res.data)
      dispatch(add({
        displayName: `${data.lastName} ${data.firstName}`,
        email,
        password
      }))
      navigate('/auth/email-verify')
    } catch (err) {
      if (err.response.status < 500) {
        setRegisterInfo(err.response.data)
      } else {
        console.log(err.response)
      }
    }
  }
  <div className={clsx(styles.formField)}>
    <input type="text" placeholder='First name' autoComplete="off" {...register('firstName')} />
    {errors.firstName && <p className={clsx(styles.err)}>{errors.firstName.message}</p>}
  </div>
  const formFields = [
    {
      type: 'text',
      placeholder: 'First name',
      name: 'firstName',
    },
    {
      type: 'text',
      placeholder: 'Last name',
      name: 'lastName',
    },
    {
      type: 'email',
      placeholder: 'Email',
      name: 'email',
    },
    {
      type: 'password',
      placeholder: 'Password',
      name: 'password',
    },
    {
      type: 'password',
      placeholder: 'Confirm password',
      name: 'passwordConfirm',
    },

  ]
  return (
    <>
      <form onSubmit={handleSubmit(formSubmit)} className={clsx(styles.modal)}>

        <div className={clsx(styles.wrapper)}>
          <div className={clsx(styles.title)}>
            <h1>Signup</h1>
          </div>
          {formFields.map(field =>
            <div key={field.name} className={clsx(styles.formField)}>
              <input type={field.type} placeholder={field.placeholder} autoComplete="off" {...register(field.name)} />
              {errors[field.name] && <p className={clsx(styles.err)}>{errors[field.name].message}</p>}
            </div>
          )}
          <div className={clsx(styles.info)}>
            {registerInfo && <p style={{ fontSize: '1.4rem', marginBottom: "6px" }}>{registerInfo}</p>}
          </div>
          <SubmitButton className={styles.signup}>
            {loading ? <Loading /> : 'Signup'}
          </SubmitButton>
          <div className={clsx(styles.createAcc)}>
            <span>Already have an account?</span>
            <Link to='/auth/login'>Login Now</Link>
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