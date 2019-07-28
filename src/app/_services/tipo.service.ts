import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TipoContrato, TipoMesaDocente } from '../_models/tipo';
 
@Injectable()
export class TipoService {
    api:string = environment.apiUrl+'tipos';
    
    constructor(
        private http: HttpClient,
        ) { }

    contratos(){
        return this.http.get<TipoContrato[]>([this.api,'contratos'].join('/'));
    }

    mesas_docentes(){
        return this.http.get<TipoMesaDocente[]>([this.api,'docentes/mesas'].join('/'));
    }
}