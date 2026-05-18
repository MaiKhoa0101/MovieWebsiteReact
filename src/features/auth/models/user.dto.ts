
export interface UserBaseDTO{
    id: string;
    full_name:string;
    username:string;
    email:string;
    phone_number:string;
    password: string;
    is_active: boolean;
    is_verified:boolean;
    is_deleted:boolean;
}

export interface UserCreateDTO extends UserBaseDTO{

}

export interface UserUpdateDTO extends UserBaseDTO{

}

export interface UserResponseDTO extends UserBaseDTO{

}

export interface LoginResponseDTO{
    status: string,
    data: Token
}

export interface Token{
    token:string
}