// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Component Import
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { useTranslation } from 'react-i18next'
import { Typography } from '@mui/material'

const donutColors = {
  series1: '#fdd835',
  series2: '#00d4bd',
  series3: '#826bf8',
  series4: '#32baff',
  series5: '#ffa1a1'
}

const QuantQualCharts = ({ data, quarter, year }) => {
  // ** Hook
  const theme = useTheme()
  const { t } = useTranslation()

  const options = (total: number): ApexOptions => {
    return {
      stroke: { width: 0 },
      labels: ['saisis', 'non saisis'],
      colors: [donutColors.series3, donutColors.series2],
      dataLabels: {
        enabled: true,
        formatter: (val: string) => `${parseInt(val, 10)}%`
      },
      legend: {
        position: 'bottom',
        markers: { offsetX: -3 },
        labels: { colors: theme.palette.text.secondary },
        itemMargin: {
          vertical: 3,
          horizontal: 10
        }
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                fontSize: '1.2rem'
              },
              value: {
                fontSize: '1.2rem',
                color: theme.palette.text.secondary,
                formatter: (val: string) => `${parseInt(val, 10)}`
              },

              total: {
                show: false,
                fontSize: '1.2rem',
                label: 'Total',
                formatter: () => `${total}` + ' fichiers',

                color: theme.palette.text.primary
              }
            }
          }
        }
      },
      responsive: [
        {
          breakpoint: 992,
          options: {
            chart: {
              height: 380
            },
            legend: {
              position: 'bottom'
            }
          }
        },
        {
          breakpoint: 576,
          options: {
            chart: {
              height: 320
            },
            plotOptions: {
              pie: {
                donut: {
                  labels: {
                    show: true,
                    name: {
                      fontSize: '1rem'
                    },
                    value: {
                      fontSize: '1rem'
                    },
                    total: {
                      fontSize: '1rem'
                    }
                  }
                }
              }
            }
          }
        }
      ]
    }
  }

  return (
    <Card>
      <CardHeader
        title={t('Proporition des fichiers saisis') + ` [T${quarter},${year}]`}
        subheaderTypographyProps={{ sx: { color: theme => `${theme.palette.text.disabled} !important` } }}
      />
      <CardContent
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        <div>
          <Typography variant='h6' align='center'>
            {t('quantity')}
          </Typography>
          <ReactApexcharts
            type='donut'
            height={400}
            options={options(data.TotalQuality)}
            series={data?.qualityData || [0, 0]}
          />
        </div>
        <div>
          <Typography variant='h6' align='center'>
            {t('quality')}
          </Typography>
          <ReactApexcharts
            type='donut'
            height={400}
            options={options(data.TotalQuantity)}
            series={data.quantiyData || [0, 0]}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default QuantQualCharts
