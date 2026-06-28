import Navbar from '@/components/Navbar'
import Packages from '@/components/packages/packages'
const page = () => {  
  return (
    <div>
      <Navbar transparent={true} />
      <Packages/>
    </div>
  )
}

export default page