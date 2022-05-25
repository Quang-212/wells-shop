import React from 'react'
import clsx from 'clsx'
import styles from './404Page.module.scss'
import {LinkButton} from '../../components/button/buttonStore'

const NotFound = () => {
    return (
        <div className={clsx(styles.wrapper)}>
            <div className={clsx(styles.image)}></div>
            <LinkButton to='/' title='home' className={clsx(styles.btn)}>Back to home</LinkButton>
        </div>
    )
}

export default NotFound