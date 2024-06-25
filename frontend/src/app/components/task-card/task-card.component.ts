import { CommonModule } from "@angular/common";
import { Component, HostListener, Input } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { Task } from "../../interfaces/task.interface";
import { MatDialog } from "@angular/material/dialog";
import { EditTaskModalComponent } from "../edit-task-modal/edit-task-modal.component";

@Component({
  selector: "app-task-card",
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: "./task-card.component.html",
  styleUrl: "./task-card.component.css",
})
export class TaskCardComponent {
  @Input() task!: Task;

  constructor(private dialog: MatDialog) {}

  @HostListener("dragstart", ["$event"])
  onDragStart(event: DragEvent) {
    event.dataTransfer?.setData("task", JSON.stringify(this.task));
  }

  openEditTaskModal() {
    const dialogRef = this.dialog.open(EditTaskModalComponent, {
      width: "400px",
      data: this.task,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Manejar la tarea actualizada
        this.task = result;
      }
    });
  }
}
