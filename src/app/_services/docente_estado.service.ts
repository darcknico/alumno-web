import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Ajax } from '../_models/tipo';
import { DocenteEstado } from '../_models/usuario';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
 
export interface FiltroDocenteEstado {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
    id_sede:number;
    id_usuario:number;
    id_tipo_docente_estado:number;
}

@Injectable()
export class DocenteEstadoService {
    api:string = environment.apiUrl+'docentes/estados';

    constructor(
        private http: HttpClient,
        ) {
    }

    getAll(filtro:FiltroDocenteEstado = <FiltroDocenteEstado>{}){
        return this.http.get<DocenteEstado[]>(this.api,{
            params:AuxiliarFunction.toParams(filtro),
        });
    }

    ajax(filtro:FiltroDocenteEstado):  Observable<Ajax<DocenteEstado>>{
        return this.http.get<Ajax<DocenteEstado>>(this.api, {
            params: AuxiliarFunction.toParams(filtro),
        });
    }

    register(item:DocenteEstado){
        let form = new FormData;
        for (const key in item) {
            if (item.hasOwnProperty(key)) {
                form.append(key,item[key]);
            }
        }
        return this.http.post<DocenteEstado>(this.api,form);
    }

    getById(id:number) {
        return this.http.get<DocenteEstado>([this.api,id].join('/'));
    }
    
    update(item:DocenteEstado){
        return this.http.put<DocenteEstado>([this.api,item.id].join('/'),item);
    }

    delete(id:number) {
        return this.http.delete([this.api,id].join('/'));
    }

    archivo(item:DocenteEstado):Observable<HttpResponse<Blob>>{
        return this.http.get<Blob>( [this.api,item.id,'archivos'].join('/'),{
            observe:'response',
            responseType:'blob' as 'json',
        });
    }
}