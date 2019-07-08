export const navItems = [
  {
    name: 'Administracion',
    url: '/admin',
    icon: 'fa fa-superpowers',
    permisos: [1],
    children: [
      {
        name: 'Usuarios',
        url: '/admin/usuarios',
        icon: 'icon-user',
        permisos: [1],
      },
      {
        name: 'Novedades',
        url: '/admin/novedades',
        icon: 'fa fa-newspaper-o',
        permisos: [1],
      },
      {
        name: 'Documentacion',
        url: '/admin/documentos',
        icon: 'fa fa-info-circle',
        permisos: [1],
      }
    ]
  },
  {
    name: 'Establecimiento',
    url: '/establecimientos',
    icon: 'icon-home',
    permisos: [1],
    children: [
      {
        name: 'Sedes',
        url: '/establecimientos/sedes',
        icon: 'fa fa-building-o'
      },
      {
        name: 'Departamentos',
        url: '/establecimientos/departamentos',
        icon: 'fa fa-building'
      },
      {
        name: 'Modalidades',
        url: '/establecimientos/modalidades',
        icon: 'icon-settings'
      },
      {
        name: 'Becas',
        url: '/establecimientos/becas',
        icon: 'icon-settings'
      },
      {
        name: 'Docentes',
        url: '/docentes',
        icon: 'icon-people',
      },
    ]
  },
  {
    name: 'Alumnos',
    url: '/academicos/alumnos',
    icon: 'icon-people',
    permisos: [1,2,4],
  },
  {
    name: 'Academico',
    url: '/academicos',
    icon: 'icon-graduation',
    permisos: [1,2,4],
    children: [
      {
        name: 'Carreras',
        url: '/academicos/carreras',
        icon: 'icon-list',
        permisos: [1],
      },
      {
        name: 'Inscripciones',
        url: '/academicos/inscripciones',
        icon: 'icon-docs',
        permisos: [1,2,4],
      },
      {
        name: 'Mesas de examen',
        url: '/mesas',
        icon: 'icon-docs',
        permisos: [1,2,4],
      },
      {
        name: 'Mesa*Materia',
        url: '/mesas/materias',
        icon: 'fa fa-check-square',
        permisos: [1,2,4,8],
      },
    ]
  },{
    name: 'Comunicaciones',
    url: '/notificaciones',
    icon: 'fa fa-send',
    permisos: [1,2],
    children: [
      {
        name: 'Plantillas',
        url: '/notificaciones/plantillas',
        icon: 'icon-screen-tablet'
      },
      {
        name: 'Notificaciones',
        url: '/notificaciones/notificaciones',
        icon: 'icon-envelope'
      },
    ]
  },{
    name: 'Caja',
    url: '/caja',
    icon: 'fa fa-bank',
    permisos: [1,2,3],
    children: [
      {
        name: 'Cierre Diarias',
        url: '/movimientos/diarias/listado',
        icon: 'fa fa-dollar'
      },{
        name: 'Movimientos',
        url: '/movimientos/listado',
        icon: 'fa fa-clipboard'
      },{
        name: 'Tipos de Mov.',
        url: '/tipos_movimiento/listado',
        icon: 'fa fa-columns'
      },
    ]
  },{
    name: 'Consultas',
    url: '/consultas',
    icon: 'fa fa-question-circle',
    children: [
      {
        name: 'Cobranzas',
        url: '/consultas/pagos',
        icon: 'fa fa-credit-card',
        permisos: [1,2,4],
      },
      {
        name: 'Cuentas Corrientes',
        url: '/consultas/planes_pago',
        icon: 'fa fa-credit-card-alt',
        permisos: [1,2,4],
      },
      {
        name: 'Comisiones',
        url: '/comisiones',
        icon: 'fa fa-check-square',
        permisos: [1,2,4,8],
      },
      {
        name: 'Comision*Asistencia',
        url: '/asistencias',
        icon: 'fa fa-check-square-o'
      },
      {
        name: 'Comision*Examen',
        url: '/examenes',
        icon: 'fa fa-check-square-o'
      },
      {
        name: 'Comision*Alumno',
        url: '/comisiones/alumnos',
        icon: 'fa fa-check-square',
        permisos: [1,2,4,8],
      },
    ]
  },
  /*
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Theme'
  },
  {
    name: 'Colors',
    url: '/theme/colors',
    icon: 'icon-drop'
  },
  {
    name: 'Typography',
    url: '/theme/typography',
    icon: 'icon-pencil'
  },
  {
    title: true,
    name: 'Components'
  },
  {
    name: 'Base',
    url: '/base',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'Cards',
        url: '/base/cards',
        icon: 'icon-puzzle'
      },
      {
        name: 'Carousels',
        url: '/base/carousels',
        icon: 'icon-puzzle'
      },
      {
        name: 'Collapses',
        url: '/base/collapses',
        icon: 'icon-puzzle'
      },
      {
        name: 'Forms',
        url: '/base/forms',
        icon: 'icon-puzzle'
      },
      {
        name: 'Pagination',
        url: '/base/paginations',
        icon: 'icon-puzzle'
      },
      {
        name: 'Popovers',
        url: '/base/popovers',
        icon: 'icon-puzzle'
      },
      {
        name: 'Progress',
        url: '/base/progress',
        icon: 'icon-puzzle'
      },
      {
        name: 'Switches',
        url: '/base/switches',
        icon: 'icon-puzzle'
      },
      {
        name: 'Tables',
        url: '/base/tables',
        icon: 'icon-puzzle'
      },
      {
        name: 'Tabs',
        url: '/base/tabs',
        icon: 'icon-puzzle'
      },
      {
        name: 'Tooltips',
        url: '/base/tooltips',
        icon: 'icon-puzzle'
      }
    ]
  },
  {
    name: 'Buttons',
    url: '/buttons',
    icon: 'icon-cursor',
    children: [
      {
        name: 'Buttons',
        url: '/buttons/buttons',
        icon: 'icon-cursor'
      },
      {
        name: 'Dropdowns',
        url: '/buttons/dropdowns',
        icon: 'icon-cursor'
      },
      {
        name: 'Brand Buttons',
        url: '/buttons/brand-buttons',
        icon: 'icon-cursor'
      }
    ]
  },
  {
    name: 'Charts',
    url: '/charts',
    icon: 'icon-pie-chart'
  },
  {
    name: 'Icons',
    url: '/icons',
    icon: 'icon-star',
    children: [
      {
        name: 'CoreUI Icons',
        url: '/icons/coreui-icons',
        icon: 'icon-star',
        badge: {
          variant: 'success',
          text: 'NEW'
        }
      },
      {
        name: 'Flags',
        url: '/icons/flags',
        icon: 'icon-star'
      },
      {
        name: 'Font Awesome',
        url: '/icons/font-awesome',
        icon: 'icon-star',
        badge: {
          variant: 'secondary',
          text: '4.7'
        }
      },
      {
        name: 'Simple Line Icons',
        url: '/icons/simple-line-icons',
        icon: 'icon-star'
      }
    ]
  },
  {
    name: 'Notifications',
    url: '/notifications',
    icon: 'icon-bell',
    children: [
      {
        name: 'Alerts',
        url: '/notifications/alerts',
        icon: 'icon-bell'
      },
      {
        name: 'Badges',
        url: '/notifications/badges',
        icon: 'icon-bell'
      },
      {
        name: 'Modals',
        url: '/notifications/modals',
        icon: 'icon-bell'
      }
    ]
  },
  {
    name: 'Widgets',
    url: '/widgets',
    icon: 'icon-calculator',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    divider: true
  },
  {
    title: true,
    name: 'Extras',
  },
  {
    name: 'Pages',
    url: '/pages',
    icon: 'icon-star',
    children: [
      {
        name: 'Login',
        url: '/login',
        icon: 'icon-star'
      },
      {
        name: 'Register',
        url: '/register',
        icon: 'icon-star'
      },
      {
        name: 'Error 404',
        url: '/404',
        icon: 'icon-star'
      },
      {
        name: 'Error 500',
        url: '/500',
        icon: 'icon-star'
      }
    ]
  },
  /*
  {
    name: 'Download CoreUI',
    url: 'http://coreui.io/angular/',
    icon: 'icon-cloud-download',
    class: 'mt-auto',
    variant: 'success'
  },
  {
    name: 'Try CoreUI PRO',
    url: 'http://coreui.io/pro/angular/',
    icon: 'icon-layers',
    variant: 'danger'
  }
  */
];
