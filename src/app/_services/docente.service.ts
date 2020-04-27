import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Ajax } from '../_models/tipo';
import { Docente, DocenteContrato } from '../_models/usuario';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
 
export interface FiltroDocente {
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
export class DocenteService {
    api:string = environment.apiUrl+'docentes';

    constructor(
        private http: HttpClient,
        ) {
    }

    getAll(filtro:FiltroDocente = <FiltroDocente>{}){
        return this.http.get<Docente[]>(this.api,{
            params:AuxiliarFunction.toParams(filtro),
        });
    }

    ajax(filtro:FiltroDocente):  Observable<Ajax<Docente>>{
        return this.http.get<Ajax<Docente>>(this.api, {
            params: AuxiliarFunction.toParams(filtro),
        });
    }

    register(item:Docente){
        return this.http.post<Docente>(this.api,item);
    }

    getById(id:number) {
        return this.http.get<Docente>([this.api,id].join('/'));
    }
    
    update(item:Docente){
        return this.http.put<Docente>([this.api,item.id].join('/'),item);
    }

    delete(id:number) {
        return this.http.delete([this.api,id].join('/'));
    }

    contrato_asociar(item:DocenteContrato){
        return this.http.post([this.api,item.id_usuario,'contratos',item.id_tipo_contrato].join('/'),{});
    }

    contrato_desasociar(item:DocenteContrato){
        return this.http.delete([this.api,item.id_usuario,'contratos',item.id_tipo_contrato].join('/'));
    }

    exportar(filtro:FiltroDocente):Observable<HttpResponse<Blob>>{
        return this.http.get<Blob>([this.api,'exportar'].join('/'),{
            observe:'response',
            responseType:'blob' as 'json',
            params:AuxiliarFunction.toParams(filtro),
        });
    }

}