import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Diaria } from '../_models/diaria';

export interface FiltroDiaria {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
}
export interface DiariaAjax{
    items: Diaria[];
    total_count: number;
}

@Injectable()
export class DiariaService {
    api:string = environment.apiUrl+'sedes';
    resource:string = 'diarias';
    id_sede:number;
    constructor(
        private http: HttpClient,
        ) { 
    }
 

    sede(id_sede:number){
        this.id_sede = id_sede;
    }

    getAll(){
        return this.http.get<Diaria[]>([this.api,this.id_sede,this.resource].join('/'));
    }

    ajax(filtro:FiltroDiaria):  Observable<DiariaAjax>{
        return this.http.get<DiariaAjax>([this.api,this.id_sede,this.resource].join('/'), {
            params: {
                search: filtro.search,
                sort: filtro.sort,
                order: filtro.order,
                start: String(filtro.start),
                length: String(filtro.length),
            }
        });
    }

    getById(id:number) {
        return this.http.get<Diaria>([this.api,this.id_sede,this.resource,id].join('/'));
    }

    ultimos(){
        return this.http.get<Diaria>([this.api,this.id_sede,this.resource,'ultimos'].join('/'));
    }

    siguiente(id:number){
        return this.http.get<{
            sig:Diaria,
            last:Diaria,
        }>([this.api,this.id_sede,this.resource,id,'siguiente'].join('/'));
    }

    anterior(id:number){
        return this.http.get<{
            sig:Diaria,
            last:Diaria,
        }>([this.api,this.id_sede,this.resource,id,'anterior'].join('/'));
    }

    exportar(id:number) {
        return this.http.get([this.api,this.id_sede,this.resource,id,'exportar'].join('/'),{responseType: 'blob'});
    }

}