import clsx from 'clsx'
import styles from './footer.module.scss'


function Footer() {
    return (
        <footer className={clsx(styles.background)}>
            <div className={clsx(styles.container)}>
                <div className={clsx(styles.row, styles.content)}>
                    <div className={clsx(styles.col, styles['xl-4'], styles['lg-4'], styles['md-6'], styles['sm-12'], styles['xs-12'])}>
                        <div className={clsx(styles.element)}>
                            <h3 className={clsx(styles.elementTitle)}>OUR ADDRESS</h3>
                            <div className={clsx(styles.elementContent)}>
                                <span>Add: Số **, Quận HBT,</span>
                                <br></br>
                                <span>Thành Phố Hà Nội</span>
                            </div>
                        </div>
                    </div>
                    <div className={clsx(styles.col, styles['xl-4'], styles['lg-4'], styles['md-6'], styles['sm-12'], styles['xs-12'])}>
                        <div className={clsx(styles.element)}>
                            <h3 className={clsx(styles.elementTitle)}>CONTACT US</h3>
                            <div className={clsx(styles.elementContent)}>
                                <a href='mailto:quang.nv212@gmail.com'>Email: quang.nv212@gmail.com</a>
                                <br></br>
                                <a href='tel:0971252774'>Tel: (+84) 971-252-774</a>
                            </div>
                        </div>
                    </div>
                    <div className={clsx(styles.col, styles['xl-4'], styles['lg-4'], styles['md-6'], styles['sm-12'], styles['xs-12'])}>
                        <div className={clsx(styles.element)}>
                            <h3 className={clsx(styles.elementTitle)}>WORKING HOURS</h3>
                            <div className={clsx(styles.elementContent)}>
                                <span>Mon - Fri: 9:00 - 18:00</span>
                                <br></br>
                                <span>Sat: 10:00 - 16:00</span>
                                <br></br>
                                <span>Sun: Closed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
export default Footer



