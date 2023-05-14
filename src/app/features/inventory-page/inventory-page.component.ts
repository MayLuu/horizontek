import { Component, ElementRef, EventEmitter, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { Observable, pipe, tap } from 'rxjs';
import { Folder } from 'src/app/core/models/folder.model';
import { Project } from 'src/app/core/models/project.model';
import { InventoryService, ResponseBody } from 'src/app/core/services/inventory.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { File } from 'src/app/core/models/file.model';

export class TableStickyHeaderExample {
  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];


@Component({
  selector: 'app-inventory-page',
  templateUrl: './inventory-page.component.html',
  styleUrls: ['./inventory-page.component.scss']
})


export class InventoryPageComponent {
  displayedColumns: string[] = ['', 'No', 'Name', 'File Name', 'Size', 'Application', ''];
  dataSource = ELEMENT_DATA;
  clickedRows = new Set<Element>();

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
    private router: Router) {

  }



  ngOnInit() {
    this.getAllProjects();
    this.uploadForm = this._fb.group({
      file: [''],
      projectId: [''],
      folderId: ['']
    })

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


}
