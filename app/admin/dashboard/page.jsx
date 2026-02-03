import { Suspense } from "react"
import DashboardData from "./components/DashboardData"

export const dynamic = 'force-dynamic';


const page = () => {
  return (
    <div>
      <Suspense fallback={<div className="flex items-center justify-center">Loading Dashboard Data....</div>}>
        <DashboardData/>
      </Suspense>
    </div>
  )
}

export default page
