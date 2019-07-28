import { Usuario } from "./usuario";
import { Provincia } from "./extra";
import { TipoDocumento } from "./tipo_documento";
import { Sede } from './sede';

export interface Alumno{
    id:number;
    nombre:string;
    apellido:string;
    fecha_alta:string;
    codigo:string;
    domicilio:string;
    calle:string;
    numero:string;
    piso:string;
    depto:string;
    id_localidad:number;
    localidad:string;
    id_provincia:number;
    codigo_postal:number;
    telefono:string;
    celular:string;
    email:string;
    id_tipo_documento:number;
    documento:number;
    fecha_nacimiento:Date;
    ciudad_nacimiento:string;
    nacionalidad:string;
    sexo:string;
    id_tipo_alumno_civil:number;
    id_tipo_alumno_estado:number;
    observaciones:string;
    id_usuario:number;
    password:string;

    usuario:Usuario;
    provincia:Provincia;
    tipo_documento:TipoDocumento;
    archivos:AlumnoArchivo[];
    tipo_civil:TipoAlumnoCivil;
    tipo_estado:TipoAlumnoCivil;
}

export interface AlumnoArchivo{
    id:number;
    nombre:string;
    id_tipo_alumno_documentacion:number;
    id_alumno:number;
    id_usuario:number;
    archivo:any;

    usuario:Usuario;
    alumno:Alumno;
    tipo_documentacion:TipoAlumnoDocumentacion;
    url:any;
    subido:boolean;
}

export interface TipoAlumnoCivil{
    id:number;
    nombre:string;
}

export interface TipoAlumnoEstado{
    id:number;
    nombre:string;
}

export interface TipoAlumnoDocumentacion{
    id:number;
    nombre:string;
}

export interface AlumnoNotificacion{
    id:number;
    id_alumno:number;
    id_notificacion:number;
    id_usuario:number;
    enviado:boolean;
    visto:string;
    email:string;

    usuario:Usuario;
    alumno:Alumno;
}

export interface TipoCondicionAlumno{
    id:number;
    nombre:string;
}

export interface AlumnoSede{
    id:number;
    id_alumno:number;
    id_sede:number;
    id_usuario:number;
    estado:boolean;

    alumno:Alumno;
    sede:Sede;
    usuario:Usuario;
}