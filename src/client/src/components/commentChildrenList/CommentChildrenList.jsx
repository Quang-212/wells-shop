import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { IoMdArrowDropright } from 'react-icons/io'
import styles from './commentChildrenList.module.scss'
import CommentInput from '../commentInput/CommentInput'
import { getChildComment } from '../../api/comment'
import socket from '../../utils/socket'
import LoadingIcon from '../loading/LoadingIcon'


export default function CommentChildrenList({ commentId, productId, userId, showReply, inputBox }) {
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(false)
    const [newId, setNewId] = useState(0)
    const [replyInputShow, setReplyInputShow] = useState({
        status: false,
        position: null
    })

    useEffect(() => {
        const childComments = async () => {
            setLoading(true)
            const commentData = await getChildComment(commentId)
            if (commentData.data) {
                setComments(commentData.data)
            }
            setLoading(false)
        }
        if (showReply) {
            childComments()
        }
    }, [showReply, newId, commentId])
    useEffect(() => {
        socket.on("commentUpdate", () => {
            setNewId(prev => ++prev)
        })
    }, [])
    const handleReply = (index) => {
        setReplyInputShow({
            status: true,
            position: index
        })
    }

    return (
        <>
            {showReply &&
                <>
                    {loading
                        ?
                        <LoadingIcon />
                        :
                        <ul className={clsx(styles.commentList)}>
                            {comments.map((item, i) =>
                                <li key={item._id} className={clsx(styles.commentItem)}>
                                    <div className={clsx(styles.content)}>
                                        <div className={clsx(styles.name)}>
                                            <h3>{`${item.from.displayName}`}</h3>
                                            {item.reply._id !== userId
                                                ?
                                                <>
                                                    <IoMdArrowDropright className={clsx(styles.arrow)} />
                                                    <h3>{`${item.reply.displayName}`}</h3>
                                                </>
                                                :
                                                null
                                            }
                                        </div>
                                        <p className={clsx(styles.text)}>{item.text}</p>
                                    </div>
                                    <span className={clsx(styles.like)}>Like</span>
                                    <span className={clsx(styles.reply)} onClick={() => { handleReply(i) }}>Reply</span>
                                    <div className={clsx(styles.input)} >
                                        <CommentInput
                                            targetId={item.targetId}
                                            productId={productId}
                                            show={replyInputShow.status && replyInputShow.position === i}
                                            reply={item.from._id}
                                            placeholder={`Reply to ${item.from.displayName}`}
                                            small
                                            fullWidth
                                            style={{ margin: "4px 0 10px 10px" }}
                                        />
                                    </div>
                                </li>
                            )}
                            <CommentInput
                                targetId={inputBox.item._id}
                                productId={productId}
                                show={inputBox.replyInputShow.status && inputBox.replyInputShow.position === inputBox.i}
                                reply={inputBox.item.from._id}
                                placeholder={`Reply to ${inputBox.replyTo}`}
                                small
                                style={{ margin: "14px 0 0 -28px" }}
                            />
                        </ul>
                    }
                </>
            }
        </>
    )
}
