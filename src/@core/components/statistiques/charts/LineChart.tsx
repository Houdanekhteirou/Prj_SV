// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import { useMemo } from 'react'

const CustomTooltip = (props: TooltipProps<any, any>) => {
  // ** Props
  const { active, payload } = props

  console

  if (active && payload) {
    return (
      <div className='recharts-custom-tooltip'>
        <Typography sx={{ fontSize: '0.875rem' }}>{`${9}`}</Typography>
      </div>
    )
  }

  return null
}

const colors = [
  '#FF0000',
  '#FFA500',
  '#008000',
  '#0000FF',
  '#4B0082',
  '#EE82EE',
  '#800000',
  '#808000',
  '#008080',
  '#000080',
  '#800080'
]

const RechartsLineChart = ({ direction, data, chartRef }: any) => {
  const { chartData, keys } = useMemo(() => {
    return {
      chartData: data.chartData,
      keys: data.keys
    }
  }, [])

  return (
    <Card>
      {/* show each color respond to what key */}
      <CardHeader
        title={
          <div className='flex gap-2 flex-wrap'>
            {keys.map((key, index) => (
              <Box
                sx={{ display: 'flex', alignItems: 'center', '& svg': { color: colors[index], mr: 2.5 } }}
                key={index}
              >
                <Icon icon='mdi:circle' fontSize='0.6rem' />
                <Typography variant='body2'>{key[1]}</Typography>
              </Box>
            ))}
          </div>
        }
      />
      <CardContent>
        <Box sx={{ height: 350 }}>
          <ResponsiveContainer>
            <LineChart height={350} data={chartData} style={{ direction }} margin={{ left: -20 }} ref={chartRef}>
              <CartesianGrid />
              <XAxis dataKey='name' reversed={direction === 'rtl'} />
              <YAxis orientation={direction === 'rtl' ? 'right' : 'left'} />

              {keys.map((key, index) => (
                <Line dataKey={key[0]} stroke={colors[index]} strokeWidth={3} key={index} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}

export default RechartsLineChart
