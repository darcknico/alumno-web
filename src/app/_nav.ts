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
      },
      {
        name: 'Dispositivos',
        url: '/admin/dispositivos',
        icon: 'fa fa-tablet',
        permisos: [1],
      },
      {
        name: 'Asistencias',
        url: '/admin/asistencias',
        icon: 'fa fa-calendar-check-o',
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
        name: 'Aulas',
        url: '/establecimientos/aulas',
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
        name: 'Tpos de Abandono',
        url: '/establecimientos/tipos-abandonos',
        icon: 'fa fa-exclamation-circle'
      },
      
    ]
  },
  {
    name: 'Docentes',
    url: '/docentes',
    icon: 'fa fa-users',
    permisos: [1,2,4],
    children:[
      {
        name: 'Listado',
        url: '/docentes/listado',
        icon: 'fa fa-users',
      },
      {
        name: 'Asignaciones',
        url: '/docentes/asignaciones',
        icon: 'fa fa-list',
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
        name: 'Materias',
        url: '/academicos/materias',
        icon: 'fa fa-book',
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
        name: 'Actas mesas',
        url: '/mesas/materias',
        icon: 'fa fa-check-square',
        permisos: [1,2,4,8],
      },
    ]
  },{
    name: 'Comisiones',
    url: '/comisiones',
    icon: 'fa fa-list',
    permisos: [1,2,4,8],
    children:[
      {
        name: 'Listado',
        url: '/comisiones',
        icon: 'fa fa-check-square',
      },
      {
        name: 'Asistencias',
        url: '/asistencias',
        icon: 'fa fa-calendar-check-o'
      },
      {
        name: 'Examenes',
        url: '/examenes',
        icon: 'fa fa-text-width'
      },
      {
        name: 'Inscriptos',
        url: '/comisiones/alumnos',
        icon: 'fa fa-user-o',
      },
      {
        name: 'Horarios',
        url: '/comisiones/horarios',
        icon: 'fa fa-clock-o',
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
      },{
        name: 'Estadisticas',
        url: '/movimientos/estadisticas',
        icon: 'fa fa-pie-chart'
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
        name: 'Cuentas sin cobranzas',
        url: '/consultas/planes_pago_no',
        icon: 'fa fa-credit-card-alt',
        permisos: [1,2,4],
      },
      {
        name: 'Reportes',
        url: '/consultas/reportes',
        icon: 'fa fa-file',
        permisos: [1,2,4],
      },
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
