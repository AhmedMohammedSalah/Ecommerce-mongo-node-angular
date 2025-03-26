export interface userPI{
    _id: string; 
    name: string;
    email: string;
    password: string;
    role: "user" | "seller" | "admin";
    isVerified: boolean;
    isDeleted: boolean;
    createdAt?: Date; 
    updatedAt?: Date;
}



