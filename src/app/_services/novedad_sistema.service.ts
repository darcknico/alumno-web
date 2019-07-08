import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
import { SedeService } from './sede.service';
import { Ajax } from '../_models/tipo';
import { NovedadSistema, NovedadUsuario } from '../_models/novedad';

export interface FiltroNovedadSistema{
    search:string;
    sort:string;
    order:string;
    page:number;
    length:number;
}


@Injectable()
export class NovedadSistemaService {

    api:string = environment.apiUrl+'sedes';
    resource:string='novedades/sistemas';
    id_sede:number;

    constructor(
        private sede:SedeService,
        private http: HttpClient,
        ) {
        this.id_sede = this.sede.getIdSede();
        this.sede.id_sede$.subscribe(id=>{
            this.id_sede = id;
        });
    }

    get url(){
        return [this.api,this.id_sede,this.resource].join('/');
    }

    getAll() {
        return this.http.get<NovedadSistema[]>( [this.url].join('/') );
    }

    ajax(filtro:FiltroNovedadSistema) {
        return this.http.get<Ajax<NovedadSistema>>( [this.url].join('/'),{
            params: AuxiliarFunction.toParams(filtro),
        });
    }
 
    getById(id: number) {
        return this.http.get<NovedadSistema>([this.url,id].join('/'));
    }
 
    register(item: NovedadSistema) {
        return this.http.post<NovedadSistema>([this.url].join('/'), item);
    }
 
    update(item: NovedadSistema) {
        return this.http.put<NovedadSistema>([this.url,item.id].join('/'), item);
    }
 
    delete(id: number) {
        return this.http.delete([this.url,id].join('/'));
    }

    mostrar(item: NovedadSistema){
        return this.http.post<NovedadSistema>([this.url,item.id].join('/'), item);
    }

    usuarios(id: number){
        return this.http.get<NovedadUsuario[]>([this.url,id].join('/'));
    }

}