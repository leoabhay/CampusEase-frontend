import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ModelQuestionService {
  private baseUrl = environment.api_url;
  constructor(private http:HttpClient) { }


  postModelQuestion(obj:any):Observable<any>{
    return this.http.post(environment.api_url+'submit-model-question',obj)
  }
  getModelQuestion():Observable<any>{
    return this.http.get<any>(environment.api_url+'model-questions')
  }
  getQuestionsByEnrolledSubjectAPI():Observable<any>{
    return this.http.get<any>(environment.api_url+'getQuestionsByEnrolledSubject')
  }
  updateModelQuestion(id: string, formData: FormData): Observable<any> {
  return this.http.put<any>(environment.api_url + `model-questions/${id}`, formData);
}
  deleteModelQuestion(id:string):Observable<any>{
    return this.http.delete<any>(environment.api_url+(`model-questions/${id}`))
  }
}
