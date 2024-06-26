import { CommonModule } from "@angular/common";
import { Component, HostListener, Input, inject } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { Task } from "../../interfaces/task.interface";
import { MatDialog } from "@angular/material/dialog";
import { EditTaskModalComponent } from "../edit-task-modal/edit-task-modal.component";
import { DataService } from "../../services/data.service";
import { UserResponse } from "../../interfaces/user.interface";
import { Router } from "@angular/router";

@Component({
  selector: "app-task-card",
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: "./task-card.component.html",
  styleUrls: ["./task-card.component.css"],
})
export class TaskCardComponent {
  @Input() task!: Task;
  username!: string;
  token!: string;
  user!: UserResponse;
  router: Router = inject(Router)

  constructor(private dialog: MatDialog, private dataService: DataService) {}

  @HostListener("dragstart", ["$event"])
  onDragStart(event: DragEvent) {
    event.dataTransfer?.setData("task", JSON.stringify(this.task));
  }

  openEditTaskModal() {
    const dialogRef = this.dialog.open(EditTaskModalComponent, {
      width: "400px",
      data: this.task,
    });

    dialogRef.componentInstance.taskUpdated.subscribe((updatedTask: Task) => {
      this.task = updatedTask;
      this.loadUser();
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.task = result;
      }
    });
  }

  loadUser() {
   
    this.dataService.getUserById(this.token, this.task.user.id).subscribe({
      next: (result) => {
        this.user = result;
        this.username = this.user.username;
      },
      error: (err) => {
        if(err.status === 401) {
          localStorage.removeItem("user");
          this.router.navigate(["/login"]);
        }
      }
    })
  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem("user")!);
    this.token = user.csrfToken;
    this.loadUser();
  }
}
