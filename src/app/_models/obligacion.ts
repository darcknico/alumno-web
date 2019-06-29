import { Usuario } from "./usuario";
import { PlanPago } from "./plan_pago";
import { Pago } from "./pago";

export interface Obligacion{
    id:number;
    id_plan_pago:number;
    id_usuario:number;
    id_tipo_obligacion:number;
    descripcion:string;
    monto:number;
    saldo:number;
    pagado:number;
    id_obligacion:number;
    fecha_vencimiento:Date;
    fecha:Date;
    estado:boolean;
    created_at:Date;
    updated_at:Date;

    acumulado:number;

    plan_pago:PlanPago;
    usuario:Usuario;
    tipo:TipoObligacion;
    pagos:ObligacionPago[];
    interes:Obligacion;
    obligacion:Obligacion;
    intereses:ObligacionInteres[];
}

export interface TipoObligacion{
    id:number;
    nombre:string;
}

export interface ObligacionPago{
    id:number;
    id_pago:number;
    id_obligacion:number;
    id_usuario:number;
    monto:number;
    estado:boolean;
    created_at:Date;
    updated_at:Date;

    pago:Pago;
    obligacion:Obligacion;
    usuario:Usuario;
}

export interface ObligacionInteres{
    id:number;
    fecha:Date;
    fecha_hasta:Date;
    saldo:number;
    interes:number;
    monto:number;
    cantidad_meses:number;
    id_obligacion:number;
    estado:boolean;
    created_at:Date;
    updated_at:Date;

    obligacion:Obligacion;
}