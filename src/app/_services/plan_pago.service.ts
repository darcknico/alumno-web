import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { PlanPago, PlanPagoPrecio } from '../_models/plan_pago';
import { Pago } from '../_models/pago';
import { Obligacion } from '../_models/obligacion';
import { SedeService } from './sede.service';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';

export interface FiltroPlanPago {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
    id_departamento:number;
    id_carrera:number;
    deudores:number;
    id_tipo_materia_lectivo:number;
    anio:number;
}
export interface PlanPagoAjax{
    items: PlanPago[];
    total_count: number;
}

@Injectable()
export class PlanPagoService {

    api:string = environment.apiUrl.slice(0, -1);;
    resource:string = 'planes_pago';
    id_sede:number;

    get ruta(){
        return [this.api,'sedes',this.id_sede,this.resource].join('/')
    }

    constructor(
        private http: HttpClient,
        private sede: SedeService,
        ) {
        this.id_sede = this.sede.getIdSede();
        this.sede.id_sede$.subscribe(id=>{
            this.id_sede = id;
        });
    }

    getAll() {
        return this.http.get<PlanPago[]>(this.ruta);
    }

    ajax(filtro:FiltroPlanPago):  Observable<PlanPagoAjax>{
        return this.http.get<PlanPagoAjax>(this.ruta, {
            params: AuxiliarFunction.toParams(filtro),
        });
    }
 
    getById(id: number) {
        return this.http.get<PlanPago>([this.ruta,id].join('/'));
    }

    delete(id: number) {
        return this.http.delete<PlanPago>([this.ruta,id].join('/'));
    }

    store(item:PlanPago){
        return this.http.post<PlanPago>([this.ruta].join('/'),item);
    }

    update(item: PlanPago) {
        return this.http.put<PlanPago>([this.ruta,item.id].join('/'),item);
    }

    cuenta_corriente(id: number) {
        return this.http.get<Obligacion[]>( [this.ruta,id,'cuenta_corriente'].join('/') );
    }

    siguiente(id: number,id_tipo_obligacion:number) {
        return this.http.get<Obligacion>( [this.ruta,id,'siguiente'].join('/'),
            {
                params:{
                    id_tipo_obligacion:String(id_tipo_obligacion)
                }
            });
    }

    rearmar(id: number) {
        return this.http.put<Obligacion[]>( [this.ruta,id,'cuenta_corriente'].join('/'),{});
    }

    pagos(id: number) {
        return this.http.get<Pago[]>( [this.ruta,id,'pagos'].join('/') );
    }

    cuotas(id: number) {
        return this.http.get<Obligacion[]>( [this.ruta,id,'cuotas'].join('/') );
    }

    matricula(id: number) {
        return this.http.get<Obligacion>( [this.ruta,id,'matricula'].join('/') );
    }


    pagar(item:Pago) {
        return this.http.post( [this.ruta,item.id_plan_pago,'pagar'].join('/') ,item );
    }

    pagarPreparar(item:Pago) {
        return this.http.put( [this.ruta,item.id_plan_pago,'pagar'].join('/') ,item);
    }

    bonificar(item:Pago) {
        return this.http.post( [this.ruta,item.id_plan_pago,'bonificar'].join('/') ,item);
    }

    bonificarPreparar(item:Pago) {
        return this.http.put( [this.ruta,item.id_plan_pago,'bonificar'].join('/') ,item);
    }

    pagarMatricula(item:Pago) {
        return this.http.post( [this.ruta,item.id_plan_pago,'matricula'].join('/') ,item);
    }

    exportar(filtro:FiltroPlanPago):Observable<HttpResponse<Blob>>{
        return this.http.get<Blob>( [this.ruta,'exportar'].join('/') ,
        {
            observe:'response',
            responseType:'blob' as 'json',
            params: AuxiliarFunction.toParams(filtro),
        });
    }
    exportar_alumnos(filtro:FiltroPlanPago):Observable<HttpResponse<Blob>>{
        return this.http.get<Blob>( [this.ruta,'exportar/alumnos'].join('/') ,
        {
            observe:'response',
            responseType:'blob' as 'json',
            params: AuxiliarFunction.toParams(filtro),
        });
    }

    estadisticas() {
        return this.http.get( [this.ruta,'estadisticas'].join('/') );
    }

    /* PRECIOS */


    precios_ultimo(){
        return this.http.get<PlanPagoPrecio>( [this.ruta,'precios/ultimo'].join('/') );
    }

    precios_store(item:PlanPagoPrecio){
        return this.http.post<PlanPagoPrecio>( [this.ruta,'precios'].join('/') ,item);
    }

    precios_delete(id_plan_pago_precio:number){
        return this.http.delete<PlanPagoPrecio>( [this.ruta,'precios',id_plan_pago_precio].join('/') );
    }

    /* PREVIA */

    previa(item:PlanPago){
        return this.http.post<{
            obligaciones:Obligacion[],
            total:number,
        }>([this.api,this.resource,'previa'].join('/'),item);
    }
}