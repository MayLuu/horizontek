import { Project } from './../../core/models/project.model';
import { File } from './../../core/models/file.model';
import { Component, ElementRef, EventEmitter, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { BehaviorSubject, Observable, pipe, tap } from 'rxjs';
import { Folder } from 'src/app/core/models/folder.model';
import { InventoryService, ResponseBody } from 'src/app/core/services/inventory.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { FileElement } from 'src/app/core/models/element.model';
import { FileService } from 'src/app/core/services/file.service';


//for tree
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */

interface ProjectNode {
  id: string;
  name: string;
  files?: File[];
  children?: Folder[]
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
      cell: (element: PeriodicElement) => `${element.name}`,
    },
    {
      columnDef: 'size',
      header: 'Size',
      cell: (element: PeriodicElement) => `${element.size}`,
    },
    {
      columnDef: 'application',
      header: 'Application',
      cell: (element: PeriodicElement) => `${element.application}`,
    },
    // {
    //   columnDef: 'action',
    //   header: '',
    //   cell: (element: PeriodicElement) => `${element.application}`,
    // },
  ];
  tableData: PeriodicElement[] = [];

  displayedColumns = this.columns.map(c => c.columnDef);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  constructor(private inventoryService: InventoryService,
    private element: ElementRef,
    private renderer: Renderer2,
    private _fb: FormBuilder,
    public loaderService: LoaderService,
    private router: Router,
    public fileService: FileService) {
    //tree
    // this.dataSource.data = TREE_DATA;
    // this.dataSource.data = this.currentProjectNode;

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
      console.log(data.data[0]);
      console.log(typeof this.currentProject)
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
        })

      }

      )

      //TREE
      //first : clone {name, folder: null} to this.currentProjectNode use myArr.map( val => myCopy.push( Object.assign({}, val.name, this.currentProject.folder))
      //second : in getProjectContent func , pass folder property of first project to this.currentProjectNode[0].children
      console.log(this.currentProjectNode)

    });


  }

  getProjectContent(node: ProjectNode): void {
    console.log(node)

    this.currentNode = node;
    this.currentProject = node
    this.currentChildrens = node.files as File[];
    this.tableData = []
    node.files && node.files.map(i => this.tableData.push(Object.assign({},
      {
        id: i.id,
        position: Date.now(),
        name: i.name,
        img: "alo",
        size: "2MB",
        application: "Inventory",
      }

    ))
    )

    console.log('table', this.tableData)



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
        this.tableData.push(
          {
            id: res.data[0].id,
            position: Date.now(),
            name: res.data[0].name,
            img: "alo",
            size: "2MB",
            application: "Inventory",
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
