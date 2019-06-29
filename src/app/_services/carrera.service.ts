import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Carrera, CarreraModalidad } from '../_models/carrera';
import { Observable } from 'rxjs';
import { Comision } from '../_models/comision';

export interface FiltroCarrera {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
    id_departamento:number;
}
export interface CarreraAjax{
    items: Carrera[];
    total_count: number;
}

@Injectable()
export class CarreraService {

    api:string = environment.apiUrl;

    id_departamento:number;

    constructor(
        private http: HttpClient,
        ) {
    }

    getAll() {
        return this.http.get<Carrera[]>(
            this.api + 'carreras');
    }

    ajax(filtro:FiltroCarrera):  Observable<CarreraAjax>{
        return this.http.get<CarreraAjax>(this.api + 'carreras', {
            params: {
                search: filtro.search,
                sort: filtro.sort,
                order: filtro.order,
                start: String(filtro.start),
                length: String(filtro.length),
                id_departamento: String(filtro.id_departamento),
            }
        });
    }
 
    getById(id: number) {
        return this.http.get<Carrera>(
            this.api + 'carreras/' +
            id);
    }
 
    register(item: Carrera) {
        return this.http.post<Carrera>(
            this.api + 'carreras', item);
    }
 
    update(item: Carrera) {
        return this.http.put<Carrera>(
            this.api + 'carreras/' + 
            item.id, item);
    }
 
    delete(id: number) {
        return this.http.delete(
            this.api + 'carreras/' + 
            id);
    }

    departamento(id_departamento:number){
        this.id_departamento = id_departamento;
    }
 
    _getAll(id_departamento:number) {
        return this.http.get<Carrera[]>(
            this.api + 'departamentos/'+
            id_departamento + '/carreras');
    }
 
    _register(id_departamento:number,item: Carrera) {
        return this.http.post<Carrera>(
            this.api + 'departamentos/'+
            id_departamento + '/carreras', item);
    }

    modalidad_asociar(item:CarreraModalidad){
        return this.http.post<CarreraModalidad>(
            this.api + 'carreras/' + 
            item.id_carrera + '/modalidades/' + item.id_modalidad, item);
    }

    modalidad_desasociar(item:CarreraModalidad){
        return this.http.delete<CarreraModalidad>(
            this.api + 'carreras/' + 
            item.id_carrera + '/modalidades/' + item.id_modalidad);
    }

    seleccionar_plan(item:Carrera){
        return this.http.post<Carrera>(
            this.api + 'carreras/' + 
            item.id + '/planes_estudio/' + item.id_plan_estudio+'/seleccionar',{});
    }

    estadisticas() {
        return this.http.get(this.api + 'carreras/estadisticas');
    }

}