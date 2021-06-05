import { Usuario, Docente } from "./usuario";
import { Sede } from "./sede";
import { Materia } from "./materia";
import { Carrera } from "./carrera";
import { Alumno, TipoCondicionAlumno } from "./alumno";
import { Inscripcion } from "./inscripcion";
import { Modalidad } from './modalidad';
import { Dia } from './extra';
import { Aula } from './aula';

export interface Comision{
    id:number;
    id_usuario:number;
    id_carrera:number;
    id_materia:number;
    id_sede:number;
    id_aula_virtual:string;
    anio:number;
    numero:number;
    alumnos_cantidad:number;
    responsable_nombre:string;
    responsable_apellido:string;
    id_modalidad:number;
    clase_inicio:string;
    clase_final:string;
    asistencia:boolean;
    estado:boolean;
    created_at:Date;
    updated_at:Date;

    responsable:Usuario;
    sede:Sede;
    materia:Materia;
    carrera:Carrera;
    modalidad:Modalidad;
    alumnos:ComisionAlumno[];
    docentes:ComisionDocente[];
    usuario_baja:Usuario;
    usuario_alta:Usuario;

    docentes_previos:boolean;
    docentes_asignados:boolean;
    horarios_previos:boolean;
}

export interface ComisionAlumno{
    id:number;
    id_alumno:number;
    id_comision:number;
    id_inscripcion:number;
    id_usuario:number;
    nota:number;
    id_tipo_condicion_alumno:number;
    observaciones:string;
    estado:boolean;
    created_at:Date;
    updated_at:Date;

    usuario:Usuario;
    usuario_baja:Usuario;
    alumno:Alumno;
    comision:Comision;
    inscripcion:Inscripcion;
    tipo:TipoCondicionAlumno;
}

export interface ComisionDocente{
    id:number;
    id_comision:number;
    id_usuario:number;
    created_at:Date;
    updated_at:Date;
    comision:Comision;
    usuario:Usuario;
    docente:Docente;
}

export interface ComisionHorario{
    id:number;
    id_comision:number;
    id_dia:number;
    hora_inicial:string;
    hora_final:string;
    id_aula:number;
    nombre:string;
    asistencia:boolean;
    created_at:Date;
    updated_at:Date;
    comision:Comision;
    dia:Dia;

    aula:Aula;
}
