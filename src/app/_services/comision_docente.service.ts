import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Ajax } from '../_models/tipo';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
import { SedeService } from './sede.service';
import { ComisionDocente } from '../_models/comision';
import { SedeProvider } from '../_providers/sede.provider';
 
export interface FiltroComisionDocente {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;

    id_departamento:number;
    id_carrera:number;
    id_materia:number;
    id_comision:number;
    id_usuario:number;
    anio:number;
}

@Injectable()
export class ComisionDocenteService {
    api:string = environment.apiUrl+'sedes';
    id_sede:number;
    resource:string = 'comisiones/docentes';

    get ruta(){
        return [this.api,this.id_sede,this.resource].join('/');
    }

    constructor(
        private http: HttpClient,
        private sede:SedeProvider,
        ) {
        this.id_sede = this.sede.getIdSede();
        this.sede.id_sede$.subscribe(id_sede => {
            this.id_sede = id_sede;
        });
    }

    getAll(){
        return this.http.get<ComisionDocente[]>(this.ruta );
    }

    ajax(filtro:FiltroComisionDocente):  Observable<Ajax<ComisionDocente>>{
        return this.http.get<Ajax<ComisionDocente>>(this.ruta, {
            params: AuxiliarFunction.toParams(filtro),
        });
    }

    register(item:ComisionDocente){
        return this.http.post<ComisionDocente>(this.ruta,item);
    }

    getById(id:number) {
        return this.http.get<ComisionDocente>([this.ruta,id].join('/'));
    }
    
    update(item:ComisionDocente){
        return this.http.put<ComisionDocente>([this.ruta,item.id].join('/'),item);
    }

    delete(id:number) {
        return this.http.delete<ComisionDocente>([this.ruta,id].join('/'));
    }

}