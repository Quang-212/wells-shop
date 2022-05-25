import React from 'react'
import './loadingIcon.scss'
export default function LoadingIcon({ ...others }) {
    return (
        <div {...others} class="lds-dual-ring"></div>
    )
}
