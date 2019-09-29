import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Ajax } from '../_models/tipo';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
import { SedeService } from './sede.service';
import { ComisionHorario } from '../_models/comision';
 
export interface FiltroComisionHorario {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;

    id_departamento:number;
    id_carrera:number;
    id_materia:number;
    id_comision:number;
    id_dia:number;
    anio:number;
}

@Injectable()
export class ComisionHorarioService {
    api:string = environment.apiUrl+'sedes';
    id_sede:number;
    resource:string = 'comisiones/horarios';

    get ruta(){
        return [this.api,this.id_sede,this.resource].join('/');
    }

    constructor(
        private http: HttpClient,
        private sede:SedeService,
        ) {
        this.id_sede = this.sede.getIdSede();
        this.sede.id_sede$.subscribe(id_sede => {
            this.id_sede = id_sede;
        });
    }

    getAll(filtro?:FiltroComisionHorario){
        return this.http.get<ComisionHorario[]>(this.ruta, {
            params: AuxiliarFunction.toParams(filtro),
        });
    }

    ajax(filtro:FiltroComisionHorario):  Observable<Ajax<ComisionHorario>>{
        return this.http.get<Ajax<ComisionHorario>>(this.ruta, {
            params: AuxiliarFunction.toParams(filtro),
        });
    }

    register(item:ComisionHorario){
        return this.http.post<ComisionHorario>(this.ruta,item);
    }

    getById(id:number) {
        return this.http.get<ComisionHorario>([this.ruta,id].join('/'));
    }
    
    update(item:ComisionHorario){
        return this.http.put<ComisionHorario>([this.ruta,item.id].join('/'),item);
    }

    delete(id:number) {
        return this.http.delete<ComisionHorario>([this.ruta,id].join('/'));
    }

}