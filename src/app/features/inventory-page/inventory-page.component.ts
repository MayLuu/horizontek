import { Project } from './../../core/models/project.model';
import { File } from './../../core/models/file.model';
import { Component, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { Folder } from 'src/app/core/models/folder.model';
import { InventoryService } from 'src/app/core/services/inventory.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { FileService } from 'src/app/core/services/file.service';


//for tree
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CreateDialogComponent } from 'src/app/core/layout/create-dialog/create-dialog.component';
//for paginator
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { merge, of, startWith, switchMap } from 'rxjs';
import { EditDialogComponent } from 'src/app/core/layout/edit-dialog/edit-dialog.component';
interface ProjectNode {
  id: string;
  name: string;
  files?: File[];
  children?: Folder[];
  parentId?: any;
  projectId?: any;
}

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  n: ProjectNode
}

export interface PeriodicElement {
  id: string;
  position: number;
  name: string;
  img: string;
  size: string;
  application: string;
  url: string;
}
@Component({
  selector: 'app-inventory-page',
  templateUrl: './inventory-page.component.html',
  styleUrls: ['./inventory-page.component.scss']
})


export class InventoryPageComponent {

  projects: Project[] = [];
  currentProject!: ProjectNode;
  currentProjectNode: ProjectNode[] = [];


  currentChildrens: File[] = [];
  currentFiles: File[] = [];

  currentNode!: ProjectNode;
  file!: any;
  fileName: string = "";

  //upload form
  uploadForm!: FormGroup;

  //tree goes here
  private _transformer = (node: ProjectNode, level: number) => {
    return {
      // expandable: !!node.children && node.children.length > 0,
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      n: node
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,


  );

  //TABLE
  columns = [
    {
      columnDef: 'image',
      header: '',
      cell: (element: PeriodicElement) => `${element.id}`,
    },
    {
      columnDef: 'position',
      header: 'No',
      cell: (element: PeriodicElement) => `${element.position}`,
    },
    {
      columnDef: 'name',
      header: 'Name',
      cell: (element: PeriodicElement) => `${element.name}.obj`,
    },
    {
      columnDef: 'size',
      header: 'Size',
      cell: (element: PeriodicElement) => `${element.size}`,
    },
    {
      columnDef: 'application',
      header: 'Application',
      cell: (element: PeriodicElement) => `${element}`,
    },
    // {
    //   columnDef: 'action',
    //   header: '',
    //   cell: (element: PeriodicElement) => ``,
    // },
  ];
  resultFiles: PeriodicElement[] = [];
  tableDataSource!: MatTableDataSource<PeriodicElement>;

  displayedColumns = this.columns.map(c => c.columnDef);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  //PAGINATOR
  @ViewChild('paginator', { static: true }) paginator!: MatPaginator
  constructor(private inventoryService: InventoryService,
    private element: ElementRef,
    private renderer: Renderer2,
    private _fb: FormBuilder,
    public loaderService: LoaderService,
    private router: Router,
    public fileService: FileService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog) {


  }

  //tree
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;


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


      this.currentProject = {
        id: data.data[0].id,
        name: data.data[0].name,
        files: data.data[0].file,
        children: data.data[0].folder
      }


      this.projects.map(p => {
        var folderArr!: Folder[];
        var fileArr!: File[];
        this.inventoryService.getProjectById(p.id).subscribe(res => {
          folderArr = res.data.folder;
          fileArr = res.data.files;
          this.currentProjectNode.push(Object.assign({}, { id: p.id, name: p.name, files: fileArr, children: folderArr }));

          this.dataSource.data = this.currentProjectNode

          this.getProjectContent(this.currentProjectNode as any)

          let defaultProject = this.currentProjectNode[0];
          this.getProjectContent({
            id: defaultProject.id,
            name: defaultProject.name,
            files: defaultProject.files,
            children: defaultProject.children
          })


        })

      }

      )













    });


  }

  getProjectContent(node: ProjectNode, id?: string): void {
    document.getElementsByClassName('active-node')[0]?.classList.remove('active-node')

    document.getElementById(node.id)?.classList.add('active-node')

    let active = document.getElementById(node.id) as HTMLInputElement | null;
    if (active != null) {
      active.style.backgroundColor = '#FAEBD7'
    }

    this.currentNode = node;
    this.currentProject = node
    this.currentChildrens = node.files as File[];
    this.resultFiles = []
    console.log('node', node.files)
    node.files && node.files.map((i, index) => this.resultFiles.push(Object.assign({},
      {
        id: i.id,
        position: index + 1,
        name: i.name,
        img: "alo",
        size: i.size + " B",
        application: "Inventory",
        url: i.url
      }

    ))
    )

    this.tableDataSource = new MatTableDataSource(this.resultFiles)
    console.log('table:', this.resultFiles)

    this.tableDataSource.paginator = this.paginator



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
  onSubmit(current: any) {
    console.log('form');
    // console.log(this.uploadForm.controls);
    console.log('id')
    console.log(this.currentNode)
    var formData: any = new FormData();
    console.log(current)
    formData.append('uploads', this.uploadForm.get('file')?.value);
    console.log(Object.keys(this.currentNode).length)
    if (Object.keys(this.currentNode).length > 4) {
      console.log(this.currentNode.id, 'folder')
      formData.append('folderId', this.currentNode.id)

    } else {
      console.log(this.currentProject, 'project')
      formData.append('projectId', this.currentProject.id);
    }




    // console.log('body', formData)

    let res: any
    this.inventoryService.uploadFile(formData).subscribe(data => {
      res = data;
      if (res.code == 200) {
        console.log(res.data)
        this.currentProject.files?.push(res.data[0])
        this.resultFiles.push(
          {
            id: res.data[0].id,
            position: Date.now(),
            name: res.data[0].name,
            img: "alo",
            size: "2MB",
            application: "Inventory",
            url: res.data[0].url
          }
        )
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

      this.currentProject.files?.push(res.data[0])

    })


    // console.log(this.inventoryService.uploadFile(form).subscribe(data => console.log('file res', data)))

  }

  getFilePreview(file: File) {
    console.log(file.id, file.name)
    const navigationExtras: NavigationExtras = { state: { fileId: file.id, fileName: file.name } };

    this.router.navigate(['/inventory/preview'], navigationExtras);

  }

  openCreateFolderDialog(): void {
    let newFolder!: string;
    let dialogRef = this.dialog.open(CreateDialogComponent, {
      width: 'fit-content%',
      data: newFolder,
      autoFocus: true

    });
    dialogRef.afterClosed().subscribe(result => {
      this.createFolder(result)
    })
  }

  createFolder(result: string) {

    console.log('current', this.currentNode);
    console.log('projectId:', this.currentNode.projectId == undefined)
    console.log('parentId:', this.currentNode.parentId == null || this.currentNode.parentId == undefined)

    interface ReqBody {
      name: string,
      createdAt: string,
      parentId: any,
      projectId: any
    };
    let body: ReqBody = {
      name: result,
      createdAt: new Date().toISOString(),
      parentId: null,
      projectId: null

    };


    let firstCond = this.currentNode.projectId == undefined;
    let secondCond = this.currentNode.parentId == null || this.currentNode.parentId == undefined
    if (firstCond && secondCond) {

      body.projectId = this.currentNode.id
    } else {
      body.parentId = this.currentNode.id
    }

    console.log('body', body)
    this.inventoryService.createFolder(body).subscribe(
      res => console.log(res),
      err => console.log(err),
      () => {
      }
    )

  }
  AfterViewInit() {
    this.tableDataSource.paginator = this.paginator
  }

  getSearchVal(val: string) {
    this.tableDataSource.filter = val.trim().toLowerCase()
    console.log(this.tableDataSource.filter)
  }

  //CRUD FILES
  openEditFileDialog(ele: any): void {
    let newFolder = ele.name;
    let dialogRef = this.dialog.open(EditDialogComponent, {
      width: 'fit-content%',
      data: newFolder,
      autoFocus: true,


    });
    dialogRef.afterClosed().subscribe(result => {
      this.updateFile(ele.id, result)
    })
  }

  updateFile(id: string, result: string) {
    let condition = this.currentNode.projectId == undefined
    interface ReqBody {
      name: string,
      createdAt: string,
      projectId: any
    };
    let body: ReqBody = {
      name: result,
      createdAt: new Date().toISOString(),
      projectId: condition == true ? this.currentNode.id : this.currentNode.projectId

    };
    console.log('body', body)
    this.inventoryService.updateFile(id, body).subscribe(
      res => console.log(res),
      err => console.log(err),
      () => this._snackBar.open("Rename successfully", "Hide")
    )
  }
  deleteFile(ele: any) {
    this.inventoryService.deleteFile(ele.id).subscribe(
      res => { },
      err => this._snackBar.open('Delete failed', 'Hide'),
      () => this._snackBar.open("Delete successfully", "Hide")
    )
  }
  downloadFile(ele: any) {
    this.inventoryService.downloadFile(ele.url)

    // this.inventoryService.updateFile("669de7da-0388-11ee-a7a4-0242c0a8d002",{
    //   "projectId":"ae40c722-e595-11ed-865a-42010ab80002",
    //   "name":"Test",

    // })
  }

}
