import { Usuario } from "./usuario";
import { PlanPago } from "./plan_pago";
import { Obligacion, ObligacionPago } from "./obligacion";
import { Sede } from "./sede";
import { Movimiento } from "./movimiento";
import { Alumno } from "./alumno";
import { Inscripcion } from './inscripcion';

export interface Pago{
    id:number;
    id_sede:number;
    id_plan_pago:number;
    id_usuario:number;
    id_obligacion:number;
    fecha:string;
    monto:number;
    descripcion:string;
    id_tipo_pago:number;
    numero:number;
    numero_oficial:string;
    id_movimiento:number;
    id_inscripcion:number;
    estado:boolean;
    created_at:Date;
    updated_at:Date;

    usuario:Usuario;
    plan_pago:PlanPago;
    obligacion:Obligacion;
    sede:Sede;
    detalles:ObligacionPago[];
    tipo:TipoPago;
    movimiento:Movimiento;
    alumno:Alumno;
    inscripcion:Inscripcion;
    
    bonificar_intereses:boolean;
    bonificar_cuotas:boolean;
    especial_covid:boolean;
    especial_ahora_estudiantes:boolean;
    especial_nov_dic_2020:boolean;
}

export interface TipoPago{
    id:number;
    nombre:string;
}