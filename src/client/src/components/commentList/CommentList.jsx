import React, { useState, useRef } from 'react'
import clsx from 'clsx'
import moment from 'moment'
import styles from './commentList.module.scss'
import CommentChildrenList from '../commentChildrenList/CommentChildrenList'


export default function CommentList({ data, productId }) {
    const [replyInputShow, setReplyInputShow] = useState({
        status: false,
        position: null
    })
    const commentBoxRef = useRef()
    const { comments, childrenCommentCount } = data
    const replyCount = (id) => {
        const quantityOfComment = childrenCommentCount.find(item => item._id === id)?.totalComments
        if (!quantityOfComment) {
            return 0
        } else {
            return quantityOfComment
        }
    }
    function handleReply(index) {
        setReplyInputShow({
            status: !replyInputShow.status,
            position: index
        })
        setShowReply(true)
        if (!replyInputShow.status) {
            window.scrollTo({ top: commentBoxRef.current.offsetTop, behavior: 'smooth' })
        }
    }
    const [showReply, setShowReply] = useState(false)
    return (
        <ul ref={commentBoxRef} className={clsx(styles.commentList)}>
            {comments.map((item, i) =>
                <li key={item._id} className={clsx(styles.commentItem)} >
                    <div className={clsx(styles.comment)}>
                        <div className={clsx(styles.avatar)} style={{ backgroundImage: `url(${"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJWRl_uPDFY66DPkMTwMPL9okf1ja6eQ-2vg&usqp=CAU"})` }}></div>
                        <div className={clsx(styles.content)}>
                            <h3 className={clsx(styles.name)}>{item.from.displayName}</h3>
                            <p className={clsx(styles.text)}>{item.text}</p>
                        </div>
                        <div className={clsx(styles.interact)}>
                            <span>Like</span>
                            <span onClick={() => { handleReply(i) }}>Reply</span>
                            <span>{moment(item.createdAt).fromNow()}</span>
                            {replyCount(item._id)
                                ?
                                <>
                                    {showReply
                                        ?
                                        <span onClick={() => { setShowReply(!showReply) }}>
                                            Hide answer
                                        </span>
                                        :
                                        <span onClick={() => { setShowReply(!showReply) }}>
                                            {`Answer(${replyCount(item._id)})`}
                                        </span>
                                    }
                                </>
                                :
                                null
                            }
                        </div>
                    </div>
                    <CommentChildrenList
                        productId={productId}
                        commentId={item._id}
                        userId={item.from._id}
                        showReply={showReply}
                        inputBox={{ item, i, replyInputShow, replyTo: item.from.displayName }}
                    />
                </li>
            )}
        </ul>
    )
}
