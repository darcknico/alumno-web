import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Ajax } from '../_models/tipo';
import { DocenteMateria } from '../_models/usuario';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
 
export interface FiltroDocenteMateria {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
    id_sede:number;
    id_usuario:number;
    id_materia:number;
    id_plan_estudio:number;
    id_carrera:number;
    id_departamento:number;
    id_tipo_docente_cargo:number;
}

@Injectable()
export class DocenteMateriaService {
    api:string = environment.apiUrl+'docentes/materias';

    constructor(
        private http: HttpClient,
        ) {
    }

    getAll(filtro:FiltroDocenteMateria = <FiltroDocenteMateria>{}){
        return this.http.get<DocenteMateria[]>(this.api,{
            params:AuxiliarFunction.toParams(filtro),
        });
    }

    ajax(filtro:FiltroDocenteMateria):  Observable<Ajax<DocenteMateria>>{
        return this.http.get<Ajax<DocenteMateria>>(this.api, {
            params: AuxiliarFunction.toParams(filtro),
        });
    }

    register(item:DocenteMateria){
        return this.http.post<DocenteMateria>(this.api,item);
    }

    getById(id:number) {
        return this.http.get<DocenteMateria>([this.api,id].join('/'));
    }
    
    update(item:DocenteMateria){
        return this.http.put<DocenteMateria>([this.api,item.id].join('/'),item);
    }

    delete(id:number) {
        return this.http.delete([this.api,id].join('/'));
    }

}