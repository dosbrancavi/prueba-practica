import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NewTaskModalComponent } from '../new-task-modal/new-task-modal.component';

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [MatButtonModule,MatIconModule],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css'
})
export class NewTaskComponent {

  constructor(public dialog: MatDialog) {}

  openModal(): void {
    const dialogRef = this.dialog.open(NewTaskModalComponent, {
      width: '80%', // Ancho del modal (opcional)
      // Puedes agregar más configuraciones según tus necesidades
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal se cerró');
      // Aquí puedes agregar lógica adicional después de cerrar el modal si es necesario
    });
  }
}
