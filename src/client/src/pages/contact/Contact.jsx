import { useState, useEffect } from 'react'
import clsx from 'clsx'
import styles from './contact.module.scss'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { SubmitButton } from '../../components/button/buttonStore'
import { sendContact } from '../../api/contact'
import { toast } from 'react-toastify'

function Contact() {

    useEffect(() => {
        document.title = 'Contacts | WELLS'
        window.scrollTo(0, 0)
    }, [])
    const schema = yup.object().shape({
        firstName: yup
            .string()
            .required('Please enter firstname'),
        lastName: yup
            .string(),
        email: yup
            .string()
            .required('Please enter email')
            .trim()
            .matches(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, 'Email incorrect format'),
        message: yup
            .string()
            .required('Please enter message')
            .max(500, 'Message should be less than 500 characters')
    })

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })
    const loading = useSelector(state => state.loading)
    const formFields = [
        { label: "First Name *", registerName: "firstName", placeholder: "Your first name", type: "text" },
        { label: "Last Name", registerName: "lastName", placeholder: "Your last name", type: "text" },
        { label: "Email *", registerName: "email", placeholder: "Your email address", type: "email" },
    ]
    const onFormSubmit = async (data) => {
        try {
            await toast.promise(
                sendContact({
                    username: `${data.lastName} ${data.firstName}`,
                    email: data.email,
                    message: data.message
                }),
                {
                    pending: 'Your information is sending...',
                    success: 'Success, we\'ll contact you soon',
                    error: 'Something wrong, let\'s try again!',
                })
        }
        catch (err) {
            console.error(err.response)
        }
    }

    return (
        <div className={clsx(styles.main)}>
            <div className={clsx(styles.content)}>
                <div className={clsx(styles.des)}>
                    <p>Our connections make us human</p>
                </div>
                <div className={clsx(styles.title)}>
                    <h1 >If you like our products, please get in touch</h1>
                </div>
                <form
                    onSubmit={handleSubmit(onFormSubmit)}
                    className={clsx(styles.formWrapper)}
                >
                    {formFields.map((field, i) =>
                        <div key={i} className={clsx(styles.formField)}>
                            <label className={styles.label}>{field.label}</label>
                            <input {...register(field.registerName)} type={field.type} className={clsx(styles.input)} autoComplete='off' placeholder={field.placeholder}></input>
                            {errors[field.registerName] && <p className={clsx(styles.error)}>{errors[field.registerName]?.message}</p>}
                        </div>
                    )}
                    <div className={clsx(styles.formFieldMess)}>
                        <label type='text' className={styles.label}>Message *</label>
                        <textarea {...register('message')} className={clsx(styles.inputMess)} autoComplete='off' placeholder='Enter your message'></textarea>
                        {errors.message && <p className={clsx(styles.error)}>{errors.message?.message}</p>}
                    </div>
                    <div className={clsx(styles.formBtn)}>
                        <SubmitButton className={clsx(styles.submitBtn)} disabled={loading}>
                            CONTACT US
                        </SubmitButton>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default Contact