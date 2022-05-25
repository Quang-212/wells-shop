import clsx from "clsx"
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './favorites.module.scss'
import { useDispatch, useSelector } from "react-redux"
import { AiFillHeart } from 'react-icons/ai'
import { favoritesDelete } from "../../../redux/features/favoriteSlice"
import { userFavoriteUpdate } from '../../../api/user'
export default function Favorites() {

    document.title = 'Favorites | WELLS'
    const favList = useSelector(state => state.favorite)
    const dispatch = useDispatch()
    const loggedIn = useSelector(state => state.auth.isLoggedIn)

    useEffect(() => {
        if (loggedIn === 1) {
            (async () => {
                try {
                    const res1 = await userFavoriteUpdate(favList)
                    localStorage.setItem('fav', JSON.stringify(favList))
                    console.log(res1.data)
                } catch (err) {
                    console.log(err.response)
                }
            })()
        }
    }, [favList])

    return (
        <>
            {(favList[0] === undefined)
                ?
                <div className={clsx(styles.empty)}>
                    <span>You haven’t favorited any items yet</span>
                    <Link to='/shop'>
                        <span>Browse store</span>
                    </Link>
                </div>
                :
                <div className={clsx(styles.row, styles.grid)} >
                    {favList.map((element) => {
                        return (
                            <div key={element.id} className={clsx(styles.col, styles['xl-4'], styles['lg-4'], styles['md-6'], styles['sm-12'], styles['xs-12'])}>
                                <div className={clsx(styles.product)}>
                                    <Link
                                        to={`/shop/product?id=${element.id}`}
                                        title={element.name}
                                        className={clsx(styles.link)}
                                    >
                                        <div className={clsx(styles.image)} style={{ backgroundImage: `url(${element.image.url})` }}></div>
                                        <div className={clsx(styles.title)}>
                                            <span>{element.name}</span>
                                        </div>
                                        <div className={clsx(styles.price)}>
                                            <span>{`$${element.price}`}</span>
                                        </div>
                                    </Link>
                                    <button
                                        className={clsx(styles.fav)}
                                        onClick={() => {
                                            dispatch(favoritesDelete(element.id))
                                        }}
                                        title='Remove from favorites'
                                    >
                                        <AiFillHeart className={clsx(styles.icon)} />
                                        <span>Favorited</span>
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
        </>
    )
}




