import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { NewTaskComponent } from '../../components/new-task/new-task.component';
import { TaskListComponent } from '../../components/task-list/task-list.component';
import { Task } from '../../interfaces/task.interface';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [MatGridListModule, MatCardModule, NewTaskComponent, TaskListComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {

  pendingTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  completedTasks: Task[] = [];

  constructor(private dataService: DataService){}
  ngOnInit(){
    
    const  user = JSON.parse(localStorage.getItem('user')!);
    const token = user.csrfToken;
    console.log(token);
    this.dataService.allTasks(token).subscribe({
      next: (res) => {
        console.log(res);
        this.pendingTasks = res.filter(task => task.status === 'Pendiente');
        this.inProgressTasks = res.filter(task => task.status === 'En progreso');
        this.completedTasks = res.filter(task => task.status === 'Completada');
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  changeTaskStatus(event: { task: Task, newStatus: string }) {
    const { task, newStatus } = event;
  
    
    // Remove the task from its current list
    this.removeFromCurrentList(task);
  
    // Update the task status
    task.status = newStatus;
  
    // Add the task to the new list based on newStatus
    this.addToNewList(task, newStatus);
  
    // Optionally, update the task status on the server using DataService
    // this.dataService.updateTask(task.id, { status: newStatus }).subscribe();
  }
  
  private removeFromCurrentList(task: Task): void {
    if (task.status === 'Pendiente') {
      this.pendingTasks = this.pendingTasks.filter(t => t.id !== task.id);
    } else if (task.status === 'En progreso') {
      this.inProgressTasks = this.inProgressTasks.filter(t => t.id !== task.id);
    } else if (task.status === 'Completada') {
      this.completedTasks = this.completedTasks.filter(t => t.id !== task.id);
    }
  }
  
  
  private addToNewList(task: Task, newStatus: string): void {
    let newList: Task[];
    
    if (newStatus === 'Pendiente') {
      newList = this.pendingTasks;
    } else if (newStatus === 'En progreso') {
      newList = this.inProgressTasks;
    } else if (newStatus === 'Completada') {
      newList = this.completedTasks;
    } else {
      return;
    }
  
    // Verificar si la tarea ya existe en la lista
    if (!newList.some(t => t.id === task.id)) {
      newList.push(task);
    }
  }
  

}
