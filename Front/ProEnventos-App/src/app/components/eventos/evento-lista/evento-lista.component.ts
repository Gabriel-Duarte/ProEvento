import { Router } from '@angular/router';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/services/Evento.service';
import { environment } from '../../../../environments/environment'
@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {
  modalRef?: BsModalRef;
  public eventos:Evento[] = [];
  public eventosfiltrados: Evento[] = [];
  larguraImagem =150
  margemImagem = 2;
  exibirImagem = true;
  private filtroListado = '';
  public eventoId= 0;


  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
    ) { }

    public get filtroLista(){
      return this.filtroListado;
    }
    ngOnInit(): void {
        this.spinner.show();
       this.carregarEventos();
    }

    public set filtroLista(value: string){
      this.filtroListado =value;
      this.eventos = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
    }

    public filtrarEventos(filtrarPor: string): Evento[] {
      filtrarPor = filtrarPor.toLocaleLowerCase();
      return this.eventos.filter(
        (    evento: { tema: string; local: string; })=> evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 || evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1  )
    }

    public alterarImagem(){
      this.exibirImagem = !this.exibirImagem;
    }
  public carregarEventos(): void {
  this.eventoService.getEvento().subscribe({
    next: (eventos: Evento[]) => {
      this.eventos = eventos;
      this.eventosfiltrados = this.eventos;
    },
    error: (error:any) =>{
      this.spinner.hide();
      this.toastr.error('Erro ao carregar Eventos', 'Erro!');
    },
    complete:()=> this.spinner.hide()
  });
  }

  openModal(event: any, template: TemplateRef<any>, eventoId: number): void {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.modalRef?.hide();
    this.spinner.hide();
    this.eventoService.deleteEvento(this.eventoId).subscribe(
      (result: any)=>{
      if(result.menssage == 'Deletado'){
          this.toastr.success('O Evento foi deletado com Sucesso!', 'Deletado!');
          this.carregarEventos();
      }
      },
    (error: any) => {
      this.toastr.error(`Erro ao tentar deletar o evento ${this.eventoId}`, 'Erro');
      console.error(error);
    }
    ).add(()=> this.spinner.hide());
  }
public mostrarImagem(imagemURL: string): string {
  return imagemURL != ''
    ? `${environment.apiURL}resources/images/${imagemURL}`
    : 'assets/img/semImagem.png'

}
  decline(): void {
    this.modalRef?.hide();
  }
  detalheEvento(id: number): void{
    this.router.navigate([`eventos/detalhe/${id}`]);
  }

  }
