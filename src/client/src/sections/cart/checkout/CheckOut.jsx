import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { CgDanger } from 'react-icons/cg'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { BsXLg } from 'react-icons/bs'
import clsx from 'clsx'
import styles from './checkout.module.scss'
import Address from '../../../api/address'
import { userCartUpdate } from '../../../api/user'
import { addOrderToDB } from '../../../api/order'
import { SubmitButton } from '../../../components/button/buttonStore'
import { orderAdd } from '../../../redux/features/orderSlice'
import { cartDelete, cartSelectDelete, cartQuantityPick } from '../../../redux/features/cartSlice'

export default function Cart() {

    document.title = 'Cart | WELLS'
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loggedIn = useSelector(state => state.auth.isLoggedIn)
    const user = useSelector(state => state.auth.user)
    const cart = useSelector(state => state.cart)
    const [checked, setChecked] = useState([])
    const order = cart.filter((item, i) => checked.includes(i))
    const emptyOrder = order[0] === undefined ? true : false
    const [address, setAddress] = useState({
        provinces: [],
        districts: [],
        wards: []
    })
    const [userAddress, setUserAddress] = useState({
        province: '',
        district: '',
        ward: ''
    })
    const schema = yup.object().shape({
        fullname: yup
            .string()
            .required('This field is required'),
        phone: yup
            .number()
            .typeError('Phone must be a number')
            .min(10000000, 'Phone is invalid')
            .required('This field is required'),
        street: yup
            .string()
            .required('Street field is required'),
    })

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: {
            fullname: user.username || ''
        }
    })
    const renderOption = (optionNumber) => {
        const res = []
        for (let i = 1; i <= optionNumber; i++) {
            res.push(
                <option
                    value={i}
                    key={i}>
                    {i}
                </option>)
        }
        return res
    }
    useEffect(() => {
        if (loggedIn === 1) {
            (async () => {
                try {
                    const res1 = await userCartUpdate(cart)
                    localStorage.setItem('cart', JSON.stringify(cart))
                    console.log(res1.data)
                } catch (err) {
                    console.log(err.response)
                }
            })()
        }
    }, [cart])
    useEffect(() => {
        (async () => {
            const res = await Address.getProvince()
            setAddress(prev => {
                return {
                    ...prev,
                    provinces: res.data.results
                }
            })
        })()
    }, [])
    const handleProvinceChange = async (event) => {
        const provinceSelected = address.provinces.find((e) => {
            return e.province_id === event.target.value
        })
        const res = await Address.getDistrict(event.target.value.toString())
        setAddress((prev) => {
            return {
                ...prev,
                districts: res.data.results
            }
        })
        setUserAddress((prev => {
            return {
                ...prev,
                province: provinceSelected?.province_name
            }
        }))
    }
    const handleDistrictChange = async (event) => {
        const districtSelected = address.districts.find((e) => {
            return e.district_id === event.target.value
        })
        const res = await Address.getWard(event.target.value.toString())
        setAddress((prev) => {
            return {
                ...prev,
                wards: res.data.results
            }
        })
        setUserAddress((prev => {
            return {
                ...prev,
                district: districtSelected?.district_name
            }
        }))
    }
    const handleWardChange = (event) => {
        const wardSelected = address.wards.find((e) => {
            return e.ward_id === event.target.value
        })
        setUserAddress((prev => {
            return {
                ...prev,
                ward: wardSelected?.ward_name
            }
        }))
    }
    const totalBill = () => {
        return order.reduce((s, e) => {
            return s += (e.count * e.price)
        }, 0)
    }
    const handleOrderCheck = (event) => {
        const checkValue = parseInt(event.target.value, 10)
        if (checked.includes(checkValue)) {
            setChecked(checked.filter(e => e !== checkValue))
        } else {
            checked.push(checkValue)
            setChecked([...checked])
        }
    }
    const submitText = () => {
        if (emptyOrder) {
            return "No product is selected"
        } else if (!userAddress.province || !userAddress.district || !userAddress.ward) {
            return "Address is missing"
        } else {
            return "Place Order"
        }
    }
    const onSubmit = async (data) => {
        try {
            const res = await addOrderToDB({
                email: user.email,
                recipient: data.fullname,
                phone: data.phone,
                postalCode: data.code,
                address: `${data.street}-${userAddress.ward}-${userAddress.district}-${userAddress.province}`,
                bill: {
                    products: order,
                    total: `$${totalBill().toFixed(2)}`
                }
            })
            dispatch(orderAdd({
                order,
                total: totalBill().toFixed(2)
            }))
            dispatch(cartSelectDelete(checked))
            navigate('/shop/order')
            console.log(res.data)
        } catch (err) {
            console.log(err.response)
        }
        console.log(data.ward)
    }

    return (
        <>
            {cart[0] === undefined
                ?
                <div className={clsx(styles.empty)}>
                    <span>Your shopping cart is empty</span>
                    <Link to='/shop'>
                        <span>Browse store</span>
                    </Link>
                </div>
                :
                <div className={clsx(styles.row, styles.wrapper)}>
                    <div className={clsx(styles.col, styles['xl-4'])}>
                        <div className={clsx(styles.itemList)}>
                            <div className={clsx(styles.title)}>
                                <h1>Shopping cart</h1>
                            </div>
                            {cart.map((ele, i) => {
                                return (
                                    <div key={i} className={clsx(styles.item)}>
                                        <div className={clsx(styles.itemSelect)}>
                                            <input type="checkbox" value={i} onChange={handleOrderCheck} />
                                        </div>
                                        <div style={{ backgroundImage: `url(${ele.image.url})` }} className={clsx(styles.image)}></div>
                                        <div className={clsx(styles.content)}>
                                            <div className={clsx(styles.topLine)}>
                                                <div className={clsx(styles.name)}>
                                                    <span>{ele.name}</span>
                                                </div>
                                                <div className={clsx(styles.delete)}
                                                    onClick={() => {
                                                        dispatch(cartDelete({
                                                            index: i
                                                        }))
                                                    }}
                                                >
                                                    <BsXLg className={clsx(styles.icon)} />
                                                </div>
                                            </div>
                                            <div className={clsx(styles.size)}>
                                                <span>{`Size: ${cart[i] === undefined ? '' : cart[i].size}`}</span>
                                            </div>
                                            <div className={clsx(styles.botLine)}>
                                                <div className={clsx(styles.quantity)}>
                                                    <span>Quantity: </span>
                                                    <select
                                                        defaultValue={cart[i] === undefined ? 1 : cart[i].count}
                                                        onChange={(e) => { dispatch(cartQuantityPick({ id: cart[i].id, quantity: parseInt(e.target.value, 10) })) }}
                                                    >
                                                        {renderOption(10)}
                                                    </select>
                                                </div>
                                                <div className={clsx(styles.price)}>
                                                    <span>{`$${(cart[i].price * cart[i].count).toFixed(2)}`}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className={clsx(styles.selectedQuantity)}>
                            <span>{emptyOrder ? 'No product is selected' : `Selected product: ${order.reduce((s) => s += 1, 0)}`}</span>
                        </div>
                        <div className={clsx(styles.totalBill)}>
                            <span>TOTAL</span>
                            <span>{`$${totalBill().toFixed(2)}`}</span>
                        </div>
                        <div className={clsx(styles.linkToShop)}>
                            <p>Looking for more?</p>
                            <Link to='/shop'>
                                <span>Continue shopping</span>
                            </Link>
                        </div>
                    </div>
                    <div className={clsx(styles.col, styles['xl-8'])}>
                        <div className={clsx(styles.checkout)}>
                            <div className={clsx(styles.checkoutTitle)}>
                                <h2>Payment information</h2>
                            </div>
                            <div className={clsx(styles.paymentMethod)}>
                                <input type="radio" id="cash" checked readOnly />
                                <label htmlFor="cash">Pay by cash</label>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className={clsx(styles.content)}>
                                <h2>Billing address</h2>
                                <p>All fields are required unless they’re explicitly marked as optional.</p>
                                <div className={clsx(styles.info)}>
                                    <div className={clsx(styles.name)}>
                                        <label htmlFor="name">Full name</label>
                                        {errors.fullname ? <CgDanger style={{ fontSize: '1.6rem', color: 'red', marginLeft: '4px' }} /> : <div style={{ height: '19px' }}></div>}
                                        <input type="text" style={errors.fullname && { borderColor: 'red', outlineColor: 'red', color: 'red' }} placeholder={errors.fullname ? errors.fullname.message : ''} {...register('fullname')} id="name" autoComplete="off" />
                                    </div>
                                    <div className={clsx(styles.phone)}>
                                        <label htmlFor="phone">Phone</label>
                                        {errors.phone ? <CgDanger style={{ fontSize: '1.6rem', color: 'red', marginLeft: '4px' }} /> : <div style={{ height: '19px' }}></div>}
                                        <input type="text" style={errors.phone && { borderColor: 'red', outlineColor: 'red', color: 'red' }} placeholder={errors.phone ? errors.phone.message : ''} {...register('phone')} id="phone" />
                                    </div>
                                </div>
                                <div className={clsx(styles.address)}>
                                    <label>Address</label>
                                    <select
                                        onChange={handleProvinceChange}
                                        title="Province"
                                    >
                                        <option>---Select Province---</option>
                                        {address.provinces.map((province, i) => {
                                            return (
                                                <option key={i} value={province.province_id}>
                                                    {province.province_name}
                                                </option>
                                            )
                                        })}
                                    </select>
                                    <div className={clsx(styles.inline)}>
                                        <div className={clsx(styles.group)}>
                                            <select

                                                onChange={handleDistrictChange}
                                                title="District"
                                            >
                                                <option>{address.districts[0] === undefined ? 'Please select province first' : '---Select District---'}</option>
                                                {address.districts.map((district, i) => {
                                                    return (
                                                        <option key={i} value={district.district_id}>{district.district_name}</option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                        <div className={clsx(styles.group)}>
                                            <input type="text" {...register('code')} placeholder="Postal code (optional)" />
                                        </div>
                                    </div>
                                    <select
                                        onChange={handleWardChange}
                                        title="Ward"
                                    >
                                        <option>{address.wards[0] === undefined ? 'Please select district first' : '---Select Ward---'}</option>
                                        {address.wards.map((ward, i) => {
                                            return (
                                                <option key={i} value={ward.ward_id}>{ward.ward_name}</option>
                                            )
                                        })}
                                    </select>
                                    {errors.street ? <CgDanger style={{ fontSize: '1.6rem', color: 'red', marginLeft: '4px' }} /> : <div style={{ height: '19px' }}></div>}
                                    <input type="text" {...register('street')} style={errors.street && { borderColor: 'red', outlineColor: 'red', color: 'red' }} placeholder={errors.street ? errors.street.message : "Street address, apartment, suite, floor, etc"} />
                                </div>
                                <SubmitButton disabled={emptyOrder || !userAddress.province || !userAddress.district || !userAddress.ward} className={clsx(styles.submit)}>
                                    {submitText()}
                                </SubmitButton>
                            </form>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}