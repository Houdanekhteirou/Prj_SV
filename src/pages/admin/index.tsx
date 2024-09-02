import { useQuery } from '@tanstack/react-query'
import 'chart.js/auto'
import React, { useMemo } from 'react'
import ChartsStepper from 'src/@core/components/chart_generate/form'
import CompletudeFileType from 'src/@core/components/dashboard/completudeFileType'
import CompletudeFOSA from 'src/@core/components/dashboard/completudeFosa'
import LogDashboard from 'src/@core/components/dashboard/log'
import QuantQualCharts from 'src/@core/components/dashboard/qualityQuantiyChart'
import FallbackSpinner from 'src/@core/components/spinner'
import { CanViewComponent } from 'src/@core/utils'
import { fetchCompletudePriveeFileType } from 'src/api/other'
import { PERMISSIONS } from 'src/constants'
import { useAuth } from 'src/hooks/useAuth'
import Can from 'src/layouts/components/acl/Can'

const AdminDashboard = () => {
  const [quarter, setQuarter] = React.useState(1)
  const [year, setYear] = React.useState(2024)
  const auth = useAuth()
  const { data, isLoading } = useQuery({
    queryKey: ['completudeFileType', year, quarter],
    queryFn: () => fetchCompletudePriveeFileType(year, quarter)
  })

  const { quantiyData, qualityData, TotalQuality, TotalQuantity } = useMemo(() => {
    if (isLoading || !data)
      return {
        quantiyData: [0, 0],
        qualityData: [0, 0],
        TotalQuality: 0,
        TotalQuantity: 0
      }

    const TotalQuantiyCompleted = data?.reduce((acc, obj) => {
      if (obj.frequencyId === 1) {
        return acc + obj.month1 + obj.month2 + obj.month3
      }

      return acc
    }, 0)
    const TotalQuantity = data?.reduce((acc, obj) => {
      if (obj.frequencyId === 1) {
        return acc + obj.totalmonth1 + obj.totalmonth2 + obj.totalmonth2
      }

      return acc
    }, 0)
    const TotalQualityCompleted = data?.reduce((acc, obj) => {
      if (obj.frequencyId === 2) {
        return acc + obj.month1 + obj.month2 + obj.month3
      }

      return acc
    }, 0)
    const TotalQuality = data?.reduce((acc, obj) => {
      if (obj.frequencyId === 2) {
        return acc + obj.totalmonth1 + obj.totalmonth2 + obj.totalmonth3
      }

      return acc
    }, 0)

    const a = {
      quantiyData: [TotalQuantiyCompleted, TotalQuantity - TotalQuantiyCompleted],
      qualityData: [TotalQualityCompleted, TotalQuality - TotalQualityCompleted],
      TotalQuality,
      TotalQuantity
    }

    return a
  }, [data, isLoading])

  if (isLoading || auth.loading) return <FallbackSpinner />

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-2 mb-5 gap-x-4 gap-y-4 '>
      {' '}
      {/* Grid show two two */}
      <CanViewComponent
        requiredPermissions={[PERMISSIONS.dashboard.completudeFileType]}
        userPermissions={auth.user?.authorities || []}
      >
        <CompletudeFileType data={data} year={year} setYear={setYear} quarter={quarter} setQuarter={setQuarter} />
      </CanViewComponent>
      <div className='grid gap-4 grid-cols-1 w-full gap-x-4 gap-y-4 '>
        <CanViewComponent
          requiredPermissions={[PERMISSIONS.dashboard.qualityQuantiyChart]}
          userPermissions={auth.user?.authorities || []}
        >
          <QuantQualCharts
            data={{
              qualityData,
              quantiyData,
              TotalQuality,
              TotalQuantity
            }}
            year={year}
            quarter={quarter}
          />
        </CanViewComponent>
        {/* <ApexRadialBarChart /> */}
        <CanViewComponent
          requiredPermissions={[PERMISSIONS.dashboard.logs]}
          userPermissions={auth.user?.authorities || []}
        >
          <LogDashboard />
        </CanViewComponent>
      </div>
      <div className='col-span-full '>
        <CanViewComponent
          requiredPermissions={[PERMISSIONS.dashboard.completudeFosa]}
          userPermissions={auth.user?.authorities || []}
        >
          <CompletudeFOSA />
        </CanViewComponent>
      </div>
      <div className='col-span-full '>{/* <ChartsStepper /> */}</div>
    </div>
  )
}

export default AdminDashboard
