export interface Category {
  _id: any;
  name: string;
  description?: string;
  parentId?: any;
  children?: Category[]; 
  createdAt: Date;
  updatedAt: Date;
}



export interface CategoryResponse {
    message: string;
    categories: Category[];
  }
  