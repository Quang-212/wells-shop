import { useRef, useState, useEffect } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
import { logout, loginUpdate, userLogin } from '../../redux/features/authSlice'
import { cartRemove } from '../../redux/features/cartSlice'
import { favoritesRemove } from '../../redux/features/favoriteSlice'
import { AiOutlineCarryOut, AiOutlineHeart, AiFillHeart, AiFillSetting } from 'react-icons/ai'
import { BsPersonCircle } from 'react-icons/bs'
import { FaSignOutAlt } from 'react-icons/fa'

import styles from './shopLayout.module.scss'
import { toast } from 'react-toastify'

function ShopLayout() {

    const serverUrl = 'https://wells-shop.herokuapp.com'
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const favList = useSelector(state => state.favorite)
    const favQuantity = favList.reduce(s => s += 1, 0)
    const user = useSelector(state => state.auth.user)
    const loggedIn = useSelector(state => state.auth.isLoggedIn)
    const [profileShow, setProfileShow] = useState(false)
    const profileRef = useRef()

    const handleClickOutside = (event) => {
        if (profileShow && !profileRef.current?.contains(event.target)) {
            setProfileShow(false)
        }
    }
    const handleLogout = async () => {
        try {
            if (user.provider !== "system") {
                window.open(`${serverUrl}/auth/passport/logout`, '_self')
                dispatch(loginUpdate(0))
                dispatch(userLogin({}))
                dispatch(cartRemove())
                dispatch(favoritesRemove())
                localStorage.clear()
            } else {
                await toast.promise(
                    dispatch(logout()).unwrap(),
                    {
                        pending: "Logout...",
                        success: 'See you soon!',
                        error: 'Something went wrong!'
                    }
                )
                dispatch(loginUpdate(0))
                dispatch(cartRemove())
                dispatch(favoritesRemove())
                navigate('/shop')
            }

        } catch (err) {
            console.log(err.data)
        }
    }
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    useEffect(() => {
        window.addEventListener('click', handleClickOutside)
        return () => {
            window.removeEventListener('click', handleClickOutside)
        }
    }, [profileShow])

    return (
        <>
            <div className={clsx(styles.wrapper)}>
                <div className={clsx(styles.container)}>
                    <div className={clsx(styles.title)}>
                        <p>New season, new home</p>
                        <h1>SS20 Collection</h1>
                    </div>
                    <div className={clsx(styles.navigation)}>
                        <Link to='/' className={clsx(styles.navItem)}>
                            <AiOutlineCarryOut className={clsx(styles.icon)} />
                            <span>Track Orders</span>
                        </Link>
                        <Link to='/shop/favorites' className={clsx(styles.navItem)}>
                            {favList[0] === undefined
                                ?
                                <AiOutlineHeart className={clsx(styles.icon)} />
                                :
                                <AiFillHeart className={clsx(styles.icon, styles.favorites)} />
                            }
                            <span>{`Favorites(${favQuantity})`}</span>
                        </Link>
                        {loggedIn === 1
                            ?
                            <div className={clsx(styles.navItem)}>
                                <div
                                    className={clsx(styles.profilePic)}
                                    onClick={() => {
                                        setProfileShow(!profileShow)
                                    }}
                                    style={{ backgroundImage: `url(${user.profilePhoto})` }}
                                >
                                </div>
                                <ul ref={profileRef} className={clsx(styles.profile, {
                                    [styles.active]: profileShow
                                })}>
                                    <li className={clsx(styles.profileItem)}>
                                        <div className={clsx(styles.pic)} style={{ backgroundImage: `url(${user.profilePhoto})` }}></div>
                                        <div className={clsx(styles.info)}>
                                            <span>{user.username}</span>
                                            <p>{user.email}</p>
                                        </div>
                                    </li>
                                    <li className={clsx(styles.profileItem)}>
                                        <Link to='/admin'>
                                            <AiFillSetting className={clsx(styles.icon)} />
                                            <span>Management</span>
                                        </Link>
                                    </li>
                                    <li className={clsx(styles.profileItem)}>
                                        <Link to='/user/account'>
                                            <AiFillSetting className={clsx(styles.icon)} />
                                            <span>Profile</span>
                                        </Link>
                                    </li>
                                    <li className={clsx(styles.profileItem)}>
                                        <button onClick={handleLogout}>
                                            <FaSignOutAlt className={clsx(styles.icon)} />
                                            <span>Log out</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            :
                            <Link to='/auth/login' className={clsx(styles.navItem)}>
                                <BsPersonCircle className={clsx(styles.icon)} />
                                <span>Sign In</span>
                            </Link>
                        }
                    </div>
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default ShopLayout