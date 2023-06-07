import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from 'environment';
import { Observable } from 'rxjs';
import { Printer } from 'src/app/core/models/printer.model';
import { LoaderService } from 'src/app/core/services/loader.service';
import { PrinterService } from 'src/app/core/services/printer.service';
import { PrintingService } from 'src/app/core/services/printing.service';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
@Component({
  selector: 'app-inventory-printing-page',
  templateUrl: './inventory-printing-page.component.html',
  styleUrls: ['./inventory-printing-page.component.scss']
})
export class InventoryPrintingPageComponent {
  private fileId!: string;
  private fileName!: string;
  private folderId!: any;
  private projectId!: string;
  f!: File;
  url!: any;
  responseData!: Blob;

  objLink!: string;
  intendTime: string = "0 sec";

  printingForm: any;

  printersList: Printer[] = [];
  selectedVal: string = "00-1B-63-84-45-E6";
  selectedQua: string = "0";
  selectedMat: string = "A";

  progress$!: Observable<any>;

  isIntended: boolean = false;

  gcodeUrl!: string;

  constructor(private router: Router,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private printingService: PrintingService,
    private printerService: PrinterService,
    public loaderService: LoaderService) {

    const navigation = this.router.getCurrentNavigation();

    const state = navigation?.extras.state as { fileId: string, fileName: string, projectId: string, folderId: string };
    console.log('fileId', state.fileId, 'name: ', state.fileName)
    console.log('projectId', state.projectId, 'folderId: ', state.folderId)
    this.fileId = state.fileId;
    this.fileName = state.fileName;
    this.folderId = state.folderId;
    this.projectId = state.projectId
    this.printingForm = new FormGroup({

      printer: new FormControl(),
      quality: new FormControl(),
      material: new FormControl(),


    })

  }
  OnInit() {


    this.loadObjFileFromAPI();

  }
  ngAfterViewInit() {
    this.loadObjFileFromAPI();

  }
  ngAfterViewChecked() {
    // if (this.isIntended == false) {
    //   this.loadObjFileFromAPI()

    // }
  }
  ngAfterContentInit() {
    // this.loadObjFileFromAPI();
    this.progress$ = this.printerService.progress$

    console.log(this.printerService.getAllPrinters().subscribe(data => {
      console.log(data)
      this.printersList = data.data;
      console.log(this.printersList)
    }))
  }

  //get file content by call api
  loadObjFileFromAPI() {
    let link: string = environment.api + this.fileName + '-' + this.fileId + '.obj';
    this.objLink = link
    console.log('link ', link)
    //create new file
    // while (document.querySelectorAll('canvas').length != 0) {
    //   document.getElementsByTagName('canvas')[0].remove();
    // }
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    var camera = new THREE.PerspectiveCamera(50, window.innerWidth / 1.35 / window.innerHeight / 1.35, 1, 1000);
    camera.position.z = 420;
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(500, 450);


    //threejs frame
    const container = document.getElementsByClassName('myObject')[0];
    container?.appendChild(renderer.domElement);

    var can = document.querySelectorAll('canvas')[0];
    can!.style.position = 'relative';


    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(0, 0%, 82%)'), 1.0);
    keyLight.position.set(-50, 0, 100);
    scene.add(keyLight);

    var objLoader = new OBJLoader();
    //load from api
    objLoader.load(link, function (object: any) {
      scene.add(object);
    });


    var animate = function () {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

  }
  switch() {
    this.isIntended = !this.isIntended

  }

  //get data for custom printer: all printers, time estimated
  onSubmit() {
    this.print()
  }
  print() {

    //open confirm dialog

    let body = new FormData()

    body.append('printerId', "00-1B-63-84-45-E6");
    body.append('fileId', this.fileId);
    body.append('status', 'PENDING');
    // body.append('folderId', this.folderId);
    // body.append('projectId', this.projectId);

    console.log(this.printingService.print(body).subscribe(
      res => {
        console.log(res.data)
      },
      err => { console.log(err) },
      () => {
        this.router.navigate(['warehouse'])
      }
    ))


  }

  //control printing


  intend() {

    //get estimated time, gcode link
    let body = new FormData()

    body.append('printerID', "00-1B-63-84-45-E6");
    body.append('density', "25%");
    body.append('quality', this.printingForm.quality);
    body.append('model', this.objLink);
    body.append('filament', 'PLA')
    // body.append('folderId', this.folderId);
    // body.append('projectId', this.projectId);

    console.log('BODY', body)
    console.log(this.printingService.getIntentTime(body).subscribe(
      res => {
        console.log(res);
        this.gcodeUrl = res.data;
        this.fileId = res.id
        if (res.TIME > 3600) {
          this.intendTime = (res.TIME / 3600).toFixed(1) + ' hours'
        }
        // this.intendTime = res.TIME;

      },
      err => { console.log(err) },
      () => {


        this.isIntended = true;

        //snackbar open

      }
    ))

  }




}
