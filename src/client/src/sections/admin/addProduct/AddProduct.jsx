import clsx from "clsx"
import { useState, useEffect } from 'react'
import { AiOutlineFullscreenExit } from 'react-icons/ai'
import { FaImage } from 'react-icons/fa'
import styles from './addProduct.module.scss'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { addProduct } from '../../../api/product'

function AddProduct({ hide, close, currentProduct }) {
    console.log(currentProduct)
    useEffect(() => {
        document.title = 'Product | WELLS'
    }, [])
    const schema = yup.object().shape({
        name: yup
            .string()
            .required('Please enter product\'s name'),
        price: yup
            .number('Hay nhap gia tri so')
            .typeError('Plase enter price by a number')
            .required('Please enter product\'s price'),
        size: yup
            .array()
            .typeError('Wrong syntax, try again')
            .required('Please enter product\'s size'),
        description: yup
            .string()
            .required('Please enter product\'s description')

    })
    const typeSize = ['text', 'number']
    const textSize = ['XS', 'S', 'M', 'L', 'XL']
    const numberSize = [38, 39, 40, 41, 42]
    const [typeSizeCheck, setTypeSizeCheck] = useState(0)
    const [checked, setChecked] = useState([])
    const [file, setFile] = useState(null)
    const handleSizeCheck = (type, index) => {
        if (checked.includes(type[index])) {
            setChecked(checked.filter((size) => {
                return size !== type[index]
            }))
        } else {
            setChecked(prev => {
                return [...prev, type[index]]
            })
        }
    }

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            name: currentProduct?.name || 'a',
            price: currentProduct?.price || 0,
            size: currentProduct?.size || [],
            description: currentProduct?.description || ''
        }
    })
    const handleUploadFile = (e) => {
        URL.revokeObjectURL(file?.preview)
        const image = e.target.files[0]
        image.preview = URL.createObjectURL(image)
        setFile(image)
    }
    const handleTypeSizeChange = (index) => {
        setTypeSizeCheck(index)
        setChecked([])
    }
    const onSubmit = async (data) => {
        try {
            // setValue('size', [...])
            const formData = new FormData()
            formData.append('name', data.name)
            formData.append('image', file)
            formData.append('price', data.price)
            formData.append('size', JSON.stringify(data.size))
            formData.append('description', data.description)
            const product = await addProduct(formData)
            URL.revokeObjectURL(file?.preview)
            close()
            console.log(product.data)
        } catch (err) {
            console.log(err?.response)
        }
    }

    return (
        <div style={{ display: hide ? 'none' : 'block' }} className={clsx(styles.wrapper)}>
            <form encType="multipart/form-data" className={clsx(styles.content)} onSubmit={handleSubmit(onSubmit)}>
                <div style={{ height: '16px' }}>
                    <AiOutlineFullscreenExit onClick={close} className={clsx(styles.close)} />
                </div>
                <div className={clsx(styles.field)}>
                    <label>Name</label>
                    <input type='text' {...register('name')} className='' placeholder='Enter product name...' />
                    {errors.name && <p className={clsx(styles.err)}>{errors.name.message}</p>}
                </div>
                <div className={clsx(styles.field)}>
                    <label>Price</label>
                    <input type='text' {...register('price', {
                        setValueAs: v => v === '' ? undefined : parseFloat(v)
                    })} className='' placeholder='Enter product price...' />
                    {errors.price && <p className={clsx(styles.err)}>{errors.price.message}</p>}
                </div>
                <div className={clsx(styles.image)}>
                    <div>
                        <label htmlFor='product-image'>
                            <span>Choose image</span>
                            <FaImage className={clsx(styles.uploadIcon)} />
                        </label>
                        <input type='file' id='product-image' onChange={handleUploadFile} hidden accept="image/*" required />
                    </div>
                    <div style={{ backgroundImage: `url(${file?.preview})` }} className={clsx(styles.imagePreview)}></div>
                </div>
                <div className={clsx(styles.size)}>
                    <span>Size</span>
                    {typeSize.map((type, i) =>
                        <div key={i} className={clsx(styles.textSize, styles.typeSize)}
                        >
                            <input
                                type="radio"
                                id={`${type}Size`}
                                onChange={() => {
                                    handleTypeSizeChange(i)
                                }}
                                checked={typeSizeCheck === i}
                            />
                            <label htmlFor={`${type}Size`}>{`${type}`.toUpperCase()}</label>
                        </div>
                    )}
                    {
                        typeSizeCheck === 0
                            ?
                            textSize.map((e, i) => {
                                return (
                                    <div className={clsx(styles.sizeCheck)} key={i}>
                                        <p>{e}</p>
                                        <input
                                            {...register('size')}
                                            type='checkbox'
                                            onClick={() => {
                                                handleSizeCheck(textSize, i)
                                            }}
                                            checked={checked.includes(textSize[i])}
                                            className={clsx(styles.sizeItem)}
                                            value={e}
                                        />
                                    </div>
                                )
                            })
                            :
                            numberSize.map((e, i) => {
                                return (
                                    <div className={clsx(styles.sizeCheck)} key={i}>
                                        <p>{e}</p>
                                        <input
                                            {...register('size')}
                                            type='checkbox'
                                            onClick={() => {
                                                handleSizeCheck(numberSize, i)
                                            }}
                                            checked={checked.includes(numberSize[i])}
                                            className={clsx(styles.sizeItem)}
                                            value={e}
                                        />
                                    </div>
                                )
                            })
                    }
                </div>
                <div className={clsx(styles.field)}>
                    <label>Description</label>
                    <textarea {...register('description')} className={clsx(styles.textarea)} placeholder='Enter product description'></textarea>
                    {errors.description && <p className={clsx(styles.err)}>{errors.description.message}</p>}
                </div>
                <div className={clsx(styles.field)}>
                    <button type='sumbit' className={clsx(styles.btn)}>
                        <span>Add product</span>
                    </button>
                </div>
            </form>
        </div>
    )
}
export default AddProduct