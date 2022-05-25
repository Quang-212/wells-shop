import clsx from 'clsx'
import { useSearchParams, createSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ProductItem from '../../../components/productItem/ProductItem'
import styles from './productList.module.scss'
import Paginations from '../../../components/paginations/Paginations'
import Skeleton from '../../../components/skeleton/ProductCardSkeleton'
import { getAllWithPagination } from '../../../api/product'

function ProductShow() {
    document.title = 'Shop | WELLS'
    window.scrollTo(0, 300)
    const [loading, setLoading] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const currentParams = Object.fromEntries([...searchParams])
    const [pagination, setPagination] = useState({
        totalItems: 20,
        itemsPerPage: 6,
        currentPage: parseInt(currentParams.page) || 1
    })
    const sortOptions = [
        { id: 0, content: 'Newest arrivals', query: { key: 'createdAt', value: 'desc' } },
        { id: 1, content: 'Price: Low to High', query: { key: 'price', value: 'asc' } },
        { id: 2, content: 'Price: High to Low', query: { key: 'price', value: 'desc' } },
        { id: 3, content: 'Name: A to Z', query: { key: 'name', value: 'asc' } },
        { id: 4, content: 'Name: Z to A', query: { key: 'name', value: 'desc' } }
    ]
    const sortInitial = currentParams.sortBy && currentParams.order
        ? sortOptions.find(e => e.query.key === currentParams.sortBy && e.query.value === currentParams.order)
        : sortOptions[0]
    const [sort, setSort] = useState(sortInitial)
    const [data, setData] = useState([])

    useEffect(() => {
        const search = createSearchParams({
            page: pagination.currentPage,
            perPage: pagination.itemsPerPage,
            [`sort[${sort.query.key}]`]: sort.query.value,

        })
        if (pagination.currentPage === 1 && sort.query.key === 'createdAt') {
            setSearchParams({})
        }
        else {
            setSearchParams({
                page: pagination?.currentPage,
                sortBy: sort?.query?.key,
                order: sort?.query?.value,
            })
        }
        (async () => {
            setLoading(true)
            try {
                const result = await getAllWithPagination(search.toString())
                setLoading(false)
                setData(result.data.data)
                setPagination({
                    ...pagination,
                    totalItems: result.data.total
                })
            }
            catch (err) {
                console.error(err?.response)
            }
        })()
    }, [pagination.currentPage, sort])

    useEffect(() => {
        setPagination({
            ...pagination,
            currentPage: parseInt(currentParams.page) || 1
        })
    }, [currentParams.page])
    const handlePageChange = (newPage) => {
        setPagination({
            ...pagination,
            currentPage: newPage
        })
    }
    const handleSortSelect = (event) => {
        const index = event.target.value
        setSort(sortOptions[index])
        setPagination({
            ...pagination,
            currentPage: 1
        })
    }
    return (
        <>
            {loading ? <Skeleton /> :
                <>
                    <div className={clsx(styles.sortWrap)}>
                        <span>Sort by: </span>
                        <select defaultValue={sort.id} onChange={handleSortSelect} name="sort" id="sort">
                            {sortOptions.map((option, i) =>
                                <option key={i} value={i}>{option.content}</option>
                            )}
                        </select>
                    </div>
                    <div className={clsx(styles.grid, styles.row)}>
                        {data.map(product =>
                            <div key={product._id} className={clsx(styles.col, styles['xl-4'], styles['lg-4'], styles['md-6'], styles['sm-6'], styles['xs-12'])}>
                                <ProductItem product={product} />
                            </div>)
                        }
                        <div className={clsx(styles.pagination)}>
                            <Paginations
                                pagination={pagination}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default ProductShow