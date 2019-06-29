import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TipoTramite } from '../_models/tramite';

@Injectable()
export class TramiteService {
    api:string = environment.apiUrl+'sedes';
    resource:string = 'tramites';
    id_sede:number;
    constructor(
        private http: HttpClient,
        ) { }

    sede(id){
        this.id_sede = id;
    }

    register(item){
        return this.http.post([this.api,this.id_sede,this.resource].join('/'),item);
    }
    
    tipos() {
        return this.http.get<TipoTramite[]>(environment.apiUrl+ 'tramites/tipos');
    }
}