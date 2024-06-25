export interface Task {
    description: string;
    status: string;
    imageUrl: string;
    user: {
      id: number;
    };
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