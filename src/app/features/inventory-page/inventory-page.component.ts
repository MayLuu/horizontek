import { Component, ElementRef, EventEmitter, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { BehaviorSubject, Observable, pipe, tap } from 'rxjs';
import { Folder } from 'src/app/core/models/folder.model';
import { Project } from 'src/app/core/models/project.model';
import { InventoryService, ResponseBody } from 'src/app/core/services/inventory.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { File } from 'src/app/core/models/file.model';
import { FileElement } from 'src/app/core/models/element.model';
import { FileService } from 'src/app/core/services/file.service';




@Component({
  selector: 'app-inventory-page',
  templateUrl: './inventory-page.component.html',
  styleUrls: ['./inventory-page.component.scss']
})


export class InventoryPageComponent {

  projects: Project[] = [];
  currentProject: any = {};
  currentChildrens: Folder[] = [];
  file!: any;
  fileName: string = "";

  //upload form
  uploadForm!: FormGroup;
  constructor(private inventoryService: InventoryService,
    private element: ElementRef,
    private renderer: Renderer2,
    private _fb: FormBuilder,
    public loaderService: LoaderService,
    private router: Router,
    public fileService: FileService) {

  }



  ngOnInit() {
    this.getAllProjects();
    this.uploadForm = this._fb.group({
      file: [''],
      projectId: [''],
      folderId: ['']
    })
    //for file explorer
    const folderA = this.fileService.add({ name: 'Folder A', isFolder: true, parent: 'root' });
    this.fileService.add({ name: 'Folder B', isFolder: true, parent: 'root' });
    this.fileService.add({ name: 'Folder C', isFolder: true, parent: folderA.id as string });
    this.fileService.add({ name: 'File A', isFolder: false, parent: 'root' });
    this.fileService.add({ name: 'File B', isFolder: false, parent: 'root' });

    this.updateFileElementQuery();

  }
  getAllProjects(): void {
    this.inventoryService.getAllProjects().subscribe(data => {
      this.projects = data.data;
      this.currentProject = data.data[0]
    });
    console.log(this.projects)
  }
  getProjectContent(projectId: string): void {
    console.log(this.inventoryService.getProjectById(projectId).subscribe(data => this.currentProject = data.data))
  }
  getFolderContent(item: Folder, i: Number) {

    let selected = document.getElementById('folder-' + i) as HTMLElement;


    let length = item.children.length;
    let array: Folder[] = item.children;
    if (length > 0) {
      //add rows = length of children
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        let newChild = document.createElement('li');
        newChild.innerHTML = element.name;
        //append
        selected.appendChild(newChild)
      }

    }




    // console.log(this.renderer.appendChild(this.element.nativeElement,))

    if (item.id !== null && item.children.length > 0) {
      this.currentChildrens = item.children;

    }
  }

  handleFileInput(e: any) {
    const file: File = e.target.files[0];
    this.uploadForm.get('file')?.setValue(file)

  }
  onSubmit(projectId: string) {
    console.log('form');
    console.log(this.uploadForm.controls);

    var formData: any = new FormData();

    formData.append('uploads', this.uploadForm.get('file')?.value);
    formData.append('projectId', projectId);
    // formData.append('folderId', folderId);

    console.log('body', formData)

    let res: any
    this.inventoryService.uploadFile(formData).subscribe(data => {
      res = data;
      if (res.code == 200) {
        console.log(res.data)
        this.currentProject.files.push(res.data[0])
      }
    })

    // console.log(this.inventoryService.uploadFile(form).subscribe(data => console.log('file res', data)))

  }
  onUploadFile(type: number) {
    console.log('form');
    console.log(this.uploadForm.controls);

    var formData: any = new FormData();

    formData.append('uploads', this.uploadForm.get('file')?.value);
    formData.append('projectId', this.uploadForm.get('projectId')?.value);

    console.log('body', formData)
    let res: any;
    this.inventoryService.uploadFile(formData).subscribe(data => {
      res = data;

      this.currentProject.files.push(res.data[0])

    })


    // console.log(this.inventoryService.uploadFile(form).subscribe(data => console.log('file res', data)))

  }

  getFilePreview(file: File) {
    console.log(file.id, file.name)
    const navigationExtras: NavigationExtras = { state: { fileId: file.id, fileName: file.name } };

    this.router.navigate(['/inventory/preview'], navigationExtras);

  }


  //file exploreer
  public fileElements!: Observable<any>;



  currentRoot!: FileElement;
  currentPath!: string;
  canNavigateUp = false as any;



  addFolder(folder: { name: string }) {
    this.fileService.add({ isFolder: true, name: folder.name, parent: this.currentRoot ? this.currentRoot.id as string : 'root' });
    this.updateFileElementQuery();
  }

  removeElement(element: FileElement) {
    this.fileService.delete(element.id as string);
    this.updateFileElementQuery();
  }

  navigateToFolder(element: FileElement) {
    this.currentRoot = element;
    this.updateFileElementQuery();
    this.currentPath = this.pushToPath(this.currentPath, element.name);
    this.canNavigateUp = true;
  }

  navigateUp() {
    if (this.currentRoot && this.currentRoot.parent === 'root') {
      this.currentRoot = null as any;
      this.canNavigateUp = false;
      this.updateFileElementQuery();
    } else {
      this.currentRoot = this.fileService.get(this.currentRoot.parent);
      this.updateFileElementQuery();
    }
    this.currentPath = this.popFromPath(this.currentPath);
  }

  moveElement(event: { element: FileElement; moveTo: FileElement }) {
    this.fileService.update(event.element.id as string, { parent: event.moveTo.id });
    this.updateFileElementQuery();
  }

  renameElement(element: FileElement) {
    this.fileService.update(element.id as string, { name: element.name });
    this.updateFileElementQuery();
  }

  updateFileElementQuery() {
    this.fileElements = this.fileService.queryInFolder(this.currentRoot ? this.currentRoot.id as string : 'root');
  }

  pushToPath(path: string, folderName: string) {
    let p = path ? path : '';
    p += `${folderName}/`;
    return p;
  }

  popFromPath(path: string) {
    let p = path ? path : '';
    let split = p.split('/');
    split.splice(split.length - 2, 1);
    p = split.join('/');
    return p;
  }
}
