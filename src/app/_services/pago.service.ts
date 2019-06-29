import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { PlanPago } from '../_models/plan_pago';
import { Pago, TipoPago } from '../_models/pago';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';

export interface FiltroPago {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
    id_tipo_pago:number;
    id_departamento:number;
    id_carrera:number;
    fecha_inicio:string;
    fecha_fin:string;
}
export interface PagoAjax{
    items: Pago[];
    total_count: number;
}

@Injectable()
export class PagoService {

    api:string = environment.apiUrl+'sedes/';

    id_sede:number;

    constructor(
        private http: HttpClient,
        ) {
    }

    sede(id_sede:number){
        this.id_sede = id_sede;
    }

    getAll() {
        return this.http.get<PlanPago[]>(
            this.api +this.id_sede+ '/pagos');
    }

    ajax(filtro:FiltroPago):  Observable<PagoAjax>{
        return this.http.get<PagoAjax>(this.api +this.id_sede+ '/pagos', {
            params: AuxiliarFunction.toParams(filtro)
        });
    }
 
    getById(id: number) {
        return this.http.get<Pago>(
            this.api +this.id_sede+ '/pagos/' +
            id);
    }

    delete(id: number) {
        return this.http.delete<Pago>(
            this.api +this.id_sede+ '/pagos/' +
            id);
    }

    estadisticas(id: number) {
        return this.http.get(
            this.api +this.id_sede+ '/pagos/' +
            id+'/cuenta_corriente');
    }

    estadistica_cuenta_corriente(id: number) {
        return this.http.get(
            this.api +this.id_sede+ '/pagos/' +
            id+'/cuenta_corriente/cuenta_corriente');
    }

    exportar(filtro:FiltroPago){
        return this.http.get(this.api + this.id_sede + '/pagos/exportar',{
            responseType:'blob',
            params: AuxiliarFunction.toParams(filtro)
        });
    }

    reporte(id_pago:number){
        return this.http.get(this.api + this.id_sede + '/pagos/' + id_pago +'/reportes',{responseType: 'blob'});
    }
    
    tipos() {
        return this.http.get<TipoPago[]>(environment.apiUrl+ 'pagos/tipos');
    }
}