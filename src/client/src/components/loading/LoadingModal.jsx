import './loadingModal.scss'

export default function LoadingModal() {
    return (
        <div className='modal'>
            <div className='loading'>
                <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>
        </div>

    )
}