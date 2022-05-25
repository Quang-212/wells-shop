import clsx from "clsx"
import { useEffect } from "react"
import styles from './home.module.scss'
import { LinkButton } from '../../components/button/buttonStore.jsx'


function Home() {

    useEffect(() => {
        document.title = 'WELLS'
        window.scrollTo(0, 0)
    }, [])

    return (
        <>
            <div className={clsx(styles.section1)}>
                <div className={clsx(styles.content)}>
                    <div className={clsx(styles.slogan)}>
                        <h4>Your home is as unique as you are</h4>
                    </div>
                    <div className={clsx(styles.description)}>
                        <h1>Brightening homes with beautiful, durable products.</h1>
                    </div>
                    <LinkButton
                        to='/shop'
                        title='shop'
                    >
                        Go To Shop
                    </LinkButton>
                </div>
            </div>
            <div className={clsx(styles.section2)}>
                <div className={clsx(styles.image)}></div>
            </div>
        </>
    )
}

export default Home