import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Ajax } from '../_models/tipo';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
import { SedeService } from './sede.service';
import { Aula } from '../_models/aula';
 
export interface FiltroAula {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
}

@Injectable()
export class AulaService {
    api:string = environment.apiUrl+'sedes';
    id_sede:number;
    resource:string = 'aulas';

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

    getAll(){
        return this.http.get<Aula[]>(this.ruta );
    }

    ajax(filtro:FiltroAula):  Observable<Ajax<Aula>>{
        return this.http.get<Ajax<Aula>>(this.ruta, {
            params: AuxiliarFunction.toParams(filtro),
        });
    }

    register(item:Aula){
        return this.http.post<Aula>(this.ruta,item);
    }

    getById(id:number) {
        return this.http.get<Aula>([this.ruta,id].join('/'));
    }
    
    update(item:Aula){
        return this.http.put<Aula>([this.ruta,item.id].join('/'),item);
    }

    delete(id:number) {
        return this.http.delete<Aula>([this.ruta,id].join('/'));
    }

}