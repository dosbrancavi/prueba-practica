import { ChangeDetectorRef, Component, ElementRef, ViewChild, inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DataService } from "../../services/data.service";
import { CreateTask, Task } from "../../interfaces/task.interface";
import { MatDialogRef } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatSelectModule } from "@angular/material/select";
import { Router } from "@angular/router";

@Component({
  selector: "app-new-task-modal",
  standalone: true,
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatGridListModule,
    MatSelectModule,
    
  ],
  templateUrl: "./new-task-modal.component.html",
  styleUrl: "./new-task-modal.component.css",
})
export class NewTaskModalComponent {
  @ViewChild("imageCanvas") canvas!: ElementRef<HTMLCanvasElement>;

  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  token = "";
  id: string | null = null;

  // Variable para controlar el modo de recorte
  isCropping = false;

  // Variables para el recorte
  cropX = 0;
  cropY = 0;
  cropWidth = 0;
  cropHeight = 0;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private router: Router,
    private dialogRef: MatDialogRef<NewTaskModalComponent>,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef for manual change detection
  ) {}

  createTaskForm: FormGroup = this.formBuilder.group({
    description: ["", [Validators.required, Validators.maxLength(100)]],
    status: ["Pendiente", [Validators.required]],
    imageUrl: [""],
  });

  get description() {
    return this.createTaskForm.controls["description"];
  }
  get status() {
    return this.createTaskForm.get("status");
  }
  get imageUrl() {
    return this.createTaskForm.get("imageUrl");
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
      const reader = new FileReader();
      reader.onload = () => {
        this.createTaskForm.patchValue({ imageUrl: reader.result });
        this.renderImage();
      };
      reader.readAsDataURL(this.selectedFile);

      // Activar el modo de recorte al seleccionar un archivo
      this.startCropping();
    }
  }

  renderImage() {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        const canvas = this.canvas.nativeElement;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // Establecer el área de recorte inicial con aspecto 1:1
          const size = Math.min(canvas.width, canvas.height);
          this.cropWidth = size;
          this.cropHeight = size;
          this.cropX = (canvas.width - size) / 2;
          this.cropY = (canvas.height - size) / 2;
          // Dibujar el área de recorte inicial
          this.drawCropArea();

          // Manually trigger change detection to update the view
          this.cdr.detectChanges();
        }
      };
    };
    reader.readAsDataURL(this.selectedFile!);
  }

  drawCropArea() {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(this.cropX, this.cropY, this.cropWidth, this.cropHeight);
    }
  }

  startCropping() {
    this.isCropping = true;
  }

  cancelCropping() {
    this.isCropping = false;
    // Limpiar variables y reiniciar el formulario si es necesario
    this.selectedFile = null;
    this.selectedFileName = null;
    this.createTaskForm.reset();
  }

  finalizeCropping() {
    this.isCropping = false;
    // Recortar la imagen según los valores de recorte y volver a mostrar el formulario
    this.cropImage();
  }

  cropImage() {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const imageData = ctx.getImageData(
        this.cropX,
        this.cropY,
        this.cropWidth,
        this.cropHeight
      );
      canvas.width = this.cropWidth;
      canvas.height = this.cropHeight;
      ctx.putImageData(imageData, 0, 0);
      // No enviar la imagen recortada automáticamente, solo actualizar el canvas
      // Aquí podrías emitir un evento o realizar alguna acción adicional si es necesario
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  create() {
    if (this.createTaskForm.valid && !this.isCropping) {
      const user = JSON.parse(localStorage.getItem("user")!);
      this.token = user.csrfToken;
      this.id = user.user.id;

      let imageToUse: File | null = this.selectedFile; // Por defecto, usa la imagen original

      if (this.isCropping && this.canvas.nativeElement.toBlob) {
        // Si se está recortando y es posible obtener una imagen recortada
        this.canvas.nativeElement.toBlob((blob) => {
          if (blob) {
            imageToUse = new File([blob], this.selectedFileName!);
          }
        });
      }

      const body: CreateTask = {
        description: this.description!.value,
        status: this.status!.value,
        imageFile: imageToUse,
        user: { id: Number(this.id!) },
      };

      this.dataService.createTask(body, this.token).subscribe({
        next: (res) => {
          console.log("Tarea creada exitosamente:", res);
          this.close(); // Cierra el modal si es necesario
        },
        error: (err) => {
          console.error("Error al crear la tarea:", err);
          if (err.status === 401) {
            localStorage.removeItem("user");
            this.router.navigate(["/login"]);
            this.close(); // Cierra el modal si es necesario
          }
        },
      });
    } else {
      console.error("El formulario no es válido o estás en modo de recorte.");
    }
  }
}
