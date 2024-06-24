import { JsonPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DataService } from '../../services/data.service';
import { RegisterRequest } from '../../interfaces/user.interface';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatInputModule , MatGridListModule, NgIf, JsonPipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  
  loading = false;

  constructor(private formBuilder: FormBuilder, private dataService: DataService){}
  
  registerForm: FormGroup = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    phoneNumber: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern("\\d{4}-\\d{4}")]],
    age: ['', [Validators.required]],
    gender: ['', [Validators.required] ],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]]
  })
  
  get username(){return this.registerForm.controls['username']}
  get phoneNumber(){return this.registerForm.controls['phoneNumber']}
  get age(){return this.registerForm.controls['age']}
  get gender(){return this.registerForm.controls['gender']}
  get password(){return this.registerForm.controls['password']}
  
  register(){
    if (this.registerForm.valid) {
      this.loading = true;
      const body: RegisterRequest = {
        age: this.age.value,
        gender: this.gender.value,
        password: this.password.value,
        phoneNumber: this.phoneNumber.value,
        username: this.username.value
      }
      this.dataService.register(body).subscribe({
        next: (res) => {
          console.log(res);
          this.loading = false;
        },
        error: (err) => {
          console.log(err)
        }
      })
    }
  }
}



