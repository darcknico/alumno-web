import { Sede } from "./sede";
import { Usuario } from "./usuario";
import { Inscripcion } from "./inscripcion";
import { Obligacion } from "./obligacion";

export interface PlanPago{
    id:number;
    id_sede:number;
    id_inscripcion:number;
    matricula_monto:number;
    matricula_saldo:number;
    matricula_pagado:number;
    cuota_monto:number;
    interes_monto:number;
    anio:number;
    cuota_cantidad:number;
    cuota_total:number;
    cuota_pagado:number;
    fecha:string;
    dias_vencimiento:number;

    id_usuario:number;
    estado:boolean;
    created_at:Date;
    updated_at:Date;

    pagado:number;
    bonificado:number;
    interes_total:number;
    interes_saldo:number;
    saldo_total:number;
    saldo_hoy:number;
    
    sede:Sede;
    inscripcion:Inscripcion;
    usuario:Usuario;
    obligaciones:Obligacion[];

    id_beca:number;
    beca_nombre:string;
    beca_porcentaje:number;
    beca_porcentaje_matricula:number;
}

export interface PlanPagoPrecio{
    id:number;
    matricula_monto:number;
    cuota_monto:number;
    bonificacion_monto:number;
    interes_monto:number;
    id_sede:number;
    id_usuario:number;
    estado:boolean;
    created_at:Date;
    updated_at:Date;

    usuario:Usuario;
    usuario_baja:Usuario;
    sede:Sede;
}