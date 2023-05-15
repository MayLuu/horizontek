import { Injectable } from '@angular/core';

import { v4 } from 'uuid';
import { FileElement } from '../models/element.model';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

export interface IFileService {
    add(fileElement: FileElement): any;
    delete(id: string): any;
    update(id: string, update: Partial<FileElement>): any;
    queryInFolder(folderId: string): Observable<FileElement[]>;
    get(id: string): FileElement;
}

@Injectable({ providedIn: "root" })
export class FileService implements IFileService {
    private map = new Map<string, FileElement>();

    constructor() { }

    add(fileElement: FileElement) {
        fileElement.id = v4();
        this.map.set(fileElement.id, this.clone(fileElement));
        return fileElement;
    }

    delete(id: string) {
        this.map.delete(id);
    }

    update(id: string, update: Partial<FileElement>) {
        let element: any = this.map.get(id);
        element = Object.assign(element, update);
        this.map.set(element.id, element);
    }

    private querySubject!: BehaviorSubject<FileElement[]>;
    queryInFolder(folderId: string) {
        const result: FileElement[] = [];
        this.map.forEach(element => {
            if (element.parent === folderId) {
                result.push(this.clone(element));
            }
        });
        if (!this.querySubject) {
            this.querySubject = new BehaviorSubject(result);
        } else {
            this.querySubject.next(result);
        }
        return this.querySubject.asObservable();
    }

    get(id: string): any {
        return this.map.get(id);
    }

    clone(element: FileElement) {
        return JSON.parse(JSON.stringify(element));
    }
}