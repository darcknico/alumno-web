import { Injectable } from '@angular/core';
import Echo from "laravel-echo";
import Pusher, { Channel } from "pusher-js";
import { environment } from '../../environments/environment';
import { SedeProvider } from './sede.provider';
import { AuthenticationService } from '../_services/authentication.service';
import { Inscripcion } from '../_models/inscripcion';
import { ToastrService } from 'ngx-toastr';

export const LISTENER_VENDEDORES = 'EnviarPosicion';
@Injectable()
export class PusherProvider {
    pusher: Pusher;
    api:string = environment.apiUrl;
    id_sede:number;
    canalInscripciones:Channel;

    constructor(
        private sede: SedeProvider,
        private authenticationService: AuthenticationService,
        private toastr: ToastrService,
        ) { 
        this.pusher = new Pusher(environment.pusher.key, {
            cluster: environment.pusher.cluster,
            encrypted: true,
            authEndpoint:this.api+'broadcasting/auth',
            authTransport:'ajax',
            auth:{
                params:{},
                headers:{
                    Authorization: this.authenticationService.getToken(),
                }
            }
        });
        this.authenticationService.token$.subscribe()
        this.id_sede = this.sede.getIdSede();
        this.sede.id_sede$.subscribe(id=>{
            
            if(id){
                if(this.pusher && this.id_sede && this.id_sede != id){
                    this.pusher.unbind_all();
                    this.id_sede = id;
                    this.escucharInscripcionAlumno();
                } else {
                    this.id_sede = id;
                }
            }
        });
    }

    async iniciar(){
        this.escucharInscripcionAlumno();
        this.authenticationService.token$.subscribe(token=>{
            if(token && this.pusher){
                this.pusher.unbind_all();
                this.pusher = new Pusher(environment.pusher.key, {
                    cluster: environment.pusher.cluster,
                    encrypted: true,
                    authEndpoint:this.api+'broadcasting/auth',
                    authTransport:'ajax',
                    auth:{
                        params:{},
                        headers:{
                            Authorization: this.authenticationService.getToken(),
                        }
                    }
                });
            } else {
                if(token){
                    this.pusher = new Pusher(environment.pusher.key, {
                        cluster: environment.pusher.cluster,
                        encrypted: true,
                        authEndpoint:this.api+'broadcasting/auth',
                        authTransport:'ajax',
                        auth:{
                            params:{},
                            headers:{
                                Authorization: this.authenticationService.getToken(),
                            }
                        }
                    });
                } else {
                    if(this.pusher){
                        this.pusher.unbind_all();
                    }
                }
            }
        });
    }

    
    escucharInscripcionAlumno(){
        if(!this.canalInscripciones){
            this.canalInscripciones = this.pusher.subscribe('private-sedes.'+this.id_sede);
            this.canalInscripciones.bind('inscripcion.alumno',event=>{
                this.onInscripcionAlumno(event.inscripcion);
            });
        } else {
            if(this.canalInscripciones.subscribed){
                this.canalInscripciones.unsubscribe();
                this.canalInscripciones = this.pusher.subscribe('private-sedes.'+this.id_sede);
                this.canalInscripciones.bind('inscripcion.alumno',event=>{
                    this.onInscripcionAlumno(event.inscripcion);
                });
            }
        }
    }

    private onInscripcionAlumno(inscripcion:Inscripcion){
        let alumno = inscripcion.alumno.apellido + ' ' + inscripcion.alumno.nombre;
        let carrera = inscripcion.carrera.nombre;
        this.toastr.success('Para el alumno '+alumno+' en la carrera '+carrera+'.','Nueva Inscripcion realizada')
    }

    suscribirCanal(channelName: string, events: string[], cb: Function) {
        var channel = this.pusher.subscribe(channelName);

        events.forEach( event => {
            channel.bind(event, function(data) {
                cb(data)
            });
        })
    }
    
}