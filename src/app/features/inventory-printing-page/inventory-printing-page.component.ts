import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from 'environment';
import { Observable } from 'rxjs';
import { Printer } from 'src/app/core/models/printer.model';
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
  f!: File;
  url!: any;
  responseData!: Blob;

  printingForm: any;

  printersList: Printer[] = [];
  selectedVal: string = "00-1B-63-84-45-E6";
  selectedQua: string = "0";
  selectedMat: string = "A";

  progress$!: Observable<any>;

  isSliced: boolean = false;
  isIntended: boolean = false;


  constructor(private router: Router,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private printingService: PrintingService,
    private printerService: PrinterService) {

    const navigation = this.router.getCurrentNavigation();

    const state = navigation?.extras.state as { fileId: string, fileName: string };
    console.log('fileId', state.fileId, 'name: ', state.fileName)
    this.fileId = state.fileId;
    this.fileName = state.fileName;

    this.printingForm = new FormGroup({
      printer: new FormControl(),
      quality: new FormControl(),
      material: new FormControl(),
    })

  }
  OnInit() {


    this.progress$ = this.printerService.progress$
    console.log(this.printerService.getPrinterProgress())


  }
  ngAfterContentInit() {
    this.loadObjFileFromAPI();
    // console.log(this.printerService.OnInit())
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
    console.log('link ', link)
    var start = new Date().getTime();
    //create new file
    while (document.querySelectorAll('canvas').length != 0) {
      document.getElementsByTagName('canvas')[0].remove();
    }
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    // var mtlLoader = new MaterialLoader();
    var camera = new THREE.PerspectiveCamera(50, window.innerWidth / 1.35 / window.innerHeight / 1.35, 1, 1000);
    camera.position.z = 420;
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(500, 450);


    //threejs frame
    const container = document.getElementsByClassName('myObject')[0];


    container.appendChild(renderer.domElement);
    // document.body.appendChild(renderer.domElement);

    var can = document.querySelector('canvas');
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
  openGocdePreview() {
    this.isSliced = true
  }

  //get data for custom printer: all printers, time estimated
  onSubmit() {
    // this.printingForm = new FormData()

    // this.printingForm.append('printerId', "00-1B-63-84-45-E6");
    // this.printingForm.append('fileId', this.fileId);
    // this.printingForm.append('status', 'PENDING')

    // console.log('form', this.printingForm)
    // console.log(this.printingService.print(this.printingForm).subscribe(data =>
    //   console.log('aloooo', data)))
    //   ;
    console.log('onsub')
    console.log(this.printingForm.value);

    this.print()
  }
  print() {
    let body = new FormData()

    body.append('printerId', "00-1B-63-84-45-E6");
    body.append('fileId', "ff474839-f61e-11ed-8819-0242c0a8c002");
    body.append('status', 'PENDING')

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
    this.isIntended = true;
  }




}
