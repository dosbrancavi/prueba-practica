import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { LoginRequest } from '../../interfaces/user.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,MatButtonModule, MatInputModule , MatGridListModule,MatChipsModule, JsonPipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  router: Router = inject(Router);
  error = false;  
  constructor(private formBuilder: FormBuilder, private dataService: DataService){}

  loginFrom: FormGroup = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  get username(){return this.loginFrom.controls['username']}
  get password(){return this.loginFrom.controls['password']}

  login(){
    if (this.loginFrom.valid) {

      const body: LoginRequest = {
        password: this.password.value,
        username: this.username.value
      }

      this.dataService.login(body).subscribe({
        next: (res) => {
          localStorage.setItem('user', JSON.stringify(res));
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          this.error = true;
          setTimeout(() => {this.error = false;}, 3000)
        }
      })
    }
  }
}
