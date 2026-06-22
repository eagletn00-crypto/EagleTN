import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import PartnerDashboard from './screens/PartnerDashboard'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PartnerDashboard />,
  },
])
