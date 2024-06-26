import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import {
  LoginRequest,
  RegisterRequest,
  UserResponse,
} from "../interfaces/user.interface";
import { CreateTask, Task } from "../interfaces/task.interface";
import { Subject, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DataService {
  private readonly BASE_URL = environment.BASE_URL;
  private taskCreatedSubject = new Subject<void>();
  private taskUpdatedSubject = new Subject<void>();
  private taskDeletedSubject = new Subject<void>();
  private usersSubject = new Subject<UserResponse[]>();
  private userByIdSubject = new Subject<UserResponse>();
  private deleteUserSubject = new Subject<void>();
  private updateUserSubject = new Subject<void>();


  constructor(private httpClient: HttpClient) {}

  login(request: LoginRequest) {
    return this.httpClient.post<UserResponse>(
      `${this.BASE_URL}/users/login`,
      request
    );
  }

  register(request: RegisterRequest) {
    return this.httpClient.post<UserResponse>(
      `${this.BASE_URL}/users`,
      request
    );
  }

  createTask(request: CreateTask, token: string) {
    const formData = new FormData();
    formData.append("description", request.description);
    formData.append("status", request.status);
    formData.append("user.id", request.user.id.toString());

    if (request.imageFile) {
      formData.append("imageFile", request.imageFile, request.imageFile.name);
    }

    const headers = new HttpHeaders({
      "X-CSRF-Token": token,
    });

    return this.httpClient
      .post<Task>(`${this.BASE_URL}/tasks`, formData, { headers })
      .pipe(
        tap(() => {
          this.taskCreatedSubject.next();
        })
      );
  }

  getTaskCreatedObservable() {
    return this.taskCreatedSubject.asObservable();
  }

  allTasks(token: string) {
    const headers = new HttpHeaders({
      "X-CSRF-Token": token,
      "Content-Type": "application/json",
    });
    return this.httpClient.get<Task[]>(`${this.BASE_URL}/tasks`, { headers });
  }

  userTasks(id: number, token: string) {
    const headers = new HttpHeaders({
      "X-CSRF-Token": token,
      "Content-Type": "application/json",
    });
    return this.httpClient.get<Task[]>(`${this.BASE_URL}/tasks/${id}`, {
      headers,
    });
  }

  updateTask(task: Task, token: string) {
    const formData = new FormData();
    formData.append("description", task.description);
    formData.append("status", task.status);
    formData.append("user.id", task.user.id.toString());

    if (task.imageFile) {
      formData.append("imageFile", task.imageFile, task.imageFile.name);
    }
    if (task.id !== undefined) {
      formData.append("id", task.id.toString());
    }

    const headers = new HttpHeaders({
      "X-CSRF-Token": token,
    });

    return this.httpClient
      .put<Task>(`${this.BASE_URL}/tasks`, formData, { headers })
      .pipe(
        tap(() => {
          this.taskUpdatedSubject.next();
        })
      );
  }

  getTaskUpdatedObservable() {
    return this.taskUpdatedSubject.asObservable();
  }
  deleteTask(id: number, token: string) {
    const headers = new HttpHeaders({
      "X-CSRF-Token": token,
      "Content-Type": "application/json",
    });
    return this.httpClient.delete<Task>(`${this.BASE_URL}/tasks/${id}`, {
      headers,
    }).pipe(
      tap(() => {
        this.taskDeletedSubject.next();
      })
    );
  }
  getTaskDeletedObservable() {
    return this.taskDeletedSubject.asObservable();
  }

  getAllUsers(token: string) {
    const headers = new HttpHeaders({
      "X-CSRF-Token": token,
      "Content-Type": "application/json",
    });

    return this.httpClient.get<UserResponse[]>(`${this.BASE_URL}/users`, { headers }).pipe(
      tap((users) => {
        this.usersSubject.next(users);
      })
    );
  }

  getUsersObservable() {
    return this.usersSubject.asObservable();
  }

  getUserById(token: string, userId: number) {
    const headers = new HttpHeaders({
      "X-CSRF-Token": token,
      "Content-Type": "application/json",
    });

    return this.httpClient.get<UserResponse>(`${this.BASE_URL}/users/${userId}`, { headers }).pipe(
      tap((users) => {
        this.userByIdSubject.next(users);
      })
    );

  }

  getUsersByIdObservable() {
    return this.userByIdSubject.asObservable();
  }

  deleteUser(token: string, id: number) {
    const headers = new HttpHeaders({
      "X-CSRF-Token": token,
      "Content-Type": "application/json",
    }); 

    return this.httpClient.delete(`${this.BASE_URL}/users/${id}`, {headers}).pipe(
      tap((users) => {
        this.deleteUserSubject.next();
      })
    )
  }

  deleteUserObservable(){
    return this.deleteUserSubject.asObservable();
  }

  updateUser(token: string, user: UserResponse){
    const headers = new HttpHeaders({
      "X-CSRF-Token": token,
      "Content-Type": "application/json",
    }); 
    return this.httpClient.put(`${this.BASE_URL}/users/${user.id}`,user ,{headers}).pipe(
      tap((users) => {
        this.updateUserSubject.next()
      })
    )

  }

  updateUserObservable(){
    return this.updateUserSubject.asObservable();
  }


}
