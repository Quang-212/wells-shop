import React from 'react'
import clsx from 'clsx'
import styles from './productDetails.module.scss'
const ProductDetailsSkeleton = () => {
    return (
        <>
            <div className={clsx(styles.grid, styles.row)}>
                <div className={clsx(styles.col, styles['xl-8'], styles['lg-8'], styles['md-8'], styles['sm-12'], styles['xs-12'])}>
                    <div className={clsx(styles.card)}>
                        <div className={clsx(styles.image)}></div>
                    </div>
                </div>
                <div className={clsx(styles.col, styles['xl-4'], styles['lg-4'], styles['md-4'], styles['sm-12'], styles['xs-12'])}>
                    <div className={clsx(styles.card)}>
                        <div className={clsx(styles.content)}>
                            <div className={clsx(styles.name)}></div>
                            <div className={clsx(styles.price)}></div>
                            <div className={clsx(styles.button)}></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductDetailsSkeleton