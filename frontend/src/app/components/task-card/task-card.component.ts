import { CommonModule } from "@angular/common";
import { Component, HostListener, Input } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { Task } from "../../interfaces/task.interface";

@Component({
  selector: "app-task-card",
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: "./task-card.component.html",
  styleUrl: "./task-card.component.css",
})
export class TaskCardComponent {
  @Input() task!: Task;

  @HostListener("dragstart", ["$event"])
  onDragStart(event: DragEvent) {
    event.dataTransfer?.setData("task", JSON.stringify(this.task));
  }
}
