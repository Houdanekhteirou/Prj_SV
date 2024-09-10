// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { PERMISSIONS } from 'src/constants'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboards',
      icon: 'mdi:home-outline',
      path: '/admin'
    },
    {
      title: 'entry',
      icon: 'mdi:database',
      path: '/admin/data/data-entry'
      // requiredPermissions: [PERMISSIONS.file.read]
    },
    {
      title: 'reports',
      path: '/admin/reports',
      icon: 'mdi:file-document-outline'
      // requiredPermissions: [
      //   PERMISSIONS.report.show,
      //   PERMISSIONS.report.factureMensuelleEcd,
      //   PERMISSIONS.report.factureMensuelleFosa,
      //   PERMISSIONS.report.factureMensuelleMutuelles,
      //   PERMISSIONS.report.factureTrimestrielleEcd,
      //   PERMISSIONS.report.factureTrimestrielleFosa,
      //   PERMISSIONS.report.invoiceDet,
      //   PERMISSIONS.report.invoices,
      //   PERMISSIONS.report.monthlyPaymentOrder,
      //   PERMISSIONS.report.monthlyPaymentRequest,
      //   PERMISSIONS.report.quarterlyConsolidated,
      //   PERMISSIONS.report.quarterlyPaymentOrder,
      //   PERMISSIONS.report.rapportBm
      // ]
    },
    {
      title: 'Data',
      // requiredPermissions: [
      //   PERMISSIONS.fileType.read,
      //   PERMISSIONS.element.read,
      //   PERMISSIONS.validation.read,
      //   PERMISSIONS.completeness.read
      // ],
      children: [
        {
          title: 'Validation',
          icon: 'mdi:database-check',
          path: '/admin/data/validation',
          // requiredPermissions: [PERMISSIONS.validation.read]
        },
        // {
        //   title: 'Publication',
        //   icon: 'entypo:publish',
        //   path: '/admin/data/public',
        //   requiredPermissions: [PERMISSIONS.validation.read]
        // },
        {
          title: 'File Types',
          icon: 'carbon:data-class',
          path: '/admin/data/file-types',
          // requiredPermissions: [PERMISSIONS.fileType.read]
        },
        {
          title: 'Elements',
          icon: 'grommet-icons:indicator',
          // requiredPermissions: [PERMISSIONS.element.read, PERMISSIONS.element.read],
          children: [
            {
              title: 'Elements',
              path: '/admin/data/elements',
              // requiredPermissions: [PERMISSIONS.element.read]
            },
            {
              title: 'element_groups',
              path: '/admin/data/elements-groups',
              // requiredPermissions: [PERMISSIONS.element.read]
            }
          ]
        },
        {
          title: 'Completeness',
          path: '/admin/completude',
          icon: 'fluent-mdl2:completed',
          // requiredPermissions: [PERMISSIONS.completeness.read]
        }
      ]
    },
    ,
    {
      title: 'Organizations',
      icon: 'charm:organisation',
      // requiredPermissions: [
      //   PERMISSIONS.zone.read,
      //   PERMISSIONS.entity.read,
      //   PERMISSIONS.entityType.read,
      //   PERMISSIONS.entityClass.read
      // ],
      children: [
        {
          title: 'Zones',
          path: '/admin/organizations/zones',
          icon: 'mdi:map-marker-outline',
          // requiredPermissions: [PERMISSIONS.zone.read]
        },
        {
          title: 'Levels',
          path: '/admin/organizations/levels',
          icon: 'icon-park-outline:ranking-list',
          // requiredPermissions: [PERMISSIONS.zone.read]
        },
        {
          title: 'Entitys',
          path: '/admin/organizations/entities',
          icon: 'gg:organisation',
          // requiredPermissions: [PERMISSIONS.entity.read]
        },
        {
          title: 'contracts',
          path: '/admin/organizations/contracts',
          icon: 'clarity:contract-line',
          // requiredPermissions: [PERMISSIONS.contracts.read]
        },
        {
          title: 'contractType',
          path: '/admin/organizations/contrat-type',
          icon: 'clarity:contract-line',
          // requiredPermissions: [PERMISSIONS.contractTypes.read]
        },
        {
          title: 'Entity Types',
          path: '/admin/organizations/entity-types',
          icon: 'carbon:data-class',
          // requiredPermissions: [PERMISSIONS.entityType.read]
        },
        {
          title: 'Entity Classes',
          path: '/admin/organizations/entity-classes',
          icon: 'mdi:text-box-outline',
          // requiredPermissions: [PERMISSIONS.entityClass.read]
        }
      ]
    },

    {
      title: 'Content',
      icon: 'mdi:file-document-edit-outline',
      // requiredPermissions: [PERMISSIONS.cms.read, PERMISSIONS.cms.read],
      children: [
        {
          title: 'posts',
          path: '/admin/content/posts',
          icon: 'mdi:newspaper-variant-outline',
          // requiredPermissions: [PERMISSIONS.cms.read]
        },
        {
          title: 'about',
          path: '/admin/content/about',
          icon: 'mdi:information-outline',
          // requiredPermissions: [PERMISSIONS.cms.read]
        },
        {
          title: 'File Browser',
          icon: 'ph:folder-duotone',
          path: '/admin/file-manager',
          // requiredPermissions: [PERMISSIONS.fileManagement.read]
        }
      ]
    },

    {
      title: 'Access Management',
      icon: 'mdi:shield-outline',
      path: '/admin/access-management/users-roles',
      // requiredPermissions: [PERMISSIONS.Gestion_acces.read, PERMISSIONS.Gestion_acces.read],
      children: [
        {
          title: 'Users',
          path: '/admin/access-management/users',
          // requiredPermissions: [PERMISSIONS.Gestion_acces.read]
        },

        {
          title: 'Groups',
          path: '/admin/access-management/groups',
          // requiredPermissions: [PERMISSIONS.Gestion_acces.read],
          children: [
            {
              title: 'Groups',
              path: '/admin/access-management/groups',
              // requiredPermissions: [PERMISSIONS.Gestion_acces.read]
            },
            {
              title: 'Group members',
              path: '/admin/access-management/group-members',
              // requiredPermissions: [PERMISSIONS.Gestion_acces.read]
            }
          ]
        },
        {
          title: 'Roles',
          path: '/admin/access-management/groups',
          // requiredPermissions: [PERMISSIONS.Gestion_acces.read],
          children: [
            {
              title: 'Roles',
              path: '/admin/access-management/roles',
              // requiredPermissions: [PERMISSIONS.Gestion_acces.read]
            },
            {
              title: 'role-members',
              path: '/admin/access-management/role-members',
              // requiredPermissions: [PERMISSIONS.Gestion_acces.read]
            }
          ]
        },
        {
          title: 'Permissions',
          path: '/admin/access-management/permissions',
          // requiredPermissions: [PERMISSIONS.Gestion_acces.read]
        }
      ]
    },
    {
      title: 'Parameters',
      icon: 'ic:outline-settings',
      // requiredPermissions: [PERMISSIONS.population.read, PERMISSIONS.permissionRequest.read],
      children: [
        {
          title: 'Target populations',
          path: '/admin/parameters/target-population',
          // requiredPermissions: [PERMISSIONS.population.read]
        },
        {
          title: 'Permission requests',
          path: '/admin/parameters/permission-requests',
          // requiredPermissions: [PERMISSIONS.permissionRequest.read]
        },
        {
          title: 'Type de rapport',
          path: '/admin/reports-management',
          // requiredPermissions: [PERMISSIONS.reportType.read]
        },
        {
          title: 'tasks',
          path: '/admin/tasks',
          // requiredPermissions: [PERMISSIONS.tasks.read]
        }
      ]
    },
    {
      title: 'financement',
      icon: 'mdi:finance',
      // requiredPermissions: [PERMISSIONS.bank.read, PERMISSIONS.budget.read],
      children: [
        {
          title: 'bankAccounts',
          path: '/admin/banks/Account',
          // requiredPermissions: [PERMISSIONS.bankAccounts.read]
        },
        {
          title: 'Banks',
          path: '/admin/banks/banks',
          // requiredPermissions: [PERMISSIONS.bank.read]
        },
        {
          title: 'Budgets',
          path: '/admin/banks/budgets',
          // requiredPermissions: [PERMISSIONS.budget.read]
        }
      ]
    }
  ]
}

export default navigation
