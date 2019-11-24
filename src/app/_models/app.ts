import { Usuario } from './usuario';
import { Sede } from './sede';

export interface AppAsistencia{
    id:number;
    id_usuario:number;
    id_sede:number;
    fecha:string;
    latitud:number;
    longitud:number;
    id_usuario_dispositivo:number;

    usuario:Usuario;
    sede:Sede;
    dispositivo:UsuarioDispositivo;
}

export interface UsuarioDispositivo{
    id:number;
    id_usuario:number;
    device_id:string;
    device_os:string;
    device_model:string;
    manufacturer:string;

    usuario:Usuario;
}