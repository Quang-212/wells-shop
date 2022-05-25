
import { Outlet } from 'react-router-dom'
import Nav from '../../sections/navbar/Nav'
import Footer from '../../sections/footer/Footer'


import React from 'react'

const Layout = () => {
  return (
    <>
      <Nav />
      <Outlet />
      <Footer />
    </>
  )
}

export default Layout