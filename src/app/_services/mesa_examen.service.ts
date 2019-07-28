import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { MesaExamen, MesaExamenMateria } from '../_models/mesa.examen';
import { Materia } from '../_models/materia';
import { Ajax } from '../_models/tipo';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
import { FiltroMesaExamenMateria } from './mesa_examen_materia.service';
import { SedeService } from './sede.service';
 
export interface FiltroMesaExamen {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
}

@Injectable()
export class MesaExamenService {

    api:string = environment.apiUrl+'sedes/';
    private endpoint:string = '/mesas/';
    private _endpoint:string = '/mesas';
    id_sede:number;
    constructor(
        private http: HttpClient,
        private sede:SedeService,
        ) {
        this.id_sede = sede.getIdSede();
        this.sede.id_sede$.subscribe(id=>{
            this.id_sede = id;
        })
    }

    getAll(){
        return this.http.get<MesaExamen[]>(this.api + this.id_sede + this._endpoint );
    }

    ajax(filtro:FiltroMesaExamen): Observable<Ajax<MesaExamen>>{
        return this.http.get<Ajax<MesaExamen>>(this.api + this.id_sede + this._endpoint, {
            params: AuxiliarFunction.toParams(filtro),
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

    materias_disponibles(id_mesa_examen:number,filtro:FiltroMesaExamenMateria=<FiltroMesaExamenMateria>{}):Observable<Materia[] | Ajax<Materia>>{
        return this.http.get<Materia[] | Ajax<Materia>>(this.api + this.id_sede + this.endpoint +id_mesa_examen+'/materias/disponibles',{
            params: AuxiliarFunction.toParams(filtro),
        });
    }

    reporte_resumen(id:number):Observable<HttpResponse<Blob>>{
        return this.http.get<Blob>(this.api + this.id_sede + this.endpoint + id + '/reportes/resumen',{
            observe:'response',
            responseType:'blob' as 'json',
        });
    }

}