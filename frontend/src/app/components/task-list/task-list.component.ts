import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { TaskCardComponent } from '../task-card/task-card.component';
import { DataService } from '../../services/data.service';
import { Task } from '../../interfaces/task.interface';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [MatCardModule,MatListModule,CommonModule, TaskCardComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  @Input() pendingTasks!: Task[];
  @Input() inProgressTasks!: Task[];
  @Input() completedTasks!: Task[];
  @Input() status!: string;
  @Output() taskDropped: EventEmitter<{ task: Task, newStatus: string }> = new EventEmitter();

  @HostBinding('class.dragging') isDragging = false;

  @HostListener('drop', ['$event'])
  onDropEntry(event: DragEvent): void {
    event.preventDefault();
    const data = event.dataTransfer?.getData('task');
    if (data) {
      const task = JSON.parse(data) as Task;
      this.taskDropped.emit({ task, newStatus: this.status });
    }
    this.isDragging = false;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    this.isDragging = false;
  }
  

  @HostListener('dragover', ['$event'])
  allowDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  @HostListener('dragend', ['$event'])
onDragEnd(event: DragEvent): void {
  this.isDragging = false;
  this.resetDraggingState();
}

resetDraggingState(): void {
  // Restablece el estado de arrastre en todas las columnas
  const columns = document.querySelectorAll('.task-card');
  columns.forEach(column => column.classList.remove('dragging'));
}
  ngOnInit() {
    console.log(this.pendingTasks);
  }
}