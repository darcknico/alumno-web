import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Movimiento, FormaPago, TipoComprobante } from '../_models/movimiento';
import { Observable } from 'rxjs';

export interface FiltroMovimiento {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
    id_forma_pago:number;
    id_tipo_movimiento:number;
    id_tipo_comprobante:number;
    id_tipo_egreso_ingreso:number;
    fecha_inicio:string;
    fecha_fin:string;
}
export interface MovimientoAjax{
    items: Movimiento[];
    total_count: number;
}

@Injectable()
export class MovimientoService {
    api:string = environment.apiUrl+'sedes/';
    id_sede:number;
    constructor(
        private http: HttpClient,
        ) {
    }
 

    sede(id_sede:number){
        this.id_sede = id_sede;
    }

    getAll(){
        return this.http.get<Movimiento[]>(this.api + this.id_sede + '/movimientos' );
    }

    ajax(filtro:FiltroMovimiento):  Observable<MovimientoAjax>{
        return this.http.get<MovimientoAjax>(this.api + this.id_sede + '/movimientos', {
            params: {
                search: filtro.search,
                sort: filtro.sort,
                order: filtro.order,
                start: String(filtro.start),
                length: String(filtro.length),
                id_forma_pago: String(filtro.id_forma_pago),
                id_tipo_egreso_ingreso: String(filtro.id_tipo_egreso_ingreso),
                fecha_inicio: filtro.fecha_inicio,
                fecha_fin: filtro.fecha_fin,
            }
        });
    }

    ingreso(item:Movimiento){
        return this.http.post<Movimiento>(this.api + this.id_sede + '/movimientos/ingresos',item);
    }

    egreso(item:Movimiento){
        return this.http.post<Movimiento>(this.api + this.id_sede + '/movimientos/egresos',item);
    }

    getById(id:number) {
        return this.http.get<Movimiento>(this.api + this.id_sede + '/movimientos/' +id);
    }

    update(item:Movimiento) {
        return this.http.put<Movimiento>(this.api + this.id_sede + '/movimientos/' +item.id,item);
    }

    delete(id:number) {
        return this.http.delete(this.api + this.id_sede + '/movimientos/' +id);
    }

    formas(){
        return this.http.get<FormaPago[]>(environment.apiUrl +'movimientos/formas');
    }

    comprobantes(){
        return this.http.get<TipoComprobante[]>(environment.apiUrl +'movimientos/comprobantes');
    }

    exportar(filtro:FiltroMovimiento){
        return this.http.get(this.api + this.id_sede + '/movimientos/exportar',{
            responseType:'blob',
            params:{
                search: filtro.search,
                id_forma_pago: String(filtro.id_forma_pago),
                id_tipo_egreso_ingreso: String(filtro.id_tipo_egreso_ingreso),
                fecha_inicio: filtro.fecha_inicio,
                fecha_fin: filtro.fecha_fin,
            }
        });
    }
}