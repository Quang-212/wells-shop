import { useEffect } from "react"
import clsx from "clsx"
import { LinkButton } from '../../components/button/buttonStore'
import styles from './about.module.scss'


function About() {

    useEffect(() => {
        document.title = 'About | WELLS'
        window.scrollTo(0, 0)
    }, [])
    const analytics = [
        { title: "12", des: "Years of Experience" },
        { title: "300", des: "Products Available" },
        { title: "7", des: "Industry Awards Won" }
    ]
    return (
        <>
            <div className={clsx(styles.section1)}>
                <div className={clsx(styles.content)}>
                    <div className={clsx(styles.slogan)}>
                        <h4>Making your house a home</h4>
                    </div>
                    <div className={clsx(styles.description)}>
                        <h1>About our company & products</h1>
                    </div>

                </div>
            </div>

            <div className={clsx(styles.section2)}>
                <div className={clsx(styles.content)}>
                    <p>
                        We believed that your home is an extension of your
                        personality. With that in mind, we’ve created a
                        range of unique and personalized homeware products
                        that let you sprinkle a little more ‘you’ around
                        your home.
                    </p>
                    <p>
                        Our company works exclusively with sustainable
                        materials and environmentally friendly production
                        methods in the manufacturing of our products.
                    </p>
                </div>
            </div>
            <div className={clsx(styles.section3)}>
                <div className={clsx(styles.cheerImage)}>
                </div>
            </div>
            <div className={clsx(styles.section4)}>
                <div className={clsx(styles.content)}>
                    <h2>
                        Our design philosophy is guided by form and functionality.
                    </h2>
                    <p>
                        We understand that, while you want the items around your
                        house to look good, you also need them to be functional too.
                        That’s why we try to marry form and function, style and substance,
                        in everything we do.
                    </p>
                </div>
            </div>
            <div className={clsx(styles.section5)}>
                <div className={clsx(styles.container)}>
                    <div className={clsx(styles.row, styles.content)}>
                        {analytics.map((item, i) =>
                            <div key={i} className={clsx(styles.col, styles['xl-4'], styles['lg-4'], styles['md-6'], styles['sm-12'], styles['xs-12'])}>
                                <div className={clsx(styles.item)}>
                                    <h2 className={clsx(styles.numberTitle)}>
                                        {item.title}
                                    </h2>
                                    <span className={clsx(styles.description)}>
                                        {item.des}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className={clsx(styles.section6)}>
                <div className={clsx(styles.cafeImage)}>

                </div>
            </div>
            <div className={clsx(styles.section7)}>
                <div className={clsx(styles.content)}>
                    <h2 className={clsx(styles.title)}>
                        A pleasure is not a luxury
                    </h2>
                    <p className={clsx(styles.description)}>
                        Find joy in the small thing in life, and don’t
                        compromise on look and feel.
                    </p>
                    <LinkButton to='/shop'>
                        Go To Shop
                    </LinkButton>
                </div>

            </div>
        </>
    )
}

export default About