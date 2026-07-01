import Navbar from '@/components/layouts/Navbar'
import Packages from '@/components/packages/packages'
import React from 'react'

const page = () => {
  
  return (
    <div>
      <Navbar transparent={false} />
      <Packages/>
    </div>
  )
}

export default page