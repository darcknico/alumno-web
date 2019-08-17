import { Movimiento } from "./movimiento";
import { Usuario } from './usuario';

export interface Diaria{
    id:number;
    saldo_anterior:number;
    saldo_otros_anterior:number;
    fecha_inicio:string;
    fecha_fin:string;
    saldo:number;
    saldo_otros:number;
    total_ingreso:number;
    total_otros_ingreso:number;
    total_egreso:number;
    total_otros_egreso:number;
    id_usuario:number;

    ingresos:Movimiento[];
    egresos:Movimiento[];
    usuario:Usuario;
}