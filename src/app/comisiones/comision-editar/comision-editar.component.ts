import { Component, OnInit, ViewChild } from '@angular/core';
import { Carrera } from '../../_models/carrera';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ComisionService } from '../../_services/comision.service';
import { CarreraService } from '../../_services/carrera.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MateriaService } from '../../_services/materia.service';
import { Materia } from '../../_models/materia';
import * as moment from 'moment';
import { UsuarioService } from '../../_services/usuario.service';
import { Usuario, Docente, DocenteMateria } from '../../_models/usuario';
import { Comision } from '../../_models/comision';
import { ModalidadService } from '../../_services/modalidad.service';
import { Modalidad } from '../../_models/modalidad';
import { PlanEstudio } from '../../_models/plan_estudio';
import { PlanService } from '../../_services/plan.service';
import { DocenteService, FiltroDocente } from '../../_services/docente.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DocenteMateriaService, FiltroDocenteMateria } from '../../_services/docente_materia.service';

@Component({
  selector: 'app-comision-editar',
  templateUrl: './comision-editar.component.html',
  styleUrls: ['./comision-editar.component.scss']
})
export class ComisionEditarComponent implements OnInit {
  @ViewChild('docentesSelect',{static:false})docentesSelect: NgSelectComponent;
  id_carrera:number;

  titulo:string;
  id:number = 0;
  id_sede:number;
  carreras:Carrera[] = [];
  planes_estudio:PlanEstudio[] = [];
  materias:Materia[] = [];
  usuarios:Usuario[] = [];
  docentes:Docente[] = [];
  recomendaciones:DocenteMateria[]=[];
  modalidades:Modalidad[] = [];
  usuario:Usuario = null;
  usuario_seleccionado = false;
  usuario_cambiar = true;
  formulario: FormGroup;

  consultando = false;
  materia:Materia = null;
  carrera:Carrera = null;
  maxYear;
  constructor(
    private comisionService:ComisionService,
    private carreraService:CarreraService,
    private planService:PlanService,
    private materiaService:MateriaService,
    private usuarioService:UsuarioService,
    private docenteService:DocenteService,
    private modalidadService:ModalidadService,
    private docenteMateriaService:DocenteMateriaService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) { 
    let hoy = moment();
    this.maxYear = moment().year() + 20;
    this.formulario = this.fb.group({
      anio: [hoy.get('year'), [Validators.required,Validators.min(1976),Validators.max(this.maxYear)]],
      numero: [1, [Validators.required,Validators.min(1)]],
      id_carrera:'',
      id_plan_estudio:'',
      id_materia: ['', Validators.required],
      id_modalidad: [null, Validators.required],
      docentes:null,
      responsable_nombre: ['', Validators.required],
      responsable_apellido: ['', Validators.required],
      clase_inicio:null,
      clase_final:null,
      asistencia:false,
    });
  }

  ngOnInit() {
    this.id_sede = +localStorage.getItem('id_sede');
    this.comisionService.sede(this.id_sede);
    this.carreraService.getAll().subscribe(response => {
      this.carreras = response;

      this.route.queryParams.subscribe(query=>{
        let id_carrera = query['id_carrera'];
        if(id_carrera){
          this.f.id_carrera.setValue(+id_carrera);
          setTimeout(()=>{
            let car = this.carreras.find(item=>item.id == +id_carrera);
            if(car.id_plan_estudio){
              this.planService.carrera(car.id);
              this.f.id_plan_estudio.setValue(car.id_plan_estudio);
              this.planService.getAll().subscribe(response=>{
                this.planes_estudio=response
              });
              this.materiaService.planEstudio(car.id_plan_estudio).subscribe(response=>{
                this.materias = response;
                if(this.materias.length == 0){
                  this.f.id_materia.disable();
                }
              });
            }
          });
        } else {
          let id_materia = query['id_materia'];
          if(id_materia){
            this.materiaService.getById(id_materia).subscribe(materia=>{
              this.materia = materia;
              this.f.id_carrera.setValue(materia.plan_estudio.id_carrera);
              this.f.id_plan_estudio.setValue(materia.id_plan_estudio);
              this.planService.carrera(materia.plan_estudio.id_carrera);
              this.planService.getAll().subscribe(response=>{
                this.planes_estudio=response
              });
              this.f.id_materia.setValue(materia.plan_estudio.id);
              this.f.id_materia.setValue(materia.id);
              this.materiaService.planEstudio(materia.id_plan_estudio).subscribe(response=>{
                this.materias = response;
              });
            });
          }
        }
      });
    });
    this.usuarioService.getAll().subscribe(response=>{
      let item = <Usuario>{};
      item.email = 'Ninguno';
      item.id = 0;
      this.usuarios = response;
      this.usuarios.push(item);
      this.usuarios = this.usuarios.reverse();
    });
    this.docenteService.getAll(<FiltroDocente>{
      id_sede:this.id_sede,
      estado:null,
    }).subscribe(response=>{
      this.docentes = response;
    });
    this.route.params.subscribe(params=>{
      let ids = params['id_comision'];
      if(ids==null){
        this.id = 0;
      } else {
        this.id = +ids;
      }
      this.iniciar();
    });
    this.modalidadService.getAll().subscribe(response=>{
      this.modalidades = response;
    });
  }


  iniciar(){
    if(this.id==0){
      this.titulo="Comision nueva";
    } else {
      this.titulo="Comision editar";
      this.comisionService.getById(this.id).subscribe(response=>{
        this.f.anio.setValue(response.anio);
        this.f.numero.setValue(response.numero);
        this.f.responsable_nombre.setValue(response.responsable_nombre);
        this.f.responsable_apellido.setValue(response.responsable_apellido);
        this.f.id_modalidad.setValue(response.id_modalidad);
        this.f.id_materia.setValue(response.id_materia);
        this.f.asistencia.setValue(response.asistencia);
        let clase_inicio = moment(response.clase_inicio);
        if(clase_inicio.isValid()){
          this.f.clase_inicio.setValue(clase_inicio.toDate());
        }
        let clase_final = moment(response.clase_final);
        if(clase_final.isValid()){
          this.f.clase_final.setValue(clase_final.toDate());
        }
        if(response.id_usuario>0){
          this.usuario_seleccionado = true;
          this.usuario = response.responsable;
        } else {
          this.usuario_seleccionado = true;
        }
        this.materia = response.materia;
        this.carrera = response.carrera;
        this.usuario_cambiar = false;

        let docentes = [];
        this.comisionService.docentes(this.id).subscribe(response=>{
          response.forEach(item=>{
            docentes.push(item.docente);
          });
          this.f.docentes.setValue(docentes);
        });

        let filtro = <FiltroDocenteMateria>{};
        filtro.id_sede = this.id_sede;
        filtro.id_materia = response.id_materia;
        this.docenteMateriaService.getAll(filtro).subscribe(response=>{
          this.recomendaciones = response;
          docentes.forEach(docente=>{
            this.recomendaciones.forEach(item=>{
              if(item.id_usuario == docente.id_usuario){
                item.estado = false;
              }
              return item;
            });
          });
        });
      });
    }
  }

  get f(){
    return this.formulario.controls;
  }

  continuar(){
    if(!this.formulario.valid){
      return;
    }
    var item = <Comision>{};
    item.id = this.id;
    item.anio = this.f.anio.value;
    item.numero = this.f.numero.value;
    item.id_materia = this.f.id_materia.value;
    if(this.usuario){
      item.id_usuario = this.usuario.id;
    } else {
      item.id_usuario = 0;
    }
    item.responsable_nombre = this.f.responsable_nombre.value;
    item.responsable_apellido = this.f.responsable_apellido.value;
    item.id_modalidad = this.f.id_modalidad.value;
    item.docentes = this.f.docentes.value;
    item.asistencia = this.f.asistencia.value;
    let clase_inicio = moment(this.f.clase_inicio.value);
    if(clase_inicio.isValid()){
      item.clase_inicio = clase_inicio.format('YYYY-MM-DD');
    }
    let clase_final = moment(this.f.clase_final.value);
    if(clase_final.isValid()){
      item.clase_final = clase_final.format('YYYY-MM-DD');
    }

    this.consultando = true;
    if(item.id>0){
      this.comisionService.update(item).subscribe(resposne=>{
        this.toastr.success('Comision modificada', '');
        this.volver();
      },err=>{
        this.consultando = false;
      });
    } else {
      this.comisionService.register(item).subscribe(resposne=>{
        this.toastr.success('Comision agregada', '');
        this.volver();
      },err=>{
        this.consultando = false;
      });
    }
  }

  seleccionar_carrera(carrera:Carrera){
    this.f.id_materia.setValue('');
    this.f.id_plan_estudio.setValue(carrera.id_plan_estudio);
    this.materias = [];
    this.planService.carrera(carrera.id);
    this.planService.getAll().subscribe(response=>{
      this.planes_estudio = response;
    });
    if(carrera.id_plan_estudio){
      this.materiaService.planEstudio(carrera.id_plan_estudio).subscribe(response=>{
        this.materias = response;
        if(this.materias.length == 0){
          this.f.id_materia.disable();
        } else {
          this.f.id_materia.enable();
        }
      });
    }
  }

  seleccionar_plan_estudio(plan:PlanEstudio){
    this.f.id_materia.setValue('');
    this.materiaService.planEstudio(plan.id).subscribe(response=>{
      this.materias = response;
      if(this.materias.length == 0){
        this.f.id_materia.disable();
      } else {
        this.f.id_materia.enable();
      }
    });
  }
  seleccionar_materia(materia:Materia){
    this.recomendaciones = [];
    let filtro = <FiltroDocenteMateria>{};
    filtro.id_sede = this.id_sede;
    filtro.id_materia = materia.id;
    this.docenteMateriaService.getAll(filtro).subscribe(response=>{
      this.recomendaciones = response;
    });
  }

  seleccionar_usuario(usuario:Usuario){
    if(usuario.id>0){
      this.f.responsable_nombre.setValue(usuario.nombre);
      this.f.responsable_apellido.setValue(usuario.apellido);
      this.usuario_seleccionado = true;
    } else {
      this.f.responsable_nombre.setValue('');
      this.f.responsable_apellido.setValue('');
      this.usuario_seleccionado = false;
    }
    this.usuario = usuario;
  }

  seleccionar_docente(item:DocenteMateria){
    item.estado = false;
    let docentes:Docente[] = this.f.docentes.value;
    if(!docentes){
      docentes = [];
    }
    let existe = docentes.find(docente=>{
      return docente.id_usuario==item.id_usuario;
    });
    if(!existe){
      docentes.push(item.docente);
    }
    this.f.docentes.setValue(docentes);
  }

  compararDocente(a: Docente, b: Docente){
    return a.id_usuario == b.id_usuario;
  }

  buscarDocente(term: string, item: Docente){
    term = term.toUpperCase();
    let apellido = item.usuario.apellido.toUpperCase().indexOf(term) !== -1;
    let nombre = item.usuario.nombre.toUpperCase().indexOf(term) !== -1;
    let resultado = String(item.cuit).startsWith(term) || apellido || nombre;
    return resultado;
  }

  docenteRemovido(any){
    this.recomendaciones.forEach(docente=>{
      if(docente.id_usuario == any.value.id_usuario){
        docente.estado = true;
      }
      return docente;
    });
  }
  docenteAgregado(item:Docente){
    this.recomendaciones.forEach(docente=>{
      if(docente.id_usuario == item.id_usuario){
        docente.estado = false;
      }
      return docente;
    });
  }

  cambiar_usuario(){
    this.usuario_cambiar =true;
  }

  volver(){
    this.router.navigate(['/comisiones']);
  }

  gestionar(){
    this.router.navigate(['/comisiones/'+this.id+'/ver']);
  }

}
