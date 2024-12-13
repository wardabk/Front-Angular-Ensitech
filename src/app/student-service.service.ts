import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { StudentInterface } from './student-interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentServiceService {

  constructor(private httpClient: HttpClient) { }
  getById(id: number): Observable<StudentInterface> {
    return this.httpClient.get<StudentInterface>(`http://localhost:3000/student/${id}`);
  }

  getAll(){
    return this.httpClient.get<StudentInterface[]>("http://localhost:3000/student")
  }

  create(data: StudentInterface){
    return this.httpClient.post("http://localhost:3000/student", data)
  }

  update(data: StudentInterface): Observable<StudentInterface> {
    return this.httpClient.put<StudentInterface>(`http://localhost:3000/student/${data.id}`, data);
  }
  

  // update(data: StudentInterface): Observable<StudentInterface> {
  //   return this.httpClient.put<StudentInterface>(`http://localhost:3000/student/${data.id}`, data);
  // }

  // delete(id: number){
  //   return this.httpClient.delete<StudentServiceService>(`http://localhost:3000/student/${id}`)
  // }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`http://localhost:3000/student/${id}`);
  }
}
