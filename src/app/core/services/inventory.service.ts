import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandlerService, HandleError } from './http-error-handler.service';
import { Project } from '../models/project.model';
import { environment } from 'environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { saveAs } from 'file-saver';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token'
    })
};
export interface ResponseBody {
    code: number,
    data: any,
    message: string
}
@Injectable({
    providedIn: 'root'
})

export class InventoryService {

    projectUrl = 'http://34.101.50.122:8000/api/projects';  // URL to web api
    folderUrl = 'http://34.101.50.122:8000/api/folders';
    filetUrl = 'http://34.101.50.122:8000/api/files';
    private handleError: HandleError;

    constructor(
        private http: HttpClient,
        httpErrorHandler: HttpErrorHandlerService,
        private _snackBar: MatSnackBar,
    ) {
        this.handleError = httpErrorHandler.createHandleError('ProjectsService');
    }

    /** GET Projectes from the server */
    getAllProjects(): Observable<ResponseBody> {
        return this.http.get<ResponseBody>(this.projectUrl)

    }
    getProjectById(id: string): Observable<any> {
        return this.http.get<any>(this.projectUrl + "/" + id)
    }
    createFolder(body: any): Observable<any> {
        return this.http.post<any>(environment.apiUrl + '/folders', body)

    }

    uploadFile(formData: any): Observable<any> {
        return this.http.post<any>(this.filetUrl + "/upload", formData)

    }
    deleteFile(fileId: string): Observable<any> {
        return this.http.delete<any>(this.filetUrl + "/" + fileId)

    }
    downloadFile(fileLink: string): void {
        console.log(fileLink)
        this.http.get(fileLink, { headers: { 'Content-Type': 'model/obj' }, responseType: 'blob' }).subscribe(
            (res) => {
                console.log("hello")
                console.log(res)
                const file = new Blob([res], { type: 'model/obj' });
                const url = window.URL.createObjectURL(res);
                // window.open(url);
                // saveAs(res, res?.name + '.obj');

                // const a = document.createElement('a')
                // const objectUrl = URL.createObjectURL(res)
                // a.href = objectUrl
                // a.download = 'test.obj';
                // a.click();
                // URL.revokeObjectURL(objectUrl);

            },
            err => {
                this._snackBar.open('Download failed', "Hide")
                console.log(err)
            }
        )

    }

    updateFile(fileId: string, body: any): Observable<any> {
        return this.http.put<ResponseBody>(this.filetUrl + "/" + fileId, body)

    }






}
