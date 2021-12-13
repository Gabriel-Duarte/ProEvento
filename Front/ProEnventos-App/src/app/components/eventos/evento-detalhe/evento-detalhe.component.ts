import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AbstractControl } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { EventoService } from './../../../../services/Evento.service';
import { Evento } from './../../../models/Evento';
import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Lote } from '@app/models/Lote';
import { LoteService } from 'src/services/lote.service';
import { environment } from '../../../../environments/environment'
@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {
  form!: FormGroup;
  modalRef:BsModalRef | undefined;
  evento= {} as Evento;
  estadoSalvar='post';
  imagemURL= 'assets/img/upload.png'
  eventoId: any ;
 file: any | undefined;

  loteAtual = {id:0, nome:'', indice: 0};
  get f(): any{
    return this.form.controls;
  }
  get bsconfig(): any {
    return{
        adaptivePosition: true,
        dateInputFormat: 'DD/MM/YYYY hh:mm a',
        containerClass:'theme-default',
        showWeekNumbers: false

  };
}

get modoEditar():boolean {
  return this.estadoSalvar == 'put';
}
get lotes(): FormArray{
  return this.form.get('lotes') as FormArray;
}
  constructor(private fb: FormBuilder,
       private localeService: BsLocaleService,
       private Activaterouter: ActivatedRoute,
       private eventoService: EventoService,
       private spinner: NgxSpinnerService,
       private toastr: ToastrService,
       private router: Router,
       private modalService: BsModalService,
       private loteService: LoteService)
        {
          this.localeService.use('pt-br');
         }

  public carregarEvento(): void {

    this.eventoId = this.Activaterouter.snapshot.paramMap.get('id');

    if (this.eventoId !== null && this.eventoId !== 0) {
      this.spinner.show();
      this.estadoSalvar='put';
      this.eventoService.getEventoById(this.eventoId).subscribe(
        (evento : Evento) => {
          this.evento = {...evento};
          this.form.patchValue(this.evento);
          if(this.evento.imagemURL != ''){
            this.imagemURL= environment.apiURL + 'resources/images/' + this.evento.imagemURL;
          }
          this.evento.lotes.forEach(lote=>{this.lotes.push(this.criarLote(lote));
          });
        },
        (error: any)=> {
          this.spinner.hide();
          this.toastr.error('Erro ao tentar carregar evento','Erro!');
          console.error(error);
        },
        () => this.spinner.hide(),
      );
    }
  }
  ngOnInit() {
    this.carregarEvento();
    this.validation();
  }

public validation():void {
  this.form = this.fb.group({
     local :['', Validators.required],
    dataEvento: ['', Validators.required],
    tema :['', [Validators.required, Validators.minLength(4),Validators.maxLength(50)]],
    qtdPessoas :['', [Validators.required, Validators.max(120000)]],
    imagemURL :[''],
    telefone :['', Validators.required],
    email :['', [Validators.required, Validators.email]],
    lotes: this.fb.array([])
  });
}
 adicionarLote(): void{
  this.lotes.push(this.criarLote({id: 0} as Lote));
 }

 criarLote(lote:Lote):FormGroup{
   return this.fb.group({
      id :[lote.id],
      nome :[lote.nome, Validators.required],
      preco : [lote.quantidade, Validators.required],
      dataInicio: [lote.dataInicio, Validators.required],
      dataFim : [lote.dataFim, Validators.required],
      quantidade : [lote.quantidade, Validators.required]
   });
 }
public resetForm(): void{
  this.form.reset();
}

public cssValidator(campoForm: FormControl | AbstractControl| null): any {
 if(campoForm == null){
   return null
 }else return { 'is-invalid': campoForm.errors && campoForm.touched };
}

public mudarValorData(value:Date, indice:number, campo:string):void{
  this.lotes.value[indice][campo]=value;
}
public salvarEvento(): void {
  if(this.form.valid){
    this.spinner.show();

    if( this.estadoSalvar =='post'){
      this.evento= {... this.form.value}
      this.eventoService.postEvento(this.evento).subscribe(
        (eventoRetorno: Evento)=>{this.toastr.success('Evento salvo com Sucesso!', 'Sucesso');
        this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);},
        (error: any)=> {
          console.error(error);
          this.spinner.hide();
          this.toastr.error('Error ao salvar evento', 'Erro');
        },
        ()=> this.spinner.hide()
        );
    }else{
      this.evento= {id:this.evento.id, ... this.form.value}
      this.eventoService.putEvento(this.evento.id, this.evento).subscribe(
        () =>
          this.toastr.success('Evento salvo com Sucesso!', 'Sucesso'),
        (error: any)=> {
          console.error(error);
          this.spinner.hide();
          this.toastr.error('Error ao salvar evento', 'Erro');
        },
        ()=> this.spinner.hide()
        );
    }
  }
  }

  public retornaTituloLote(nome: string): string {
    return nome === null || nome === '' ? 'Nome do lote' : nome;
  }
public removerLote(template: TemplateRef<any>, indice: number): void{
  this.loteAtual.id = this.lotes.get(indice + '.id')?.value;
  this.loteAtual.nome = this.lotes.get(indice + '.nome')?.value;
  this.loteAtual.indice = indice;
  this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
}

  public salvarLotes(): void {
    this.spinner.show();
    if(this.form.controls.lotes.valid){
     this.loteService.saveLote(this.eventoId, this.form.value.lotes)
     .subscribe(
       ()=>
        this.toastr.success('Lotes salvo com Sucesso!', 'Sucesso'),
       (error:any)=> {
        console.error(error);
        this.toastr.error('Error ao salvar lotes', 'Erro');
       }
     ).add(()=> this.spinner.hide());
    }
  }
  confirmDeleteLote(): void{
    this.modalRef?.hide();
    this.spinner.show();
    this.loteService.deleteLote(this.eventoId, this.loteAtual.id)
    .subscribe(
      () => {
        this.toastr.success('Lote deletado com sucesso', 'Sucesso');
        this.lotes.removeAt(this.loteAtual.indice);
      },
      (error:any) => {
        this.toastr.error(`Erro ao tentar deletar o lote${this.loteAtual.id}`, 'Erro');
        console.error(error);
      }
    ).add(()=> this.spinner.hide());
  }


  declineDeleteLote(): void{
this.modalRef?.hide();
  }

  onFileChange(ev: any): void {
    const reader = new FileReader();

    reader.onload = (event: any) => this.imagemURL = event.target.result;

    this.file = ev.target.files;

      //reader.readAsDataURL(ev.target.files[0]);
      reader.readAsDataURL(this.file[0]);
      this.uploadImagem();
  }

  uploadImagem(): void {
    this.spinner.show();
    this.eventoService.postUpload(this.eventoId, this.file).subscribe(
      () => {
        this.carregarEvento();
        this.toastr.success('Imagem atualizada com Sucesso', 'Sucesso!');
      },
      (error: any) => {
        this.toastr.error('Erro ao fazer upload de imagem', 'Erro!');
      }
    ).add(() => this.spinner.hide());
  }
}



