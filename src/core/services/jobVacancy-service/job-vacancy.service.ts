import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class JobVacancyService {
  constructor(private http:HttpClient) { }


  postAnswerAssignment(obj:any):Observable<any>{
    return this.http.post(environment.api_url+'postVacancies',obj)
  }
  getAnswerAssignment():Observable<any>{
    return this.http.get<any>(environment.api_url+'getVacancies')
  }
  delVacancyList(id:string):Observable<any>{
    return this.http.delete<any>(environment.api_url+(`vacancies/${id}`))
  }
  getVacancyById(id:string):Observable<any>{
    return this.http.get<any>(environment.api_url+(`vacancies/${id}`))
  }
  updateVacancy(id:string,obj:any):Observable<any>{
    return this.http.put<any>(environment.api_url+(`vacancies/${id}`),obj)
  }
}
