import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from 'src/app/models/Evento';
import { take, map } from 'rxjs/operators';
import { environment } from '../../../ProEnventos-App/src/environments/environment'
@Injectable({
  providedIn: 'root'
})
export class EventoService {
baseURL = environment.apiURL +'api/Evento';
constructor(private http:HttpClient) { }

public getEvento(): Observable<Evento[]>{
 return this.http.get<Evento[]>(this.baseURL)
 .pipe(take(1));
}

public getEventoByTema(tema: string): Observable<Evento[]>{
  return this.http.get<Evento[]>(`${this.baseURL}/${tema}/tema`)
  .pipe(take(1));
 }

 public getEventoById(id: number): Observable<Evento>{
  return this.http.get<Evento>(`${this.baseURL}/${id}`)
  .pipe(take(1));
 }

 public postEvento(evento: Evento): Observable<Evento>{
  return this.http.post<Evento>(this.baseURL, evento)
  .pipe(take(1));
 }

 public putEvento(id: number, evento:Evento): Observable<Evento>{
  return this.http.put<Evento>(`${this.baseURL}/${id}`, evento)
  .pipe(take(1));
 }

 public deleteEvento(id: number): Observable<any>{
  return this.http.delete(`${this.baseURL}/${id}`)
  .pipe(take(1));
 }

 postUpload(eventoId: number, file: any): Observable<Evento> {
  const fileToUpload = file[0] as File;
  const formData = new FormData();
  formData.append('file', fileToUpload);

  return this.http
    .post<Evento>(`${this.baseURL}/upload-image/${eventoId}`, formData)
    .pipe(take(1));
}
}
