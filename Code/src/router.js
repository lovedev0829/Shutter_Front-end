import React, { Suspense, Fragment, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SidebarLayout from './Layout/SidebarLayout';
import Authenticated from './Guard/Authenticated';
import Guest from './Guard/Guest';
import BaseLayout from './Layout/BaseLayout';
import LoadScreen from './Component/loaderScreen';
export function RenderRout() {
 
  const token = localStorage.getItem('accessToken')
  
  const url = window.location.pathname

  // if(!token && (url !== '/login' && url !== '/admin')){
  //     window.location.href = '/login'
  // } else if (token && url == "/") {
  //     window.location.href = '/dashboard'
  // } else if(!token && url == "/") {
  //     window.location.href = '/login' 
  // }

  return (
    <>
      <Router>
        <Suspense fallback={<LoadScreen/>}
        >
          <Routes>
            {routes?.map((route, i) => {
              const Guard = route?.guard || Fragment;
              const Auth = route?.auth || Fragment;
              const Layout = route?.layout || Fragment;
              const Component = route?.element;
              return (
                <Route
                  key={i}
                  path={route.path}
                  exact={route.exact}
                  element={
                    <Guard>
                      <Auth>
                        <Layout >
                          <Component />
                        </Layout>
                      </Auth>
                    </Guard>
                  }
                />
              );
            })}
          </Routes>
        </Suspense>
      </Router>
    </>
  )

}

const routes = [

  // Auth Pages 
 
  {
    guard: Guest,
    layout: BaseLayout,
    exact: true,
    path: '/',
    element: lazy(() => import('./Component/Pages/Auth/Login'))
  },
  {
    guard: Guest,
    layout: BaseLayout,
    exact: true,
    path: '/login',
    element: lazy(() => import('./Component/Pages/Auth/Login'))
  },


  // forget password
  
  {
    guard: Guest,
    layout: BaseLayout,
    exact: true,
    path: '/forget-password',
    element: lazy(() => import('./Component/Pages/forget-password/ForgetPassword'))

  },
  {
    guard: Guest,
    layout: BaseLayout,
    exact: true,
    path: '/reset-password/:type/:token',
    element: lazy(() => import('./Component/Pages/forget-password/ResetPassword'))

  },
  
//chnage password
{
  guard: Authenticated,
  layout: SidebarLayout,
  exact: true,
  path: '/chnage-password',
  element: lazy(() => import('./Component/Pages/Auth/UpdatePassword'))

},

 //Update Profile 
 {
  guard: Authenticated,
  layout: SidebarLayout,
  exact: true,
  path: '/update-profile',
  element: lazy(() => import('./Component/Pages/Auth/UpdateProfile'))

},
 //setting
 {
  guard: Authenticated,
  layout: SidebarLayout,
  exact: true,
  path: '/setting',
  element: lazy(() => import('./Component/Pages/Auth/Setting'))

},
 
  //Dashboard Pages
  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/dashboard',
    element: lazy(() => import('./Component/Pages/Dasboards/Index'))

  },
  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/configuration/:code?',
    element: lazy(() => import('./Component/Pages/Configuration/Index'))

  },
  

  //Contacts Pages
  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/contacts',
    element: lazy(() => import('./Component/Pages/Contacts/Index'))

  },
   {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/datatable',
    element: lazy(() => import('./Component/Pages/Contacts/TestDatatable'))

  },
  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/contacts/detail/:contactId',
    element: lazy(() => import('./Component/Pages/Contacts/Detail'))

  },


  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/contacts/job/:JobId',
    element: lazy(() => import('./Component/Pages/Jobs/JobDetiels'))

  },
  

  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/tenant',
    element: lazy(() => import('./Component/Pages/Tenent/Index'))

  },

  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/subtenant',
    element: lazy(() => import('./Component/Pages/SubTenent/Index'))

  },

  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/subtenant/:id?',
    element: lazy(() => import('./Component/Pages/SubTenent/Sycghl'))

  },


 

  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/users',
    element: lazy(() => import('./Component/Pages/Users/Index'))

  },
  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/job/:id?',
    element: lazy(() => import('./Component/Pages/Jobs/AllJob'))

  },
  //Material 
  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/material',
    element: lazy(() => import('./Component/Pages/Material/Index'))

  },
  //Component
  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/component',
    element: lazy(() => import('./Component/Pages/Component/Index'))

  },
  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/component/detail/:componentId',
    element: lazy(() => import('./Component/Pages/Component/Details'))

  },
  
  //Vender 
  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/vendors',
    element: lazy(() => import('./Component/Pages/Vender/Index'))

  },
  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/vendors/detail/:vendorId',
    element: lazy(() => import('./Component/Pages/Vendor-Order/VendorOrderDetail'))

  },

  //Options 
  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/options',
    element: lazy(() => import('./Component/Pages/Option/Index'))

  },

   //PowderCoatColor 
  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/powdercoatcolor',
    element: lazy(() => import('./Component/Pages/PowderCoatColor/Index'))

  },

  //Products 
  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/products',
    element: lazy(() => import('./Component/Pages/Products/Index'))

  },

  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/products/detail/:productId',
    element: lazy(() => import('./Component/Pages/Products/Details'))

  },
//orders
{
  guard: Authenticated,
  layout: SidebarLayout,
  exact: true,
  path: '/order',
  element: lazy(() => import('./Component/Pages/Orders/AllOrderList'))

},


  //Taxes
  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/tax',
    element: lazy(() => import('./Component/Pages/Taxes/Index'))

  },
  //discount
  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/discount',
    element: lazy(() => import('./Component/Pages/Discount/Index'))

  },
 
  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/products/detail/:productId',
    element: lazy(() => import('./Component/Pages/Products/Details'))

  },

  //Estimate

  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/contacts/estimate/:JobId',
    element: lazy(() => import('./Component/Pages/Estimate/Index'))

  },

  //  invoice
  {
    guard: Authenticated,
    exact: true,
    path: '/contacts/invoicepreview/:InvoiceId',
    element: lazy(() => import('./Component/Pages/Invoice/InvoicePreview'))

  },
  //payment
  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/contacts/payment/:invoiceId',
    element: lazy(() => import('./Component/Pages/Payment/Index'))

  },
  //report
  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/reports',
    element: lazy(() => import('./Component/Pages/Report/Index'))

  },

  
  
  //Expression

  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/expression',
    element: lazy(() => import('./Component/Pages/Expression/Index'))

  },

  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/optionexpression',
    element: lazy(() => import('./Component/Pages/OptionExpression/Index'))

  },

  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/contacts/estimate/:JobId/:estimateId',
    element: lazy(() => import('./Component/Pages/Estimate/Index'))

  },


  {
    layout: BaseLayout,
    exact: true,
    path: '/contacts/estimate/preview/:estimateId',
    element: lazy(() => import('./Component/Pages/Estimate/PreviewEstimate'))

  },


  {
    layout: BaseLayout,
    exact: true,
    path: '/contacts/order/preview/:orderId',
    element: lazy(() => import('./Component/Pages/Orders/PreviewOrder'))

  },

  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/contacts/invoice/:JobId/:orderId',
    element: lazy(() => import('./Component/Pages/Orders/Index'))

  },

  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/estimationbreakdown',
    element: lazy(() => import('./Component/Pages/ContactBreakdown/Index'))

  },

  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/archivecustomer',
    element: lazy(() => import('./Component/Pages/Archivecustomer/Index'))

  },
//productmarkup
  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/productmarkup',
    element: lazy(() => import('./Component/Pages/SubtenantProductMarkup/Index'))

  },
  //cutsheet
  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/cutsheet',
    element: lazy(() => import('./Component/Pages/CutSheet/Index'))

  },

  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/cutsheet/view/:id?',
    element: lazy(() => import('./Component/Pages/CutSheet/ViewCutSheet'))

  },

  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/producttype',
    element: lazy(() => import('./Component/Pages/ProductType/Index'))

  },

  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/managepartnerproduct/:tenantId?',
    element: lazy(() => import('./Component/Pages/Products/ProductEdit'))

  },

  
  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/JobTitle',
    element: lazy(() => import('./Component/Pages/Jobtitle/Index'))

  },

  {
    guard: Authenticated,
    layout: SidebarLayout,
    exact: true,
    path: '/Jobtype',
    element: lazy(() => import('./Component/Pages/JobType/Index'))

  },
  
  {
    layout: BaseLayout,
    exact: true,
    path: '/payment_success',
    element: lazy(() => import('./Component/Pages/Stripe/PaymentSucess'))

  },
  {
    layout: BaseLayout,
    exact: true,
    path: '/payment_cancel',
    element: lazy(() => import('./Component/Pages/Stripe/PaymentFailed'))

  },
  ///404 Page
 {
    layout: BaseLayout,
    exact: true,
     path: '/emailconfiguration/:type?',
    element: lazy(() => import('./Component/Pages/Stripe/EmailSucess'))
  },
  {
    layout: BaseLayout,
    exact: true,
    path: '*',
    element: lazy(() => import('./Component/PageNotFound'))

  },
  {
    layout: BaseLayout,
    exact: true,
    path: '/404',
    element: lazy(() => import('./Component/PageNotFound'))

  },
  
]