import { Usuario } from './usuario';
import { Sede } from './sede';

export interface Provincia{
    id:number;
    nombre:string;
}

export interface Localidad{
    id:number;
    nombre:string;
    codigo_postal:number;

    id_provincia:number;
}

export interface Auditoria<T>{
    id:number;
    user_type:string;
    event:string;
    auditable_type:string;
    uditable_id:415,
    old_values:T;
    new_values:T;
    url:string;
    ip_address:string;
    user_agent:string;
    tags:any;
    created_at:Date;
    updated_at:Date;
    user:Usuario;
    auditable:T;
}

export interface ReporteJob{
    id:number;
    nombre:string;
    ruta:string;
    cantidad:number;
    contador:number;
    terminado:Date;
    id_usuario:number;
    id_sede:number;
    created_at:Date;
    updated_at:Date;

    usuario:Usuario;
    sede:Sede;
}

export interface Dia{
    id:number;
    nombre:string;
}