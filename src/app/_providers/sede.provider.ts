import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Sede } from '../_models/sede';
import { Subject } from 'rxjs';
import { UsuarioSede } from '../_models/usuario';

export const KEY_SEDE = 'sede';
export const KEY_ID_SEDE = 'sede';

@Injectable()
export class SedeProvider {

    sede$ = new Subject<UsuarioSede>();
    id_sede$ = new Subject<number>();
    api:string = environment.apiUrl;

    constructor(
        
        ) {
    }

    iniciar(){
        let id_sede = this.getIdSede();
        if(id_sede){
            this.id_sede$.next(id_sede);
        }
    }

    getIdSede():number{
        return Number(localStorage.getItem('id_sede'));
    }

    getSede():UsuarioSede{
        return JSON.parse(localStorage.getItem('sede'));
    }

    public setSede(sede:UsuarioSede){
        localStorage.setItem('sede',JSON.stringify(sede));
        localStorage.setItem('id_sede',String(sede.id_sede));
        this.sede$.next(sede);
        this.id_sede$.next(sede.id_sede);
    }
}