import { Usuario } from "./usuario";

export interface Movimiento{
    id:number;
    monto:number;
    descripcion:string;
    fecha:string;
    cheque_numero:string;
    cheque_banco:string;
    cheque_origen:string;
    cheque_vencimiento:string;
    id_forma_pago:number;
    id_tipo_movimiento:number;
    id_usuario:number;
    id_usuario_baja:number;
    id_sede:number;
    id_tipo_egreso_ingreso:number;
    numero:string;
    id_tipo_comprobante:number;
    estado:boolean;
    created_at:Date;
    updated_at:Date;
    deleted_at:Date;

    forma:FormaPago;
    tipo:TipoMovimiento;
    tipo_comprobante:TipoComprobante
    usuario:Usuario;
    usuario_baja:Usuario;
}

export interface FormaPago{
    id:number;
    nombre:string;
}

export interface TipoMovimiento{
    id:number;
    nombre:string;
    descripcion:string;
    id_sede:string;
    id_tipo_egreso_ingreso:number;
    id_usuario:number;
    id_usuario_baja:number;
    estado:boolean;
    created_at:Date;
    updated_at:Date;
    deleted_at:Date;

    usuario:Usuario;
    usuario_baja:Usuario;
}

export interface TipoComprobante{
    id:number;
    nombre:string;
}