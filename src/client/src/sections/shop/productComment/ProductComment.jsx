import React, { useEffect, useState, memo } from 'react'
import clsx from 'clsx'
import styles from './productComment.module.scss'
import CommentList from '../../../components/commentList/CommentList'
import CommentInput from '../../../components/commentInput/CommentInput'
import { getRootComment } from '../../../api/comment'
import socket from '../../../utils/socket'

const ProductComment = ({ productId }) => {
    const [data, setData] = useState(null)
    const [newId, setNewId] = useState(0)

    useEffect(() => {
        const rootComments = async () => {
            const commentData = await getRootComment(productId)
            if (commentData.data) {
                setData(commentData.data)
            }
        }
        rootComments()
    }, [newId, productId])
    useEffect(() => {
        socket.on("commentUpdate", () => {
            setNewId(prev => ++prev)
        })
    }, [])
    return (
        <div className={clsx(styles.row, styles.wrapper)}>
            <div className={clsx(styles.col, styles['xl-8'])}>
                <div className={clsx(styles.comment)}>
                    <h2>Reviews</h2>
                    <CommentInput targetId={productId} productId={productId} placeholder="Write something awesome..." show fullWidth />
                    {data?.comments[0] === undefined
                        ?
                        <h2 className={clsx(styles.noComment)}>Say something about our product</h2>
                        :
                        <CommentList data={data} productId={productId} />
                    }
                </div>
            </div>
            <div className={clsx(styles.col, styles['xl-4'])}>
                <h2>San pham khac</h2>
            </div>
        </div>
    )
}
export default memo(ProductComment)
