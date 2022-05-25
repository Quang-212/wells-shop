import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import { getAllProducts } from '../../../api/product.js'
import { useSelector } from 'react-redux'
import { IoIosReverseCamera } from 'react-icons/io'
import { TiArrowBackOutline } from 'react-icons/ti'
import { RiBillLine, RiUserSettingsLine, RiDeleteBin6Line } from 'react-icons/ri'
import { CgProductHunt } from 'react-icons/cg'
import { MdOutlineSupervisorAccount } from 'react-icons/md'
import { BsCashCoin } from 'react-icons/bs'
import AddProduct from '../addProduct/AddProduct'
// import { SubmitButton } from '../button/buttonStore'
import styles from './account.module.scss'
import { FaPencilAlt } from 'react-icons/fa'

const Account = () => {

    const navigate = useNavigate()
    const user = useSelector(state => state.auth.user)
    const [addProductShow, setAddProductShow] = useState(false)
    const [data, setData] = useState([])
    const [currentProduct, setCurrentProduct] = useState({})

    useEffect(() => {
        if (user.isAdmin) {
            (async () => {
                const res = await getAllProducts()
                setData(res.data)
            })()
        }
    }, [addProductShow])
    const rightBars = [{
        icon: RiBillLine,
        count: '300K',
        content: 'Orders'
    }, {
        icon: CgProductHunt,
        count: '9.876K',
        content: 'Products'
    }, {
        icon: MdOutlineSupervisorAccount,
        count: '1.234K',
        content: 'Users'
    }, {
        icon: BsCashCoin,
        count: '$5678',
        content: 'Revenue'
    },
    ]
    const revenue = [{
        source: 'Direct',
        percentage: 70
    },
    {
        source: 'External search',
        percentage: 40
    },
    {
        source: 'Referal',
        percentage: 60
    },
    {
        source: 'Social',
        percentage: 30
    },]

    const handleUpdateProduct = (product) => {
        setCurrentProduct(product)
        setAddProductShow(!addProductShow)
    }
    const handleDeleteProduct = (id) => {
        console.log(id)
    }
    return (

        <div className={clsx(styles.wrapper)}>
            <div className={clsx(styles.leftBar)}>
                <div className={clsx(styles.avatar)} style={{ backgroundImage: `url(${user.profilePhoto})` }}>
                    <label htmlFor="upadate-avatar">
                        <IoIosReverseCamera title='Update avatar' className={clsx(styles.camIcon)} />
                    </label>
                    <input type='file' id='upadate-avatar' className={clsx(styles.imageSelect)} hidden />
                </div>
                <div className={clsx(styles.name)}>{`${user.displayName}`}</div>
                <div className={clsx(styles.role)}>{user.isAdmin ? 'Admin' : 'Normal user'}</div>
                <ul className={clsx(styles.feature)}>
                    {user.isAdmin
                        ?
                        <>
                            <li className={clsx(styles.leftItem)}>
                                <RiBillLine className={clsx(styles.leftIcon)} />
                                <span>Orders</span>
                            </li>
                            <li className={clsx(styles.leftItem, styles.active)}>
                                <CgProductHunt className={clsx(styles.leftIcon)} />
                                <span>Products</span>
                            </li>
                            <li className={clsx(styles.leftItem)}>
                                <MdOutlineSupervisorAccount className={clsx(styles.leftIcon)} />
                                <span>Users</span>
                            </li>
                        </>
                        :
                        null
                    }
                    <li className={clsx(styles.leftItem)}>
                        <RiUserSettingsLine className={clsx(styles.leftIcon)} />
                        <span>Account</span>
                    </li>
                    <div onClick={() => {
                        navigate('/shop')
                    }} className={clsx(styles.leftItem)}>
                        <TiArrowBackOutline className={clsx(styles.leftIcon)} />
                        <span>Go back</span>
                    </div>
                </ul>

            </div>
            <AddProduct
                hide={!addProductShow}
                close={() => {
                    setAddProductShow(!addProductShow)
                }}
                currentProduct={currentProduct}
            />
            <div className={clsx(styles.main)}>

                <div className={clsx(styles.mainHeader)}>
                    <h1>Products</h1>
                    <div onClick={() => {
                        setAddProductShow(!addProductShow)
                    }}
                        className={clsx(styles.addProduct)}>
                        <span>New Product</span>
                    </div>
                </div>
                <table className={clsx(styles.table)}>
                    <thead valign='middle' align='center'>
                        <tr>
                            <td>#</td>
                            <td>Serial</td>
                            <td>Name</td>
                            <td>Image</td>
                            <td>Price</td>
                            <td>Size</td>
                            <td>Description</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody valign='middle' align='center'>
                        {data.map((product, i) => {
                            return (
                                <tr key={i}>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>{i + 1}</td>
                                    <td>{product.name}</td>
                                    <td>
                                        <div style={{ backgroundImage: `url(${product.image.url})` }} className={clsx(styles.image)}></div>
                                    </td>
                                    <td>{product.price}</td>
                                    <td>{product.size.join("-")}</td>
                                    <td>
                                        <p>{product.description}</p>
                                    </td>
                                    <td >
                                        <div style={{ height: "100%", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                            <FaPencilAlt className={clsx(styles.actionIcon)} onClick={() => handleUpdateProduct(product)} title='Update' />
                                            <RiDeleteBin6Line className={clsx(styles.actionIcon)} onClick={() => handleDeleteProduct(product._id)} title='Delete' />
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div className={clsx(styles.rightBar)}>
                <div className={clsx(styles.section1)}>
                    <h2>Overall</h2>
                    <ul className={clsx(styles.content)}>
                        {rightBars.map((item, i) => {
                            return (
                                <li key={i} className={clsx(styles.rightItem)}>
                                    <div className={clsx(styles.rightIcon)} >
                                        <item.icon className={clsx(styles.icon)} />
                                    </div>
                                    <div className={clsx(styles.des)}>
                                        <span>{item.count}</span>
                                        <span>{item.content}</span>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className={clsx(styles.section2)}>
                    <h2>Revenue by chanel</h2>
                    <ul className={clsx(styles.chanel)}>
                        {revenue.map((chanel, i) => {
                            return (
                                <li key={i} className={clsx(styles.chanelItem)}>
                                    <div className={clsx(styles.des)}>
                                        <span>{chanel.source}</span>
                                        <span style={chanel.percentage >= 60 ? { color: 'red' } : null}>{`${chanel.percentage}%`}</span>
                                    </div>
                                    <div className={clsx(styles.progess)} >
                                        <div className={clsx(styles.percentage)} style={{ width: chanel.percentage }}></div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div >
        </div >
    )
}

export default Account