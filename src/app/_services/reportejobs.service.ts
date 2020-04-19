import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
import { Ajax } from '../_models/tipo';
import { ReporteJob } from '../_models/extra';
import { SedeService } from './sede.service';
import { SedeProvider } from '../_providers/sede.provider';
 
export interface FiltroReporteJob {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
}
@Injectable()
export class ReporteJobService {
    api:string = environment.apiUrl+'sedes';
    resource:string = 'reportes';
    id_sede:number;
    
    get ruta(){
        return [this.api,this.id_sede,this.resource].join('/');
    }

    constructor(
        private http: HttpClient,
        private sede: SedeProvider,
        ) {
        this.id_sede = this.sede.getIdSede();
        this.sede.id_sede$.subscribe(id=>{
            this.id_sede = id;
        });
    }

    getAll(){
        return this.http.get<ReporteJob[]>(this.ruta );
    }

    ajax(filtro:FiltroReporteJob):  Observable<Ajax<ReporteJob>>{
        return this.http.get<Ajax<ReporteJob>>(this.ruta, {
            params: AuxiliarFunction.toParams(filtro),
        });
    }

    public terminados():  Observable<Ajax<ReporteJob>>{
        return this.http.get<Ajax<ReporteJob>>([this.ruta,'terminados'].join('/'));
    }


    getById(id:number):Observable<HttpResponse<Blob>> {
        return this.http.get<Blob>([this.ruta,id].join('/'),{
                observe:'response',
                responseType:'blob' as 'json',
            });
    }

    delete(id:number) {
        return this.http.delete([this.ruta,id].join('/'));
    }

}