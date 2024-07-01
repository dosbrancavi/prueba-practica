import { JsonPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DataService } from '../../services/data.service';
import { RegisterRequest } from '../../interfaces/user.interface';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatInputModule , MatGridListModule, MatChipsModule, NgIf, JsonPipe, MatSelectModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  
  error = false;
  success = false;
  router: Router = inject(Router);


  constructor(private formBuilder: FormBuilder, private dataService: DataService){}
  
  registerForm: FormGroup = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    phoneNumber: ['', [Validators.required, Validators.maxLength(9), Validators.pattern("\\d{4}-\\d{4}")]],
    age: ['', [Validators.required]],
    gender: ['', [Validators.required] ],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50), Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]*$")]]
  })
  
  get username(){return this.registerForm.controls['username']}
  get phoneNumber(){return this.registerForm.controls['phoneNumber']}
  get age(){return this.registerForm.controls['age']}
  get gender(){return this.registerForm.controls['gender']}
  get password(){return this.registerForm.controls['password']}
  
  register(){
    if (this.registerForm.valid) {
      const body: RegisterRequest = {
        age: this.age.value,
        gender: this.gender.value,
        password: this.password.value,
        phoneNumber: this.phoneNumber.value,
        username: this.username.value
      }
      this.dataService.register(body).subscribe({
        next: (res) => {
          this.success = true;
          setTimeout(() => {
            this.success = false;
            this.router.navigate(['/login']);
          }, 3000)

        },
        error: (err) => {
          this.error = true;
          setTimeout(() => {this.error = false;}, 3000)
        }
      })
    }
  }
}



