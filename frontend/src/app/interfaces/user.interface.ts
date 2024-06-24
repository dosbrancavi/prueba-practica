export interface RegisterRequest{
    username: string,
    phoneNumber:string, 
    age: string, 
    gender:string, 
    password: string
}

export interface UserResponse {
    username: string,
    phoneNumber:string, 
    age: string, 
    gender:string,
}

export interface LoginRequest {
    username: string,
    password: string
}