import React, { lazy, Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import LoadingModal from '../components/loading/LoadingModal'
import AuthGuard from '../guard/AuthGuard'
import RoleBasedGuard from '../guard/RoleBaseGuard'

const Loadable = (Component, fallback) => {
    //return func- component
    return () =>
        <Suspense fallback={fallback ? <LoadingModal /> : <></>}>
            <Component />
        </Suspense>
}

export default function Router() {

    return useRoutes([
        {
            path: '/',
            element: <Layout />
            ,
            children: [
                { element: <Home />, index: true },
                { path: 'about', element: <About /> },
                { path: 'contacts', element: <Contact /> },
                {
                    path: 'shop', element: <ShopLayout />, children: [
                        { element: <ProductList />, index: true },
                        { path: 'product', element: <ProductDetails /> },
                        {
                            path: 'favorites', element: (
                                <AuthGuard>
                                    <Favorites />
                                </AuthGuard>
                            )
                        },

                        {
                            path: 'cart', element:
                                (<AuthGuard>
                                    <CheckOut />
                                </AuthGuard>)
                        }
                    ]
                },
                {
                    path: 'shop/order', element:
                        <AuthGuard>
                            <Order />
                        </AuthGuard>
                },
                {
                    path: 'auth',
                    children: [
                        { path: 'login', element: <Login /> },
                        { path: 'signup', element: <Signup /> },
                        { path: 'email-verify', element: <VerifyEmail /> },
                        {
                            path: 'recover',
                            children: [
                                { element: <Search />, index: true },
                                { path: 'send', element: <Send /> },
                                { path: 'verify-code', element: <VerifyPass /> },
                                { path: 'change-password', element: <ChangePassword /> },
                            ],
                        },
                    ]
                },
                {
                    path: 'admin',
                    element: <Dashboard />,
                    children: [
                        {
                            element:
                                (<RoleBasedGuard accessibleRoles={["admin"]}>
                                    <Product />
                                </RoleBasedGuard>),
                            index: true
                        },
                        {
                            path: 'user',
                            element:
                                (<RoleBasedGuard accessibleRoles={["admin"]}>
                                    {/* <Account /> */}
                                </RoleBasedGuard>)
                        },
                        {
                            path: 'order',
                            element:
                                (<RoleBasedGuard accessibleRoles={["admin"]}>
                                    {/* <Account /> */}
                                </RoleBasedGuard>)
                        },
                    ]
                },
                { path: '*', element: <NotFound /> }
            ]
        },

    ])
}

//main view
const Home = Loadable(lazy(() => import('../pages/home/Home')), true)
const About = Loadable(lazy(() => import('../pages/about/About')), true)
const Contact = Loadable(lazy(() => import('../pages/contact/Contact')), true)
//shop
const ProductList = Loadable(lazy(() => import('../sections/shop/productList/ProductList')), true)
const ProductDetails = Loadable(lazy(() => import('../sections/shop/productDetails/ProductDetails')), true)
const Favorites = Loadable(lazy(() => import('../sections/shop/favorites/Favorites')), true)
//auth
const Login = Loadable(lazy(() => import('../sections/login/Login')), true)
const Signup = Loadable(lazy(() => import('../sections/signup/Signup')))
const VerifyEmail = Loadable(lazy(() => import('../sections/signup/verifyEmail/VerifyEmail')))
//recover account
const Search = Loadable(lazy(() => import('../sections/recover/search/Search')))
const Send = Loadable(lazy(() => import('../sections/recover/sendEmail/Send')))
const VerifyPass = Loadable(lazy(() => import('../sections/recover/verifyPass/VerifyPass')))
const ChangePassword = Loadable(lazy(() => import('../sections/recover/changePassword/ChangePassword')))
//cart
const CheckOut = Loadable(lazy(() => import('../sections/cart/checkout/CheckOut')), true)
const Order = Loadable(lazy(() => import('../sections/cart/order/Order')), true)
//admin
const Dashboard = Loadable(lazy(() => import('../sections/admin/Dashboard')), true)
const Product = Loadable(lazy(() => import('../sections/admin/product/ProductList')), true)
//404page
const NotFound = Loadable(lazy(() => import('../pages/404Page/404Page')), true)
// layout
const Layout = Loadable(lazy(() => import('../layout/app/Layout')), true)
const ShopLayout = Loadable(lazy(() => import('../layout/shop/ShopLayout')), true)