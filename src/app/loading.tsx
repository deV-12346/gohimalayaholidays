import { Loader2 } from 'lucide-react'

const loading = () => {
  return (
    <div  className="flex justify-center items-center h-screen w-full">
    <Loader2 className="h-8 w-8 animate-spin text-indigo-600"/>
    </div>
  )
}

export default loading