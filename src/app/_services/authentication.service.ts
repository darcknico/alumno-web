import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Usuario } from '../_models/usuario';
import { Subject } from 'rxjs';
 
@Injectable()
export class AuthenticationService {
    key_token:string = environment.key_token;
    api:string = environment.apiUrl;
    usuario$ = new Subject<Usuario>();
    token$ = new Subject<string>();
    constructor(
        private http: HttpClient,
        ) { }
 
    login(email: string, password: string) {
        return this.http.post<any>(this.api+'login', { email: email, password: password })
            .pipe(map(user => {
                if (user && user.token) {
                    this.setToken(user.token);
                    localStorage.setItem('usuario', JSON.stringify(user));
                    this.usuario$.next(user);
                    this.token$.next(user.token);
                }
                return user;
            }));
    }

    register(usuario:Usuario){
        return this.http.post<any>(this.api+'register',usuario)
            .pipe(map(user => {
                if (user && user.token) {
                    this.setToken(user.token);
                    localStorage.setItem('usuario', JSON.stringify(user));
                    this.usuario$.next(user);
                }
                return user;
            }));
    }
    update(item: Usuario) {
        return this.http.put<Usuario>(this.api+'usuario', item).pipe(map(user=>{
            this.actualizar();
        }));
    }

    cambiar_contraseña(item:Usuario){
        return this.http.post<any>(this.api+'usuario/password',item)
            .pipe(map(user => {
                if (user && user.token) {
                    this.setToken(user.token);
                    this.actualizar();
                }
                return user;
            }));
    }

 
    logout() {
        return this.http.post<any>(this.api+'logout', {})
            .pipe(map(user => {
                localStorage.removeItem(this.key_token);
                localStorage.removeItem('usuario');
                localStorage.removeItem('sede');
                this.token$.next(null);
            }));
            
    }

    localUsuario(){
        return JSON.parse(localStorage.getItem('usuario'));
    }

    actualizar(){
        return this.http.get(this.api+'detalle').toPromise().then((response:Usuario)=>{
            this.usuario$.next(response);
            localStorage.setItem('usuario', JSON.stringify(response));
        });
    }

    detalle(){
        return this.http.get<Usuario>(this.api+'detalle');
    }

    isAuthenticated():boolean{
        return Boolean(localStorage.getItem(this.key_token));
    }

    getToken(){
        return 'Bearer '+localStorage.getItem(this.key_token);
    }

    iniciar(){
        let token = localStorage.getItem(this.key_token);
        this.token$.next(token);
    }

    private setToken(token){
        localStorage.setItem(this.key_token, token);
    }
}