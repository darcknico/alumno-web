import { Sede } from "./sede";
import { Usuario, Docente } from "./usuario";
import { Carrera } from "./carrera";
import { Materia } from "./materia";
import { Alumno, TipoCondicionAlumno } from "./alumno";
import { Inscripcion } from "./inscripcion";
import { TipoMesaDocente } from './tipo';

export interface MesaExamen{
    id:number;
    id_sede:number;
    id_usuario:number;
    fecha_inicio:string;
    fecha_fin:string;
    numero:number;
    nombre:string;
    notificacion_push: boolean,
    notificacion_email: boolean,
    estado:boolean;
    created_at:Date;
    updated_at:Date;

    sede:Sede;
    usuario:Usuario;
    materias:MesaExamenMateria[];
}

export interface MesaExamenMateria{
    id:number;
    id_mesa_examen:number;
    id_carrera:number;
    id_materia:number;
    fecha:string;
    fecha_cierre:string;
    alumnos_cantidad:number;
    alumnos_cantidad_presente:number;
    ubicacion:string;
    check_in:string;
    check_out:string;
    libro:string;
    folio_libre:string;
    folio_promocion:string;
    folio_regular:string;
    observaciones:string;
    estado:boolean;
    created_at:Date;
    updated_at:Date;

    mesa_examen:MesaExamen;
    carrera:Carrera;
    materia:Materia;
    usuario:Usuario;
    usuario_check_in:Usuario;
    usuario_check_out:Usuario;
    alumnos:MesaExamenMateriaAlumno[];
    docentes:MesaExamenMateriaDocente[];
}

export interface MesaExamenMateriaAlumno{
    id:number;
    id_mesa_examen_materia:number;
    id_alumno:number;
    id_inscripcion:number;
    id_usuario:number;
    id_tipo_condicion_alumno:number;
    asistencia:boolean;
    nota:number;
    nota_nombre:string;
    nota_final:number;
    nota_final_nombre:string;
    observaciones:string;
    adeuda:boolean;

    mesa_examen_materia:MesaExamenMateria;
    alumno:Alumno;
    inscripcion:Inscripcion;
    usuario:Usuario;
    usuario_baja:Usuario;
    condicion:TipoCondicionAlumno;
}

export interface MesaExamenMateriaDocente{
    id:number;
    id_mesa_examen_materia:number;
    id_usuario:number;
    id_tipo_mesa_docente:number;
    observaciones:string;
    created_at:Date;
    updated_at:Date;

    tipo:TipoMesaDocente;
    usuario:Usuario;
    docente:Docente;
}

export interface AlumnoMateriaNota{
    id:number;
    id_alumno:number;
    id_inscripcion:number;
    id_materia:number;
    id_usuario:number;
    id_tipo_condicion_alumno:number;
    asistencia:boolean;
    nota:number;
    nota_nombre:number;
    observaciones:string;
    fecha:string;
    libro:string;
    folio:string;

    alumno:Alumno;
    inscripcion:Inscripcion;
    materia:Materia;
    usuario:Usuario;
    condicion:TipoCondicionAlumno;
}