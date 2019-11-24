import { Usuario } from './usuario';

import { Sede } from './sede';

export interface NovedadSistema{
    id:number;
    titulo:string;
    descripcion:string;
    cuerpo:string;
    mostrar:boolean;
    id_sede:number;
    id_usuario:number;
    estado:boolean;
    created_at:string;
    updated_at:string;

    usuario:Usuario;
    sede:Sede;
}

export interface NovedadUsuario{
    id:number;
    id_novedad_sistema:number;
    id_usuario:number;
    estado:boolean;
    created_at:string;
    updated_at:string;

    usuario:Usuario;
    novedad:NovedadSistema;
}