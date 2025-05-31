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
    user_id: User['id'];
    name: string;
    created_at: string;
    updated_at: string;
    user?: User;
    tasks?: Task[];
    tags?: Tag[];
}

export interface Task {
    id: number;
    project_id: Project['id'];
    status_id: Status['id'];
    nr: number;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
    project?: Project;
    tags?: Tag[];
    status?: Status;
}

export interface Tag {
    id: number;
    project_id: Project['id'];
    name: string;
    created_at: string;
    updated_at: string;
    tasks?: Task[];
}

export interface Status {
    id: number;
    name: 'To do' | 'In progress' | 'Done';
    created_at: string;
    updated_at: string;
    tasks?: Task[];
}
