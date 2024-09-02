// ** React Imports
import { forwardRef, useMemo, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps, ZAxis } from 'recharts'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'

interface Props {
  direction: 'ltr' | 'rtl'
}

interface PickerProps {
  start: Date | number
  end: Date | number
}

const newData = {
  keys: [['099918a4-1b36-400b-91c9-c3eed230772c', 'Guidimakha -  Césariennes (patient non indigent)']],
  chartData: [
    {
      '099918a4-1b36-400b-91c9-c3eed230772c': 9.0,
      name: '1-2022'
    },
    {
      '099918a4-1b36-400b-91c9-c3eed230772c': 14.0,
      name: '2-2022'
    },
    {
      '099918a4-1b36-400b-91c9-c3eed230772c': 4.0,
      name: '3-2022'
    },
    {
      '099918a4-1b36-400b-91c9-c3eed230772c': 13.0,
      name: '4-2022'
    },
    {
      '099918a4-1b36-400b-91c9-c3eed230772c': 8.0,
      name: '5-2022'
    },
    {
      '099918a4-1b36-400b-91c9-c3eed230772c': 9.0,
      name: '6-2022'
    },
    {
      '099918a4-1b36-400b-91c9-c3eed230772c': 11.0,
      name: '7-2022'
    },
    {
      '099918a4-1b36-400b-91c9-c3eed230772c': 19.0,
      name: '8-2022'
    },
    {
      '099918a4-1b36-400b-91c9-c3eed230772c': 15.0,
      name: '9-2022'
    },
    {
      '099918a4-1b36-400b-91c9-c3eed230772c': 11.0,
      name: '10-2022'
    },
    {
      '099918a4-1b36-400b-91c9-c3eed230772c': 11.0,
      name: '11-2022'
    },
    {
      '099918a4-1b36-400b-91c9-c3eed230772c': 9.0,
      name: '12-2022'
    },
    {
      '099918a4-1b36-400b-91c9-c3eed230772c': 8.0,
      name: '1-2023'
    }
  ]
}

const data = [
  {
    name: '7/12',
    zone1: 80,
    zone2: 130,
    zone3: 150,
    zone4: 210
  },
  {
    name: '8/12',
    zone1: 100,
    zone2: 150,
    zone3: 170,
    zone4: 380
  },
  {
    name: '9/12',
    zone1: 80,
    zone2: 140,
    zone3: 160,
    zone4: 220
  },
  {
    name: '10/12',
    zone1: 100,
    zone2: 150,
    zone3: 170,
    zone4: 380
  },
  {
    name: '11/12',
    zone1: 50,
    zone2: 90,
    zone3: 110,
    zone4: 150
  },
  {
    name: '12/12',
    zone1: 125,
    zone2: 90,
    zone3: 100,
    zone4: 65
  },
  {
    name: '13/12',
    zone1: 70,
    zone2: 110,
    zone3: 130,
    zone4: 210
  },
  {
    name: '14/12',
    zone1: 100,
    zone2: 150,
    zone3: 170,
    zone4: 380
  },
  {
    name: '15/12',
    zone1: 80,
    zone2: 100,
    zone3: 120,
    zone4: 180
  },
  {
    name: '16/12',
    zone1: 30,
    zone2: 60,
    zone3: 70,
    zone4: 110
  }
]

const CustomTooltip = (data: TooltipProps<any, any>) => {
  const { active, payload } = data

  if (active && payload) {
    return (
      <div className='recharts-custom-tooltip'>
        <Typography>{data.label}</Typography>
        <Divider />
        {data &&
          data.payload &&
          data.payload.map((i: any) => {
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { color: i.fill, mr: 2.5 } }} key={i.dataKey}>
                <Icon icon='mdi:circle' fontSize='0.6rem' />
                <Typography variant='body2'>{`${i.dataKey} : ${i.payload[i.dataKey]}`}</Typography>
              </Box>
            )
          })}
      </div>
    )
  }

  return null
}

const RechartsBarChart = ({ direction }: Props) => {
  const { formatedData, bars } = useMemo(() => {
    return {
      formatedData: newData.chartData,
      bars: newData.keys
    }
  }, [])
  // ** States
  const [endDate, setEndDate] = useState<DateType>(null)
  const [startDate, setStartDate] = useState<DateType>(null)

  const CustomInput = forwardRef((props: PickerProps, ref) => {
    const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
    const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null

    const value = `${startDate}${endDate !== null ? endDate : ''}`

    return (
      <TextField
        {...props}
        size='small'
        value={value}
        inputRef={ref}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <Icon icon='mdi:bell-outline' />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position='end'>
              <Icon icon='mdi:chevron-down' />
            </InputAdornment>
          )
        }}
      />
    )
  })

  const handleOnChange = (dates: any) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  return (
    <Card>
      <CardHeader
        title='Brand Turnover'
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] }
        }}
        action={
          <DatePicker
            selectsRange
            id='recharts-bar'
            endDate={endDate}
            selected={startDate}
            startDate={startDate}
            onChange={handleOnChange}
            placeholderText='Click to select a date'
            customInput={<CustomInput start={startDate as Date | number} end={endDate as Date | number} />}
          />
        }
      />
      <CardContent>
        <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap' }}>
          <Box sx={{ mr: 6, display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: '#826af9' } }}>
            <Icon icon='mdi:circle' fontSize='0.75rem' />
            <Typography variant='body2'>zone1</Typography>
          </Box>
          <Box sx={{ mr: 6, display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: '#9f87ff' } }}>
            <Icon icon='mdi:circle' fontSize='0.75rem' />
            <Typography variant='body2'>zone2</Typography>
          </Box>
          <Box sx={{ mr: 6, display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: '#d2b0ff' } }}>
            <Icon icon='mdi:circle' fontSize='0.75rem' />
            <Typography variant='body2'>zone3</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: '#f8d3ff' } }}>
            <Icon icon='mdi:circle' fontSize='0.75rem' />
            <Typography variant='body2'>zone4</Typography>
          </Box>
        </Box>
        <Box sx={{ height: 350 }}>
          <ResponsiveContainer>
            <BarChart height={350} data={data} barSize={15} style={{ direction }} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' reversed={direction === 'rtl'} />
              <YAxis orientation={direction === 'rtl' ? 'right' : 'left'} />
              <ZAxis dataKey='zone1' range={[0, 100]} />
              <Tooltip content={CustomTooltip} />
              <Bar dataKey='zone1' stackId='a' fill='#826af9' />
              <Bar dataKey='zone2' stackId='b' fill='#9f87ff' />
              <Bar dataKey='zone3' stackId='c' fill='#d2b0ff' />
              <Bar dataKey='zone4' stackId='d' fill='#f8d3ff' />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}

export default RechartsBarChart
