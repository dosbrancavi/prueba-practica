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
    formData.append('description', request.description);
    formData.append('status', request.status);
    formData.append('user[id]', request.user.id.toString());

    if (request.imageFile) {
      formData.append('imageFile', request.imageFile, request.imageFile.name);
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
    const headers = new HttpHeaders({
      "X-CSRF-Token": token,
      "Content-Type": "application/json",
    });
    return this.httpClient.put<Task>(`${this.BASE_URL}/tasks`, task, {
      headers,
    });
  }

  deleteTask(id: number, token: string) {
    const headers = new HttpHeaders({
      "X-CSRF-Token": token,
      "Content-Type": "application/json",
    });
    return this.httpClient.delete<Task>(`${this.BASE_URL}/tasks/${id}`, {
      headers,
    });
  }
}
