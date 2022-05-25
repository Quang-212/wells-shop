import React from 'react'
import clsx from 'clsx'
import styles from './productCart.module.scss'
const ProductCardSkeleton = () => {
    return (
        <>
            <div className={clsx(styles.grid, styles.row)}>
                <div className={clsx(styles.col, styles['xl-4'], styles['lg-4'], styles['md-6'], styles['sm-6'], styles['xs-12'])}>
                    <div className={clsx(styles.card)}>
                        <div className={clsx(styles.image)}></div>
                        <div className={clsx(styles.content)}>
                            <div className={clsx(styles.name)}></div>
                            <div className={clsx(styles.price)}></div>
                            <div className={clsx(styles.button)}></div>
                        </div>
                    </div>
                </div>
                <div className={clsx(styles.col, styles['xl-4'], styles['lg-4'], styles['md-6'], styles['sm-6'], styles['xs-12'])}>
                    <div className={clsx(styles.card)}>
                        <div className={clsx(styles.image)}></div>
                        <div className={clsx(styles.content)}>
                            <div className={clsx(styles.name)}></div>
                            <div className={clsx(styles.price)}></div>
                            <div className={clsx(styles.button)}></div>
                        </div>
                    </div>
                </div>
                <div className={clsx(styles.col, styles['xl-4'], styles['lg-4'], styles['md-6'], styles['sm-6'], styles['xs-12'])}>
                    <div className={clsx(styles.card)}>
                        <div className={clsx(styles.image)}></div>
                        <div className={clsx(styles.content)}>
                            <div className={clsx(styles.name)}></div>
                            <div className={clsx(styles.price)}></div>
                            <div className={clsx(styles.button)}></div>
                        </div>
                    </div>
                </div>
                <div className={clsx(styles.col, styles['xl-4'], styles['lg-4'], styles['md-6'], styles['sm-6'], styles['xs-12'])}>
                    <div className={clsx(styles.card)}>
                        <div className={clsx(styles.image)}></div>
                        <div className={clsx(styles.content)}>
                            <div className={clsx(styles.name)}></div>
                            <div className={clsx(styles.price)}></div>
                            <div className={clsx(styles.button)}></div>
                        </div>
                    </div>
                </div>
                <div className={clsx(styles.col, styles['xl-4'], styles['lg-4'], styles['md-6'], styles['sm-6'], styles['xs-12'])}>
                    <div className={clsx(styles.card)}>
                        <div className={clsx(styles.image)}></div>
                        <div className={clsx(styles.content)}>
                            <div className={clsx(styles.name)}></div>
                            <div className={clsx(styles.price)}></div>
                            <div className={clsx(styles.button)}></div>
                        </div>
                    </div>
                </div>
                <div className={clsx(styles.col, styles['xl-4'], styles['lg-4'], styles['md-6'], styles['sm-6'], styles['xs-12'])}>
                    <div className={clsx(styles.card)}>
                        <div className={clsx(styles.image)}></div>
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

export default ProductCardSkeleton