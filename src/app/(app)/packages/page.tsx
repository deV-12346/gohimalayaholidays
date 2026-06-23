import Navbar from '@/components/Navbar'
import Packages from '@/components/packages/packages'
import React from 'react'

const page = () => {
  
  return (
    <div>
      <Navbar transparent={true} />
      <Packages/>
    </div>
  )
}

export default page