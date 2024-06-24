import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { LoginRequest, RegisterRequest, UserResponse } from '../interfaces/user.interface';
import { Task } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly BASE_URL = environment.BASE_URL

  constructor(private httpClient: HttpClient) { }
  
  login(request: LoginRequest){
    return this.httpClient.post<UserResponse>(`${this.BASE_URL}/users/login`, request)
  }
  
  register(request: RegisterRequest){
    return this.httpClient.post<UserResponse>(`${this.BASE_URL}/users`, request)
  } 

  createTask(request: Task, token: string){
    const headers = new HttpHeaders({
      'X-CSRF-Token': token,
      'Content-Type': 'application/json'
    });
    return this.httpClient.post<Task>(`${this.BASE_URL}/tasks`,request,{headers})
  }

  allTasks(token: string){
    const headers = new HttpHeaders({
      'X-CSRF-Token': token,
      'Content-Type': 'application/json'
    });
    return this.httpClient.get<Task[]>(`${this.BASE_URL}/tasks`,{headers})
  }

  userTasks(id: number,token: string){
    const headers = new HttpHeaders({
      'X-CSRF-Token': token,
      'Content-Type': 'application/json'
    });
    return this.httpClient.get<Task[]>(`${this.BASE_URL}/tasks/${id}`,{headers})
  }

  updateTask(task: Task, token: string){
    const headers = new HttpHeaders({
      'X-CSRF-Token': token,
      'Content-Type': 'application/json'
    });
    return this.httpClient.put<Task>(`${this.BASE_URL}/tasks`,task,{headers})
  }

  deleteTask(id: number, token: string){
    const headers = new HttpHeaders({
      'X-CSRF-Token': token,
      'Content-Type': 'application/json'
    });
    return this.httpClient.delete<Task>(`${this.BASE_URL}/tasks/${id}`,{headers})
   }
}
