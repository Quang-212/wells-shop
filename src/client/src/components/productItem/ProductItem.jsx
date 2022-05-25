import React from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import styles from './productItem.module.scss'
export default function ProductItem({ product }) {
  const { _id, name, image: { url }, price } = product
  return (
    <div className={clsx(styles.product)}>
      <Link
        to={`/shop/product?id=${_id}`}
        title={name}
        className={clsx(styles.link)}
      >
        <div className={clsx(styles.limitImageSize)}>
          <div className={clsx(styles.image)} style={{ backgroundImage: `url(${url})` }}></div>
        </div>
        <div className={clsx(styles.title)}>
          <span>{name}</span>
        </div>
        <div className={clsx(styles.price)}>
          <span>{`$${price}`}</span>
        </div>
      </Link>
      <Link to={`/shop/product?id=${_id}`} className={clsx(styles.buy)}>
        <span>Buy Now</span>
      </Link>
    </div>
  )
}
