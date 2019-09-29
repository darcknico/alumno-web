import { TipoDocumento } from "./tipo_documento";
import { Sede } from './sede';
import { TipoContrato } from './tipo';

export interface UsuarioSede{
    id:number;
    id_sede:number;
    id_usuario:number;
    id_usuario_alta:number;
    estado:boolean;
    created_at:string;
    updated_at:string;

    usuario_alta:Usuario;
    sede:Sede;
}

export interface TipoUsuario{
    id:number;
    nombre:string;
    descripcion:string;
}

export interface Usuario {
    estado: boolean;
    created_at: string;
    updated_at: string;
    email: string;
    nombre?: any;
    apellido?: any;
    fecha_nacimiento?: any;
    telefono: string;
    celular: string;
    direccion: string;
    direccion_numero: string;
    direccion_piso: string;
    direccion_dpto?: any;
    documento?: any;
    id_tipo_documento: number;
    id_tipo_usuario: number;
    id: number;

    tipo:TipoUsuario;
    tipo_documento:TipoDocumento;
    sedes:UsuarioSede[];

    password:string;
    c_password:string;
    n_password:string;

    archivos:UsuarioArchivo[];
}

export class Docente implements Usuario {
    estado: boolean;    created_at: string;
    updated_at: string;
    email: string;
    nombre?: any;
    apellido?: any;
    fecha_nacimiento?: any;
    telefono: string;
    celular: string;
    direccion: string;
    direccion_numero: string;
    direccion_piso: string;
    direccion_dpto?: any;
    documento?: any;
    id_tipo_documento: number;
    id_tipo_usuario: number;
    id: number;
    tipo: TipoUsuario;
    tipo_documento: TipoDocumento;
    sedes: UsuarioSede[];
    password: string;
    c_password: string;
    n_password: string;
    archivos:UsuarioArchivo[];

    id_usuario:number;
    titulo:number;
    cuit:number;
    observaciones:number;

    contratos:DocenteContrato[];

    usuario:Usuario;
}

export interface UsuarioArchivo{
    id:number;
    nombre:string;
    id_usuario:number;
    archivo:any;

    usuario:Usuario;
    url:any;
    subido:boolean;
}

export interface DocenteMateria{
    id:number;
    id_sede: number;
    id_usuario:number;
    id_materia:number;
    id_carrera:number;

    estado:boolean;
    created_at:string;
    updated_at:string;
}

export interface DocenteContrato{
    id:number;
    id_usuario:number;
    id_tipo_contrato:number;

    tipo:TipoContrato;

    estado:boolean;
    created_at:string;
    updated_at:string;
}