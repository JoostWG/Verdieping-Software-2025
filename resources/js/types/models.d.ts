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
}
