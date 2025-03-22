export interface UserTokenI {
    user: {
      _id: string;
      name: string;
      email: string;
      password: string;
      role: string;
      isVerified: boolean;
      isDeleted: boolean;
      createdAt: string;
      updatedAt: string;
      __v: number;
      id: string;
    };
    iat: number;
  }
  