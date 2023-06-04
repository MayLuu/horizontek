import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandlerService, HandleError } from './http-error-handler.service';
import { Project } from '../models/project.model';
import { environment } from 'environment';

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
        httpErrorHandler: HttpErrorHandlerService) {
        this.handleError = httpErrorHandler.createHandleError('ProjectsService');
    }

    /** GET Projectes from the server */
    getAllProjects(): Observable<ResponseBody> {
        return this.http.get<ResponseBody>(this.projectUrl)

    }
    getProjectById(id: string): Observable<any> {
        return this.http.get<any>(this.projectUrl + "/" + id)
    }

    uploadFile(formData: any): Observable<any> {
        console.log(this.http.post<any>(this.filetUrl, formData))
        return this.http.post<any>(this.filetUrl, formData)

    }

    createFolder(body: any): Observable<any> {
        return this.http.post<any>(environment.apiUrl + '/folders', body)

    }


    /* GET Projectes whose name contains search term */
    // searchProjecte(term: string): Observable<Project[]> {
    //   term = term.trim();

    //   // Add safe, URL encoded search parameter if there is a search term
    //   const options = term ?
    //     { params: new HttpParams().set('name', term) } : {};

    //   return this.http.get<Project[]>(this.url, options)
    //     .pipe(
    //       catchError(this.handleError<Project[]>('searchProjectes', []))
    //     );
    // }

    //////// Save methods //////////

    /** POST: add a new Project to the database */
    // addProject(Project: Project): Observable<Project> {
    //   return this.http.post<Project>(this.url, Project, httpOptions)
    //     .pipe(
    //       catchError(this.handleError('addProject', Project))
    //     );
    // }

    /** DELETE: delete the Project from the server */
    // deleteProject(id: number): Observable<unknown> {
    //   const url = `${this.url}/${id}`; // DELETE api/Projectes/42
    //   return this.http.delete(url, httpOptions)
    //     .pipe(
    //       catchError(this.handleError('deleteProject'))
    //     );
    // }

    /** PUT: update the Project on the server. Returns the updated Project upon success. */
    // updateProject(Project: Project): Observable<Project> {
    //   httpOptions.headers =
    //     httpOptions.headers.set('Authorization', 'my-new-auth-token');

    //   return this.http.put<Project>(this.url, Project, httpOptions)
    //     .pipe(
    //       catchError(this.handleError('updateProject', Project))
    //     );
    // }
}
