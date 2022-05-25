import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { orderRemove } from '../../../redux/features/orderSlice'
import clsx from 'clsx'
import { LinkButton } from '../../../components/button/buttonStore'
import styles from './order.module.scss'


const Order = () => {
  const dispatch = useDispatch()
  const bill = useSelector(state => state.order)
  const user = useSelector(state => state.auth.user)
  const time = new Date()
  const year = time.getFullYear()
  const month = time.getMonth()
  const day = time.getDate()
  const hour = time.getHours()
  const minute = time.getMinutes()
  const second = time.getSeconds()
  const now = `${hour}:${minute}:${second} ${day}/${month}/${year}`
  const handleContinue = () => {
    dispatch(orderRemove())
  }
  return (
    <>
      <div className={clsx(styles.wrapper)}>
        <div className={clsx(styles.container, styles.flex)}>
          <div className={clsx(styles.title)}>
            <p>New season, new home</p>
            <h1>SS20 Collection</h1>
          </div>
          <div className={clsx(styles.bill)}>
            <div className={clsx(styles.billTitle)}>
              <h2>Thank you for your order!</h2>
              <p>Order confirmation and updates will be sent to</p>
              <p>{user.email}</p>
            </div>
            <div className={clsx(styles.billId)}>
              <div className={clsx(styles.leftBlock)}>
                <h3>Order #1379</h3>
                <span>{now}</span>
              </div>
              <div className={clsx(styles.rightlock)}>
                <span>Print order</span>
              </div>
            </div>
            <div className={clsx(styles.paymentStatus)}>
              <h3>Payment status: Awaiting Payment</h3>
              <span>Pay by cash</span>
              <span>{`Total $${bill.total}`}</span>
            </div>
            <div className={clsx(styles.yourOrder)}>
              <h2>Your order</h2>
              {bill.order && bill.order.map((e, i) => {
                return (
                  <div key={i} className={clsx(styles.orderItem)}>
                    <div className={clsx(styles.image)} style={{ backgroundImage: `url(${e.image.url})` }}></div>
                    <div className={clsx(styles.orderContent)}>
                      <div className={clsx(styles.name)}>
                        {e.name}</div>
                      <div className={clsx(styles.size)}>
                        {e.size}
                      </div>
                      <div className={clsx(styles.count)}>
                        {`× ${e.count}`}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className={clsx(styles.question)}>
              <h3>Questions on your order?</h3>
              <p>We’re here for you. Let us know how we can help.</p>
              <span>Email:</span>
              <a href="mailTo:quang.nv212@gmail.com">quang.nv212@gmail.com</a>
            </div>

          </div>
          <LinkButton to='/shop' onClick={handleContinue} title='shop' className={clsx(styles.shopBtn)}>
            Continue Shopping
          </LinkButton>
        </div>
      </div>
    </>
  )
}

export default Order