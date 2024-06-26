import { Component, inject } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { NewTaskComponent } from "../../components/new-task/new-task.component";
import { TaskListComponent } from "../../components/task-list/task-list.component";
import { Task } from "../../interfaces/task.interface";
import { DataService } from "../../services/data.service";
import { Subscription } from "rxjs";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";


@Component({
  selector: "app-tasks",
  standalone: true,
  imports: [
    MatGridListModule,
    MatCardModule,
    NewTaskComponent,
    TaskListComponent,
    MatIconModule
  ],
  templateUrl: "./tasks.component.html",
  styleUrl: "./tasks.component.css",
})
export class TasksComponent {
  pendingTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  completedTasks: Task[] = [];
  token = "";
  router: Router = inject(Router);

  private taskCreatedSubscription!: Subscription;
  private taskUpdatedSubscription!: Subscription;
  cols = 3;
  heigth = 'fit';
  userName = '';

  constructor(private dataService: DataService, private breakpointObserver: BreakpointObserver) {}

  navigateProfile(){
    this.router.navigate(['/profile']);
  }

  logOut(){
    localStorage.removeItem('user');
    this.router.navigate(['/login'])
  }
  ngOnInit() {
    const user = JSON.parse(localStorage.getItem("user")!);
    this.token = user.csrfToken;
    this.userName = user.user.username;

    console.log(user.user.username)

    this.loadTasks();

    this.taskCreatedSubscription = this.dataService
      .getTaskCreatedObservable()
      .subscribe(() => {
        this.loadTasks();
      });

      this.taskUpdatedSubscription = this.dataService
      .getTaskUpdatedObservable()
      .subscribe(() => {
        this.loadTasks();
      });

      this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.cols = result.matches ? 1 : 3;
        this.heigth = result.matches ? '90vh' : 'fit'
      });
  }

  ngOnDestroy() {
    this.taskCreatedSubscription.unsubscribe();
  }

  private loadTasks() {
    this.dataService.allTasks(this.token).subscribe({
      next: (res) => {
        this.pendingTasks = res.filter((task) => task.status === "Pendiente");
        this.inProgressTasks = res.filter(
          (task) => task.status === "En progreso"
        );
        this.completedTasks = res.filter(
          (task) => task.status === "Completada"
        );
      },
      error: (err) => {
        console.log(err, 'load');
        if (err.status === 401) {
          localStorage.removeItem('user');
          this.router.navigate(['/login']);
        }
      },
    });
  }

  changeTaskStatus(event: { task: Task; newStatus: string }) {
    const { task, newStatus } = event;

    this.removeFromCurrentList(task);

    task.status = newStatus;

    this.addToNewList(task, newStatus);

    this.dataService.updateTask(task, this.token).subscribe({
      error: (err) => {
        console.log(err.status);
        if (err.status === 401) {
          localStorage.removeItem('user');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  private removeFromCurrentList(task: Task): void {
    if (task.status === "Pendiente") {
      this.pendingTasks = this.pendingTasks.filter((t) => t.id !== task.id);
    } else if (task.status === "En progreso") {
      this.inProgressTasks = this.inProgressTasks.filter(
        (t) => t.id !== task.id
      );
    } else if (task.status === "Completada") {
      this.completedTasks = this.completedTasks.filter((t) => t.id !== task.id);
    }
  }

  private addToNewList(task: Task, newStatus: string): void {
    let newList: Task[];

    if (newStatus === "Pendiente") {
      newList = this.pendingTasks;
    } else if (newStatus === "En progreso") {
      newList = this.inProgressTasks;
    } else if (newStatus === "Completada") {
      newList = this.completedTasks;
    } else {
      return;
    }

    if (!newList.some((t) => t.id === task.id)) {
      newList.push(task);
    }
  }
}
