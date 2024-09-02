import { Card, CardContent, Divider, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useTranslation } from 'react-i18next'

export default function OverView({ fields, title, initialValues }) {
  const { t } = useTranslation()
  const getSelectValue = (name, value) => {
    if (fields.find(item => item.name === name).options) {
      const option = fields.find(item => item.name === name).options.find(item => item.value === value)

      return option ? option.label : ''
    }

    return '---'
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ pt: 5 }}>
            <Typography variant='h4'>{t(title)}</Typography>
          </CardContent>
          <CardContent>
            <Divider sx={{ mb: theme => `${theme.spacing(4)} !important` }} />
            <Box sx={{ pb: 1 }}>
              <table>
                <tbody>
                  {fields.map(item => (
                    <tr key={item.name}>
                      <td>
                        <Typography sx={{ fontWeight: 500, fontSize: '1rem' }}>{t(item.label)}</Typography>
                      </td>
                      <td>
                        {item.type === 'textEditor' ? (
                          <Typography variant='body1' dangerouslySetInnerHTML={{ __html: initialValues[item.name] }} />
                        ) : item.type === 'select' ? (
                          <Typography variant='body1'>{getSelectValue(item.name, initialValues[item.name])}</Typography>
                        ) : (
                          <Typography variant='body1'>{initialValues[item.name] || '---'}</Typography>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
