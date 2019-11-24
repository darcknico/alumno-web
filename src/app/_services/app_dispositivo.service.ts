import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
import { UsuarioDispositivo } from '../_models/app';
import { Ajax } from '../_models/tipo';
 
export interface FiltroAppDispositivo {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
    id_usuario:number;
}
@Injectable()
export class AppDispositivoService {
    api:string = environment.apiUrl+'dispositivos';
    id_sede:number;
    constructor(
        private http: HttpClient,
        ) {
    }

    getAll(filtro?:FiltroAppDispositivo){
        return this.http.get<UsuarioDispositivo[]>(this.api, {
            params: AuxiliarFunction.toParams(filtro),
        } );
    }

    ajax(filtro:FiltroAppDispositivo):  Observable<Ajax<UsuarioDispositivo>>{
        return this.http.get<Ajax<UsuarioDispositivo>>(this.api, {
            params: AuxiliarFunction.toParams(filtro),
        });
    }
}