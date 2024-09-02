// 192.168.100.162:8000/filter

import axios from 'axios'

export const DefaultFilterData = {
  elements: [
    {
      id: 5,
      type: 1,
      aggregation: 1,
      title: 'test'
    }
  ],
  localites: [],
  periods: [
    {
      startDate: '2022-01-01',
      endDate: '2024-01-01',
      title: `${new Date('2022-01-01').toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })} - ${new Date('2024-01-01').toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })}`
    }
  ]
}

export const getTableData = async ({ filterData }) => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_PYTHON}/filter`, {
    ...filterData
  })

  return response
}

export const getGraphData = async ({ filterData }) => {
  filterData.chartType = 1
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_PYTHON}/filter/chart`, {
    ...filterData
  })

  return response
}

export const defaultTableData = {
  headers: [
    '1-2022',
    '2-2022',
    '3-2022',
    '4-2022',
    '5-2022',
    '6-2022',
    '7-2022',
    '8-2022',
    '9-2022',
    '10-2022',
    '11-2022',
    '12-2022',
    '1-2023',
    '2-2023',
    '3-2023',
    '4-2023',
    '5-2023',
    '6-2023',
    '7-2023',
    '8-2023',
    '9-2023',
    '10-2023',
    '11-2023',
    '12-2023',
    '1-2024'
  ],
  rows: [
    {
      id: null,
      element: 'Césariennes - indigent',
      subRows: [
        {
          id: 104,
          name: 'Hodh Echarghi',
          values: [13, 16, 14, 20, 21, 7, 24, 19, 33, 3, 7, 10, 16, 9, 5, 17, 13, 12, 13, 14, 17, 23, 33, 0, 0]
        },
        {
          id: 30,
          name: 'Guidimakha',
          values: [1, 3, 4, 3, 1, 0, 4, 2, 4, 9, 9, 9, 8, 5, 10, 6, 11, 4, 9, 9, 6, 7, 6, 7, 0]
        },
        {
          id: 34,
          name: 'Hodh EL Gharbi',
          values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0]
        }
      ]
    },
    {
      id: null,
      element: 'Césariennes (patient non indigent)',
      subRows: [
        {
          id: 104,
          name: 'Hodh Echarghi',
          values: [31, 32, 28, 21, 14, 2, 19, 27, 15, 13, 40, 38, 34, 33, 29, 34, 29, 33, 58, 38, 37, 44, 47, 0, 0]
        },
        {
          id: 30,
          name: 'Guidimakha',
          values: [9, 14, 4, 13, 8, 9, 11, 14, 15, 8, 11, 9, 8, 10, 7, 8, 10, 6, 11, 26, 18, 11, 18, 22, 0]
        },
        {
          id: 34,
          name: 'Hodh EL Gharbi',
          values: [22, 14, 21, 11, 30, 14, 28, 31, 34, 45, 30, 58, 21, 33, 33, 17, 41, 24, 40, 53, 40, 70, 45, 0, 0]
        }
      ]
    },
    {
      id: null,
      element: 'Nouvelle consultation curative chez les moins de 5 ans non indigent',
      subRows: [
        {
          id: 104,
          name: 'Hodh Echarghi',
          values: [
            8131, 8182, 7174, 5219, 4282, 4410, 4324, 7662, 9216, 8533, 5955, 6749, 8744, 9613, 7697, 5967, 6550, 5288,
            6510, 6862, 8020, 7315, 8348, 0, 286
          ]
        },
        {
          id: 30,
          name: 'Guidimakha',
          values: [
            3020, 3145, 3079, 2999, 3100, 2834, 3044, 4612, 5421, 4624, 3256, 2922, 3157, 2968, 3010, 2643, 3029, 2754,
            2923, 3479, 3735, 4583, 3864, 185, 0
          ]
        },
        {
          id: 34,
          name: 'Hodh EL Gharbi',
          values: [
            7655, 6336, 5552, 3952, 3889, 3794, 4153, 6245, 9331, 7455, 5452, 4856, 6004, 6466, 5549, 3872, 4620, 3802,
            4680, 6270, 7167, 6618, 6441, 0, 0
          ]
        }
      ]
    },
    {
      id: null,
      element: 'Nouvelle consultation curative par un Médecin chez les moins de 5 ans indigent',
      subRows: [
        {
          id: 104,
          name: 'Hodh Echarghi',
          values: [8, 22, 41, 51, 30, 17, 26, 78, 106, 12, 22, 23, 18, 7, 18, 20, 27, 33, 40, 23, 22, 27, 33, 0, 0]
        },
        {
          id: 30,
          name: 'Guidimakha',
          values: [
            98, 78, 86, 68, 69, 88, 101, 108, 26, 127, 96, 64, 95, 129, 115, 84, 140, 100, 122, 157, 219, 300, 221, 191,
            0
          ]
        },
        {
          id: 34,
          name: 'Hodh EL Gharbi',
          values: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 3, 0, 0, 0, 0, 0, 0]
        }
      ]
    }
  ]
}
