import { Sede } from './sede';

export interface Aula{
    id:number;
    numero:number;
    nombre:string;
    capacidad:number;
    id_sede:number;
    estado:boolean;
    created_at:string;
    updated_at:string;

    sede:Sede;
}