import { Component, OnInit } from '@angular/core';
import { AsistenciaService, FiltroAsistencia } from '../../_services/asistencia.service';
import { ComisionService } from '../../_services/comision.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Comision, ComisionHorario } from '../../_models/comision';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Asistencia } from '../../_models/asistencia';
import { CalendarEvent } from 'calendar-utils';
import { ComisionHorarioService, FiltroComisionHorario } from '../../_services/comision_horario.service';
import { Rule, Calendar, Schedule } from '@rschedule/rschedule';
import { AuxiliarFunction } from '../../_helpers/auxiliar.function';
import { StandardDateAdapter } from '@rschedule/standard-date-adapter';

@Component({
  selector: 'app-asistencia-nuevo',
  templateUrl: './asistencia-nuevo.component.html',
  styleUrls: ['./asistencia-nuevo.component.scss']
})
export class AsistenciaNuevoComponent implements OnInit {
  events: CalendarEvent[] = [];
  recurringEvents;

  comision:Comision;
  formulario: FormGroup;

  consultando = false;

  filtro=<FiltroAsistencia>{};
  filtroHorario=<FiltroComisionHorario>{};
  dataSource:Asistencia[];
  dataSourceHorarios:ComisionHorario[] = [];
  constructor(
    private comisionService:ComisionService,
    private asistenciaService:AsistenciaService,
    private horarioService:ComisionHorarioService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
    let hoy = moment();
    this.formulario = this.fb.group({
      fecha: [hoy.toDate(), Validators.required],
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params=>{
      let ids = params['id_comision'];
      this.filtro.id_comision = ids;
      this.filtroHorario.id_comision = ids;
      this.comisionService.getById(ids).subscribe(response=>{
        this.comision = response;

        this.asistenciaService.getAll(this.filtro).subscribe(asistencias=>{
          this.dataSource = asistencias;
          this.events = [];
          this.dataSource.forEach(asistencia=>{
            this.events.push({
              title:'Asistencia',
              start:moment(asistencia.fecha).toDate(),
              allDay:true,
            });
          });
  
          this.recurringEvents = null;
          this.horarioService.getAll(this.filtroHorario).subscribe(horarios=>{
            this.dataSourceHorarios = horarios;
            let clase_inicio = moment(this.comision.clase_inicio);
            if(!clase_inicio.isValid()){
              clase_inicio = moment().set({year:this.comision.anio}).startOf('year');
            }
            let clase_final = moment(this.comision.clase_final);
            if(!clase_final.isValid()){
              clase_final = moment().set({year:this.comision.anio}).endOf('year');
            }
            let rules = [];
            horarios.forEach(item=>{
              let week = AuxiliarFunction.IdDayToWeek(item.id_dia);
              let start = moment(item.hora_inicial,'HH:mm:ss');
              let duration = moment(item.hora_final,'HH:mm:ss').diff(start,'second');
              let inicio = clase_inicio.set({
                hour:start.get('hour'),
                minute:start.get('minute'),
              }).toDate();
              let final = clase_final.toDate();
              let rule = new Rule({
                frequency: 'WEEKLY',
                byDayOfWeek: [week],
                start: inicio,
                end: final,
                duration : duration,
              },{
                dateAdapter: StandardDateAdapter,
              });
              rules.push(rule);
            });
            this.recurringEvents = new Calendar({
              schedules: new Schedule({
                rrules: rules,
                dateAdapter: StandardDateAdapter,
              }),
              dateAdapter: StandardDateAdapter,
            });
          });
        });
      });
    });
  }

  get f(){
    return this.formulario.controls;
  }

  continuar(){
    if(!this.formulario.valid){
      return;
    }
    var item = <Asistencia>{};
    item.fecha = moment(this.f.fecha.value).format('YYYY-MM-DD');
    item.id_comision = this.comision.id;

    this.consultando = true;
    this.asistenciaService.register(item).subscribe(resposne=>{
      this.toastr.success('Asistencia generada', '');
      this.volver();
    },err=>{
      this.consultando = false;
    });
  }

  volver(){
    this.router.navigate(['/comisiones/'+this.comision.id+'/ver']);
  }

  recurring(){
    
  }

}
