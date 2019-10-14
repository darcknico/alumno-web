import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Ajax } from '../_models/tipo';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
import { Obligacion } from '../_models/obligacion';
 
export interface FiltroObligacion {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
    id_sede:number;
    id_tipo_contrato:number;
    id_carrera:number;
    estado:boolean;
}

@Injectable()
export class ObligacionService {
    api:string = environment.apiUrl+'obligaciones';

    constructor(
        private http: HttpClient,
        ) {
    }

    getAll(filtro:FiltroObligacion = <FiltroObligacion>{}){
        return this.http.get<Obligacion[]>(this.api,{
            params:AuxiliarFunction.toParams(filtro),
        });
    }

    ajax(filtro:FiltroObligacion):  Observable<Ajax<Obligacion>>{
        return this.http.get<Ajax<Obligacion>>(this.api, {
            params: AuxiliarFunction.toParams(filtro),
        });
    }

    register(item:Obligacion){
        return this.http.post<Obligacion>(this.api,item);
    }

    getById(id:number) {
        return this.http.get<Obligacion>([this.api,id].join('/'));
    }
    
    update(item:Obligacion){
        return this.http.put<Obligacion>([this.api,item.id].join('/'),item);
    }

    delete(id:number) {
        return this.http.delete([this.api,id].join('/'));
    }

}