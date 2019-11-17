import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Movimiento, FormaPago, TipoComprobante } from '../_models/movimiento';
import { Observable } from 'rxjs';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
import { SedeService } from './sede.service';

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
        private sedeService:SedeService,
        ) {
        this.id_sede = this.sedeService.getIdSede();
        this.sedeService.id_sede$.subscribe( id=>{
            this.id_sede = id
        });
    }
 

    sede(id_sede:number){
        this.id_sede = id_sede;
    }

    getAll(){
        return this.http.get<Movimiento[]>(this.api + this.id_sede + '/movimientos' );
    }

    ajax(filtro:FiltroMovimiento):  Observable<MovimientoAjax>{
        return this.http.get<MovimientoAjax>(this.api + this.id_sede + '/movimientos', {
            params: AuxiliarFunction.toParams(filtro),
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
            params: AuxiliarFunction.toParams(filtro),
        });
    }

    estadisticas_tipo(filtro:FiltroMovimiento){
        return this.http.get(this.api + this.id_sede + '/movimientos/estadisticas/tipos',{
            params: AuxiliarFunction.toParams(filtro),
        });
    }
    estadisticas_diaria(filtro:FiltroMovimiento){
        return this.http.get(this.api + this.id_sede + '/movimientos/estadisticas/diarias',{
            params: AuxiliarFunction.toParams(filtro),
        });
    }
    estadisticas_mensual(filtro:FiltroMovimiento){
        return this.http.get(this.api + this.id_sede + '/movimientos/estadisticas/mensual',{
            params: AuxiliarFunction.toParams(filtro),
        });
    }
}