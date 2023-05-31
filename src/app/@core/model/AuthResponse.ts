export class AuthResponse {
    StatusCode?: number;
    Message?: string;
    Data?: User;
    Token?:string
  }

  export class User{
    UserId?:string;
    FirstName?:string;
    LastName?:string;
    Roll?:string;
  }