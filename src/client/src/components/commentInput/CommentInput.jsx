import React from 'react'
import { useSelector } from 'react-redux'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import clsx from 'clsx'
import socket from '../../utils/socket'
import styles from './commentInput.module.scss'
import { addComment } from '../../api/comment.js'


export default function CommentInput({ targetId, productId, reply, show = false, placeholder, fullWidth, small, style }) {

    const user = useSelector(state => state.auth.user)
    const schema = Yup.object().shape({
        text: Yup.string().required("Write something first!")
    })
    const { handleSubmit, reset, setFocus, register } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            text: ''
        }
    })
    const formSubmit = async (data) => {
        try {
            await addComment({
                targetId,
                from: user.id,
                text: data.text,
                reply
            })
            socket.emit("commentNotice", { targetId, productId, reply, from: user.id })
            reset()
            setFocus("text", { shouldSelect: true })
        } catch (err) {
            console.error(err)
        }
    }
    return (
        <>
            {show
                ?
                <form
                    onSubmit={handleSubmit(formSubmit)}
                    style={{
                        width: fullWidth ? "100%" : '60%',
                        height: small && "32px",
                        ...style
                    }}
                    className={clsx(styles.form)}
                >
                    <input
                        type="text" {...register("text")}
                        autoComplete="off"
                        placeholder={placeholder}
                    />
                </form>
                :
                null
            }
        </>
    )
}