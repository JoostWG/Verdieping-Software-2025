export interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
    projects?: Project[];
}

export interface Project {
    id: number;
    user_id: number;
    name: string;
    created_at: string;
    updated_at: string;
    user?: User;
    tasks?: Task[];
}

export interface Task {
    id: number;
    project_id: number;
    nr: number;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
    project?: Project;
}
