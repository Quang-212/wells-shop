import { useRef } from 'react'
import clsx from 'clsx'
import {BiChevronsRight, BiChevronsLeft} from 'react-icons/bi'
import styles from './paginations.module.scss'


export default function Paginations({ pagination, onPageChange }) {

    let {currentPage, totalItems, itemsPerPage} = pagination
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const createArray = (start, end) => {
        const array = []
        let i = start
        while (i <= end && end <= totalPages) {
            array.push(i)
            i++
        }
        return array
    }
    const handleRange = (number)=>{
        if(number>=7){
            return 7
        }else{
            return number
        }
    }
    const range = useRef()
    
        if (currentPage <= 3) {
            range.current = createArray(1, handleRange(totalPages))
        } else if (currentPage >= totalPages - 3) {
            range.current = createArray(totalPages - 6, totalPages)
        }
        else {
            range.current = createArray(currentPage - 3, currentPage + 3)
        }

    return (
        <div className={clsx(styles.wrapper)}>

            <button
                onClick={() => {
                    onPageChange(currentPage-1)
                }}
                className={clsx(styles.goByStep)}
                disabled={currentPage <= 1}

            >
                <BiChevronsLeft className={clsx(styles.icon)}/>
            </button>

            {range.current.map((element, index) => {

                return (
                    <button
                        onClick={() => {
                            onPageChange(element)
                        }}
                        key={index}
                        className={clsx(styles.goByNumber, {
                            [styles.currentPage]: currentPage === element 
                        })}
                    >
                        {element}
                    </button>
                )
            })}

            <button
                onClick={() => {
                    onPageChange(currentPage + 1)
                }}
                className={clsx(styles.goByStep)}
                disabled={currentPage >= totalPages}
            >
                <BiChevronsRight className={clsx(styles.icon)} />
            </button>
        </div>
    )
}