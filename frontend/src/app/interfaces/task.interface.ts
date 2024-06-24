export interface Task{
    description: string,
    status: string,
    imageUrl: string,
    user: {
        id: number 
    }
    id?: number
}