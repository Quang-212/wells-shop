import clsx from 'clsx'
import { Link, useNavigate } from 'react-router-dom'
import styles from './button.module.scss'

export const LinkButton = ({ to, className, onClick, title, children }) => {
    return (
        <Link
            to={to}
            title={`Go to ${title}`}
            className={clsx(styles.btn, className)}
            onClick={onClick}
        >
            <span>{children}</span>
        </Link>
    )
}

export const SubmitButton = ({ className, children, disabled }) => {
    return (
        <button
            type='submit'
            className={clsx(styles.btn, className, {
                [styles.disabledCursor]: disabled
            })}
            disabled={disabled}
        >
            <span>{children}</span>
        </button>
    )
}
export const NormalButton = ({ onClick, className, children }) => {
    return (
        <button
            type='button'
            onClick={onClick ? () => { onClick() } : null}
            className={clsx(styles.btn, className)}
        >
            <span>{children}</span>
        </button>
    )
}
export const BackButton = ({...others }) => {
    const navigate = useNavigate()
    return (
        <button
            type='button'
            onClick={() => {
                navigate(-1)
            }}
            className={clsx(styles.btn, styles.back)}
            {...others}
        >
            <span>Back</span>
        </button>
    )
}

