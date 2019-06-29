import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Usuario, TipoUsuario, UsuarioSede, UsuarioArchivo } from '../_models/usuario';
import { Observable } from 'rxjs';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
 
export interface FiltroUsuario {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
    id_sede:number;
    id_tipo_usuario:number;
}
export interface UsuarioAjax{
    items: Usuario[];
    total_count: number;
}
@Injectable()
export class UsuarioService {
    api:string = environment.apiUrl+'usuario/';
    apis:string = environment.apiUrl+'usuarios/';
    constructor(
        private http: HttpClient,
        ) { }
 
    get() {
        return this.http.get<Usuario>(this.api);
    }
 
    tipos(){
        return this.http.get<TipoUsuario[]>( this.api + 'tipos');
    }

    /**
     * Deprecated
     * @param id_sede 
     */
    sede_seleccionar(id_sede:number){
        return this.http.get<UsuarioSede>(this.api+'sedes/'+id_sede);
    }

    //ADMINISTRADOR

    getAll(){
        return this.http.get<Usuario[]>(this.apis);
    }

    ajax(filtro:FiltroUsuario):  Observable<UsuarioAjax>{
        return this.http.get<UsuarioAjax>(this.apis, {
            params: AuxiliarFunction.toParams(filtro),
        });
    }

    register(item:Usuario){
        return this.http.post<Usuario>(this.apis,item);
    }

    getById(id:number) {
        return this.http.get<Usuario>(this.apis+id);
    }
    
    update(item:Usuario){
        return this.http.put<Usuario>(this.apis+item.id,item);
    }

    password(item:Usuario){
        return this.http.put<Usuario>(this.apis+item.id+'/password',item);
    }

    delete(id:number) {
        return this.http.delete(this.apis+id);
    }

    desbloquear(id:number) {
        return this.http.get(this.apis+id+'/desbloquear');
    }

    coincidencia(email:string){
        return this.http.get(environment.apiUrl+'email',{params: {
            email: email,
        }});
    }

    sede_asociar(item:UsuarioSede){
        return this.http.post<UsuarioSede>(this.apis+item.id_usuario+'/sedes/'+item.id_sede,item);
    }

    sede_desasociar(item:UsuarioSede){
        return this.http.delete<UsuarioSede>(this.apis+item.id_usuario+'/sedes/'+item.id_sede);
    }

    archivos(id_usuario){
        return this.http.get<UsuarioArchivo[]>(this.apis +id_usuario+'/archivos');
    }

    archivoAlta(id_usuario:number,archivo){
        let input = new FormData();
        input.append('archivo', archivo);
        return this.http.post<UsuarioArchivo>(this.apis +id_usuario+'/archivos', input);
    }

    archivo(archivo:UsuarioArchivo){
        return this.http.get(this.apis +archivo.id_usuario+'/archivos/'+archivo.id,{responseType: 'blob'});
    }

    archivoBaja(archivo:UsuarioArchivo){
        return this.http.delete(this.apis + archivo.id_usuario+'/archivos/'+archivo.id);
    }
}