export interface Task {
    description: string;
    status: string;
    user: {
      id: number;
    };
    imageUrl?: string;
    id?: number;
    imageFile?: File | null;
  }
  

export interface CreateTask{
    description: string,
    status: string,
    user: {
        id: number 
    },
    imageFile?: File| null,
    
}