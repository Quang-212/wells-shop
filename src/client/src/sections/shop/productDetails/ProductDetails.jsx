import { useEffect, useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'
import { getOneById } from '../../../api/product'
import { userCartUpdate, userFavoriteUpdate } from '../../../api/user'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { BsFacebook, BsTwitter, BsPinterest } from 'react-icons/bs'
import Skeleton from '../../../components/skeleton/ProductDetailsSkeleton'
import { favoritesAdd, favoritesDelete } from '../../../redux/features/favoriteSlice'
import { cartAdd } from '../../../redux/features/cartSlice'
import styles from './shopProductDetails.module.scss'
import ProductComment from '../productComment/ProductComment'

export default function ProductDetails() {

    const navigate = useNavigate()
    const loggedIn = useSelector(state => state.auth.isLoggedIn)
    const favList = useSelector(state => state.favorite)
    const cart = useSelector(state => state.cart)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const [data, setData] = useState([])
    document.title = `${data.name || 'Details'} | WELLS`
    const [size, setSize] = useState([])
    const [checked, setChecked] = useState(0)
    const [searchParams] = useSearchParams()
    let id = searchParams.get('id')
    const onFavList = favList.find(e => e.id === id)
    const [favContent, setFavContent] = useState(onFavList ? {
        state: 1,
        title: 'Remove from favorites',
        content: 'Favorited'
    } : {
        state: 0,
        title: 'Add to favorites',
        content: 'Favorite'
    })

    useEffect(() => {
        (async () => {
            setLoading(true)
            try {
                if (id === null) {
                    navigate('/shop')
                } else {
                    const result = await getOneById(id)
                    setData(result.data)
                    setLoading(false)
                    setSize(result.data.size)
                }
            }
            catch (err) {
                console.log('Get product details error:', err.response)
            }
        })()
    }, [id])

    useEffect(() => {
        if (loggedIn === 1) {
            (async () => {
                try {
                    await userCartUpdate(cart)
                    localStorage.setItem('cart', JSON.stringify(cart))
                } catch (err) {
                    if (err.response === undefined) {
                        console.log(err)
                    } else {
                        console.log(err.response)
                    }
                }
            })()
        }
    }, [cart])

    useEffect(() => {
        if (loggedIn === 1) {
            (async () => {
                try {
                    await userFavoriteUpdate(favList)
                    localStorage.setItem('fav', JSON.stringify(favList))
                } catch (err) {
                    if (err.response === undefined) {
                        console.log(err)
                    } else {
                        console.log(err.response)
                    }
                }
            })()
        }
    }, [favList])

    const handleFavbtn = (info) => {
        if (loggedIn !== 1) return navigate('/auth/login')
        if (favContent.state === 0) {
            setFavContent({
                title: 'Remove from favorites',
                state: 1,
                content: 'Favorited'
            })
            dispatch(favoritesAdd({
                id: info._id,
                size: info.size,
                name: info.name,
                price: info.price,
                image: info.image

            }))
        } else {
            setFavContent({
                title: 'Add to favorites',
                state: 0,
                content: 'Favorite'
            })
            dispatch(favoritesDelete(id))
        }
    }
    const addToBag = () => {
        if (!loggedIn) return navigate('/auth/login')
        dispatch(cartAdd({
            id: data._id,
            name: data.name,
            image: data.image,
            size: size[checked],
            price: data.price
        }))
    }

    const quantityOfProduct = (cart) => {
        //check exist cart
        if (cart[0] === undefined) {
            return 0
        } else {
            let product = cart.filter(ele => ele.id === id)
            //check exist product
            if (product === undefined) {
                return 0
            } else {
                // handle for one or many product(different size)
                return product.reduce((total, ele) => {
                    return total += ele.count
                }, 0)
            }
        }
    }
    const quantityDisplay = (quantity) => {
        if (quantity === 0) {
            return <span>In stocks</span>
        } else if (quantity === 1) {
            return <span>{`${quantity} item in the bag`}</span>
        } else {
            return <span>{`${quantity} items in the bag`}</span>
        }
    }

    return (
        <>{
            loading
                ?
                <Skeleton />
                :
                <>
                    <div className={clsx(styles.row, styles.wrapper)}>
                        <div className={clsx(styles.col, styles['xl-8'])}>
                            <div className={clsx(styles.image)} style={{ backgroundImage: `url(${data.image?.url})` }}></div>
                        </div>
                        <div className={clsx(styles.col, styles['xl-4'])}>
                            <div className={clsx(styles.infor)}>
                                <div className={clsx(styles.name)}>
                                    <h1>{data.name}</h1>
                                </div>
                                <div className={clsx(styles.goToShop)}>
                                    <Link to='/shop'>Back to shop</Link>
                                </div>
                                <div className={clsx(styles.price)}>
                                    <span>{`$${data.price}`}</span>
                                </div>
                                <div className={clsx(styles.size)}>
                                    <p>Size</p>
                                    {size.map((element, index) => {
                                        return (
                                            <div key={index} className={clsx(styles.sizeItem)}>
                                                <input
                                                    type='radio'
                                                    value={`${element}`}
                                                    checked={checked === index}
                                                    onChange={() => {
                                                        setChecked(index)
                                                    }}
                                                >
                                                </input>
                                                <span>{element}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className={clsx(styles.handleBag)}>
                                    {quantityDisplay(quantityOfProduct(cart))}
                                    <button
                                        className={clsx({
                                            [styles.blackText]: quantityOfProduct(cart) > 0,
                                            [styles.show]: true
                                        })}
                                        onClick={addToBag}
                                    >
                                        <span>Add to Bag</span>
                                    </button>
                                    <Link
                                        to='/shop/cart'
                                        className={clsx({
                                            [styles.show]: quantityOfProduct(cart) > 0
                                        })}
                                    >
                                        <span>Go to checkout</span>
                                    </Link>
                                </div>
                                <div className={clsx(styles.details)}>
                                    <span>Product Details</span>
                                    <p>{data.description}</p>
                                </div>
                                <div className={clsx(styles.favorite)}>
                                    <p>Save this product for later</p>
                                    <div className={clsx(styles.btnWrapper)}>
                                        <button
                                            title={favContent.title}
                                            onClick={() => { handleFavbtn(data) }}>
                                            {favContent.state === 0
                                                ?
                                                <AiOutlineHeart className={clsx(styles.favIcon)} />
                                                :
                                                <AiFillHeart className={clsx(styles.favIcon)} />
                                            }
                                            <span>{favContent.content}</span>
                                        </button>
                                        <Link to='/shop/favorites' className={clsx(styles.favLink, {
                                            [styles.favLinkHide]: !onFavList
                                        })}>
                                            <span>View Favorites</span>
                                        </Link>
                                    </div>
                                </div>
                                <div className={clsx(styles.socialShare)}>
                                    <p>Share this product with your friends</p>
                                    <div className={clsx(styles.shareLink)}>
                                        <a href='https://reactrouter.com'>
                                            <BsFacebook className={clsx(styles.fbIcon, styles.icon)} />
                                            <span>Share</span>
                                        </a>
                                        <a href='https://reactrouter.com'>
                                            <BsTwitter className={clsx(styles.tweetIcon, styles.icon)} />
                                            <span>Tweet</span>
                                        </a>
                                        <a href='https://reactrouter.com'>
                                            <BsPinterest className={clsx(styles.pinIcon, styles.icon)} />
                                            <span>Pin it</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
        }
            <ProductComment productId={id} />
        </>
    )
}