export interface Folder {
    id: string;
    name: string;
    parentId: string;
    projectId: string;
    createdAt: any;
    files: [];//null
    children: [];//null
}