import { Movimiento } from "./movimiento";

export interface Diaria{
    id:number;
    saldo_anterior:number;
    saldo_otros_anterior:number;
    fecha_inicio:Date;
    fecha_fin:Date;
    saldo:number;
    saldo_otros:number;
    total_ingreso:number;
    total_otros_ingreso:number;
    total_egreso:number;
    total_otros_egreso:number;

    ingresos:Movimiento[];
    egresos:Movimiento[];
}