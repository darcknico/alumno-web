import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { PlanPago, PlanPagoPrecio } from '../_models/plan_pago';
import { Pago } from '../_models/pago';
import { Obligacion } from '../_models/obligacion';

export interface FiltroPlanPago {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
    id_departamento:number;
    id_carrera:number;
    deudores:number;
}
export interface PlanPagoAjax{
    items: PlanPago[];
    total_count: number;
}

@Injectable()
export class PlanPagoService {

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
            this.api +this.id_sede+ '/planes_pago');
    }

    ajax(filtro:FiltroPlanPago):  Observable<PlanPagoAjax>{
        return this.http.get<PlanPagoAjax>(this.api +this.id_sede+ '/planes_pago', {
            params: {
                search: filtro.search,
                sort: filtro.sort,
                order: filtro.order,
                start: String(filtro.start),
                length: String(filtro.length),
                id_departamento: String(filtro.id_departamento),
                id_carrera: String(filtro.id_carrera),
                deudores: String(filtro.deudores),
            }
        });
    }
 
    getById(id: number) {
        return this.http.get<PlanPago>(
            this.api +this.id_sede+ '/planes_pago/' +
            id);
    }

    delete(id: number) {
        return this.http.delete<PlanPago>(
            this.api +this.id_sede+ '/planes_pago/' +
            id);
    }

    store(plan_pago:PlanPago){
        return this.http.post<PlanPago>(
            this.api +this.id_sede+ '/inscripciones/' +
            plan_pago.id_inscripcion + '/planes_pago'
            ,plan_pago);
    }

    cuenta_corriente(id: number) {
        return this.http.get<Obligacion[]>(
            this.api +this.id_sede+ '/planes_pago/' +
            id+'/cuenta_corriente');
    }

    siguiente(id: number,id_tipo_obligacion:number) {
        return this.http.get<Obligacion>(
            this.api +this.id_sede+ '/planes_pago/' +
            id+'/siguiente',{
                params:{
                    id_tipo_obligacion:String(id_tipo_obligacion)
                }
            });
    }

    rearmar(id: number) {
        return this.http.put<Obligacion[]>(
            this.api +this.id_sede+ '/planes_pago/' +
            id+'/cuenta_corriente',{});
    }

    pagos(id: number) {
        return this.http.get<Pago[]>(
            this.api +this.id_sede+ '/planes_pago/' +
            id+'/pagos');
    }

    cuotas(id: number) {
        return this.http.get<Obligacion[]>(
            this.api +this.id_sede+ '/planes_pago/' +
            id+'/cuotas');
    }

    matricula(id: number) {
        return this.http.get<Obligacion>(
            this.api +this.id_sede+ '/planes_pago/' +
            id+'/matricula');
    }


    pagar(item:Pago) {
        return this.http.post(
            this.api +this.id_sede+ '/planes_pago/' +
            item.id_plan_pago+'/pagar',item);
    }

    pagarPreparar(item:Pago) {
        return this.http.put(
            this.api +this.id_sede+ '/planes_pago/' +
            item.id_plan_pago+'/pagar',item);
    }

    bonificar(item:Pago) {
        return this.http.post(
            this.api +this.id_sede+ '/planes_pago/' +
            item.id_plan_pago+'/bonificar',item);
    }

    bonificarPreparar(item:Pago) {
        return this.http.put(
            this.api +this.id_sede+ '/planes_pago/' +
            item.id_plan_pago+'/bonificar',item);
    }

    pagarMatricula(item:Pago) {
        return this.http.post(
            this.api +this.id_sede+ '/planes_pago/' +
            item.id_plan_pago+'/matricula',item);
    }

    exportar(filtro:FiltroPlanPago){
        return this.http.get(this.api + this.id_sede + '/planes_pago/exportar',{
            responseType:'blob',
            params:{
                search: filtro.search,
                id_departamento: String(filtro.id_departamento),
                id_carrera: String(filtro.id_carrera),
                deudores: String(filtro.deudores),
            }
        });
    }

    estadisticas() {
        return this.http.get(this.api + this.id_sede + '/planes_pago/estadisticas');
    }

    /* PRECIOS */


    precios_ultimo(){
        return this.http.get<PlanPagoPrecio>(
            this.api +this.id_sede+ '/planes_pago/precios/ultimo'
            );
    }

    precios_store(item:PlanPagoPrecio){
        return this.http.post<PlanPagoPrecio>(
            this.api +this.id_sede+ '/planes_pago/precios'
            ,item);
    }

    precios_delete(id_plan_pago_precio:number){
        return this.http.delete<PlanPagoPrecio>(
            this.api +this.id_sede+ '/planes_pago/precios/'+id_plan_pago_precio
            );
    }
}