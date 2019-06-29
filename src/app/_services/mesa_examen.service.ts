import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { MesaExamen, MesaExamenMateria } from '../_models/mesa.examen';
import { Materia } from '../_models/materia';
 
export interface FiltroMesaExamen {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
}
export interface MesaExamenAjax{
    items: MesaExamen[];
    total_count: number;
}
@Injectable()
export class MesaExamenService {

    api:string = environment.apiUrl+'sedes/';
    private endpoint:string = '/mesas/';
    private _endpoint:string = '/mesas';
    id_sede:number;
    constructor(
        private http: HttpClient,
        ) {
    }

    sede(id_sede:number){
        this.id_sede = id_sede;
    }

    getAll(){
        return this.http.get<MesaExamen[]>(this.api + this.id_sede + this._endpoint );
    }

    ajax(filtro:FiltroMesaExamen):  Observable<MesaExamenAjax>{
        return this.http.get<MesaExamenAjax>(this.api + this.id_sede + this._endpoint, {
            params: {
                search: filtro.search,
                sort: filtro.sort,
                order: filtro.order,
                start: String(filtro.start),
                length: String(filtro.length),
            }
        });
    }

    getById(id:number) {
        return this.http.get<MesaExamen>(this.api + this.id_sede + this.endpoint +id);
    }

    register(item: MesaExamen) {
        return this.http.post<MesaExamen>(
            this.api + this.id_sede + this._endpoint, item);
    }

    update(item: MesaExamen) {
        return this.http.put<MesaExamen>(
            this.api + this.id_sede + this.endpoint + 
            item.id, item);
    }

    delete(id: number) {
        return this.http.delete(
            this.api + this.id_sede + this.endpoint + 
            id);
    }

    materia_asociar(item: MesaExamenMateria) {
        return this.http.post<MesaExamenMateria>(
            this.api + this.id_sede + this.endpoint +
            item.id_mesa_examen + '/materias/' +
            item.id_materia , item);
    }

    materia_desasociar(item: MesaExamenMateria) {
        return this.http.delete(
            this.api + this.id_sede + this.endpoint +
            item.id_mesa_examen + '/materias/' +
            item.id_materia);
    }

    materias(id_mesa_examen:number,id_carrera:number=0){
        return this.http.get<MesaExamenMateria[]>(this.api + this.id_sede + this.endpoint +id_mesa_examen+'/materias',{
            params:{
                id_carrera:String(id_carrera),
            }
        });
    }

    materias_disponibles(id_mesa_examen:number,id_carrera:number=0){
        return this.http.get<Materia[]>(this.api + this.id_sede + this.endpoint +id_mesa_examen+'/materias/disponibles',{
            params:{
                id_carrera:String(id_carrera),
            }
        });
    }

}