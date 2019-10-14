import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MesaExamenMateriaDocente } from '../_models/mesa.examen';
import { SedeService } from './sede.service';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
import { Ajax } from '../_models/tipo';
import { Observable } from 'rxjs';

export interface FiltroMesaExamenMateriaDocente {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
    id_departamento:number;
    id_carrera:number;
    id_materia:number;
    id_mesa_examen:number;
    id_usuario:number;
    fecha_inicial:string;
    fecha_final:string;
}

@Injectable()
export class MesaExamenMateriaDocenteService {

    api:string = environment.apiUrl+'sedes';
    id_sede:number;
    resource:string = 'mesas/materias/docentes';
    constructor(
        private http: HttpClient,
        private sede:SedeService,
        ) {
            this.id_sede = this.sede.getIdSede();
            this.sede.id_sede$.subscribe(id=>{
                this.id_sede = id;
            });
    }

    get ruta(){
        return [this.api,this.id_sede,this.resource].join('/')
    }

    getAll(filtro:FiltroMesaExamenMateriaDocente=<FiltroMesaExamenMateriaDocente>{}){
        return this.http.get<MesaExamenMateriaDocente[]>(this.ruta,{
            params:AuxiliarFunction.toParams(filtro),
        });
    }

    ajax(filtro:FiltroMesaExamenMateriaDocente){
        return this.http.get<Ajax<MesaExamenMateriaDocente>>(this.ruta,{
            params:AuxiliarFunction.toParams(filtro),
        });
    }

    getById(id:number) {
        return this.http.get<MesaExamenMateriaDocente>([this.ruta,id].join('/'));
    }

    register(item:MesaExamenMateriaDocente){
        return this.http.post<MesaExamenMateriaDocente>(this.ruta,item);
    }

    update(item: MesaExamenMateriaDocente) {
        return this.http.put<MesaExamenMateriaDocente>([this.ruta,item.id].join('/'),item);
    }

    delete(id:number){
        return this.http.delete<MesaExamenMateriaDocente>([this.ruta,id].join('/'));
    }

    reporte_docente(filtro:FiltroMesaExamenMateriaDocente):Observable<HttpResponse<Blob>> {
        return this.http.get<Blob>(
            this.ruta + '/reportes',{
                observe:'response',
                responseType:'blob' as 'json',
                params:AuxiliarFunction.toParams(filtro),
            });
    }
}