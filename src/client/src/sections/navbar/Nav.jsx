import { useEffect, useState, useRef } from 'react'
import clsx from 'clsx'
import { useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'
import { BsXLg } from 'react-icons/bs'
import { AiOutlineShoppingCart, AiOutlineBars } from 'react-icons/ai'
import styles from './nav.module.scss'

function Navigation() {

    const cart = useSelector(state => state.cart)
    const totalOfProduct = cart.reduce((total, ele) => {
        return total += ele.count
    }, 0)
    const [scrollStatus, setScrollStatus] = useState({
        scrollDirection: null,
        scrollPos: 0,
    })

    useEffect(() => {
        window.addEventListener("scroll", handleScrollDocument);

        return () => window.removeEventListener("scroll", handleScrollDocument);
    }, [])

    function handleScrollDocument() {
        setScrollStatus((prev) => { // to get 'previous' value of state
            if (prev.scrollDirection === "down") {
                setStickyMenuShow(false)
            }
            return {
                scrollDirection:
                    document.body.getBoundingClientRect().top > prev.scrollPos
                        ? "up"
                        : "down",
                scrollPos: document.body.getBoundingClientRect().top,
            }
        })
    }
    const [stickyMenuShow, setStickyMenuShow] = useState(false)
    const menuStickyRef = useRef()

    const handleClickOutside = (event) => {
        if (stickyMenuShow && !menuStickyRef.current.contains(event.target)) {
            handleMenuClick()
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside)
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [stickyMenuShow])

    const handleIconClick = () => {
        setStickyMenuShow(!stickyMenuShow)
    }

    const handleMenuClick = () => {
        setStickyMenuShow(!stickyMenuShow)
    }

    const navActive = ({ isActive }) => {
        return {
            borderBottom: isActive ? '2px solid black' : ""
        }
    }

    const navItems = [{ content: "Shop", link: '/shop' }, { content: "About", link: '/about' }, { content: "Contacts", link: '/contacts' },]
    return (
        <header>
            <div
                ref={menuStickyRef}
                className={clsx(styles.menuSticky, {
                    [styles.active]: stickyMenuShow
                })}
            >
                {navItems.map((navItem, i) =>
                    <Link key={i} to={navItem.link} onClick={handleMenuClick} className={clsx(styles.menuStickyItem)}>
                        <span>{navItem.content}</span>
                    </Link>
                )}
            </div>
            <nav style={{ top: scrollStatus.scrollPos < -94 && scrollStatus.scrollDirection === "down" ? "-94px" : "0" }}
                className={clsx(styles.nav, {
                    [styles.onScroll]: scrollStatus.scrollPos < 0,
                    [styles.navShadow]: stickyMenuShow,
                })}>
                <div className={clsx(styles.wrapper, styles.container)}>
                    <div className={styles.homeMenu} onClick={handleIconClick}>
                        {stickyMenuShow
                            ?
                            <BsXLg title='Menu' className={clsx(styles.menuIcon)} />
                            :
                            <AiOutlineBars title='Menu' className={clsx(styles.menuIcon)} />
                        }
                    </div>
                    <div className={clsx(styles.homeBrand)}>
                        <Link to='/' className={clsx(styles.brandName)}>WELLS</Link>
                    </div>
                    <ul className={clsx(styles.list)}>
                        {navItems.map((navItem, i) =>
                            <li key={i} className={clsx(styles.itemLink)}>
                                <NavLink style={navActive} to={navItem.link}>
                                    {navItem.content}
                                </NavLink>
                            </li>
                        )}
                        <div className={clsx(styles.cart)}>
                            <AiOutlineShoppingCart className={clsx(styles.cartIcon)}></AiOutlineShoppingCart>
                            <Link to='/shop/cart'>
                                {`Shopping bag (${totalOfProduct})`}
                            </Link>
                        </div>
                    </ul>
                </div>
            </nav>
        </header>
    )
}
export default Navigation;