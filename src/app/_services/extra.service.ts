import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TipoDocumento } from '../_models/tipo_documento';
import { Provincia, Localidad } from '../_models/extra';
 
@Injectable()
export class ExtraService {
    api:string = environment.apiUrl;
    constructor(
        private http: HttpClient,
        ) { }
 
    tipo_documento(){
        return this.http.get<TipoDocumento[]>( this.api + 'documentos/tipos');
    }

    provincias(){
        return this.http.get<Provincia[]>( this.api + 'extras/provincias');
    }

    localidades(termino:string,id_provincia:number) {
        return this.http.get<Localidad[]>(this.api+'extras/localidades',{params:{
            termino:termino,
            id_provincia:String(id_provincia)
        }});
    }
}