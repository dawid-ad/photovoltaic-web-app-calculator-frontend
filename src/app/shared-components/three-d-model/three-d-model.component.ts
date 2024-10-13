import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {OrbitControls} from 'three-orbitcontrols-ts';
import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader.js";
import {MatSlider, MatSliderThumb} from "@angular/material/slider";
import {MatCheckbox} from "@angular/material/checkbox";

@Component({
  selector: 'app-model3-d',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    MatSlider,
    MatSliderThumb,
    MatCheckbox
  ],
  templateUrl: './three-d-model.component.html',
  styleUrl: './three-d-model.component.scss'
})
export class ThreeDModelComponent implements AfterViewInit {
  @ViewChild('canvas') private canvasRef!: ElementRef;
  @Input() numberOfPanels: number = 45;
  @Input() mountType: string = 'FLAT_ROOF';
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private loader = new GLTFLoader();
  private model!: any;
  private lightHelper!: THREE.DirectionalLightHelper;
  private sunLight!: THREE.DirectionalLight;
  private hdrLoader = new RGBELoader();
  public setLightsMode: boolean = false; // helper to set lightening properly in the view
  public setCameraMode: boolean = false; // helper to set camera view properly
  private panelModels: Array<[string, string]> = [
    ['SLANT_ROOF', 'solar_panel_slant_roof'],
    ['FLAT_ROOF', 'solar_panel_flat_roof'],
    ['GROUND', 'solar_panel_ground_']
  ];
  private groupOfObjects = new THREE.Group();

  lightPosition = {x: 42, y: 37, z: 0};
  lightIntensity = 1.5;
  cameraRotation = {x: 0, y: 0, z: 0};
  cameraPosition = {x: 0, y: 1, z: 5};

  constructor() {
  }

  ngAfterViewInit() {
    this.initThreeJs();
    this.addSunLight();
    this.loadModel();
    this.addTransparentGround()
    this.loadHdrEnv();
    this.animate();
  }


  private initThreeJs() {
    const header = document.querySelector('header');

    // Get the heights of the header and footer
    const headerWidth = header ? header.clientWidth : 0;

    // Calculate available height for the canvas
    const availableHeight = window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf5f5f5);
    this.camera = new THREE.PerspectiveCamera(
      55,
      headerWidth / availableHeight,
      0.1, // min length of the view
      1000 // max length of the view
    );

    this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.setSceneSize();
    this.renderer.shadowMap.enabled = true; // Enable shadow mapping
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Shadow type
    this.canvasRef.nativeElement.appendChild(this.renderer.domElement);

    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.controls.enableDamping = true;
    // this.controls.dampingFactor = 0.1;
    // this.controls.enableZoom = true;
    //
    // // Restrict camera rotation so it can't go below ground level
    // this.controls.minPolarAngle = Math.PI / 4; // Minimum 45 degrees (camera stops above the ground)
    // this.controls.maxPolarAngle = Math.PI / 2.01; // Maximum 90 degrees (camera at ground level)

    window.addEventListener('resize', this.setSceneSize.bind(this), false);
  }

  private setSceneSize() {
    const header = document.querySelector('header');

    // Get the heights of the header and footer
    const headerWidth = header ? header.clientWidth : 0;

    // Calculate available height for the canvas
    const availableHeight = window.innerHeight;

    // Update camera aspect ratio and projection matrix
    this.camera.aspect = headerWidth / availableHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(headerWidth, availableHeight);
  }

  private addSunLight() {
    this.sunLight = new THREE.DirectionalLight(0xffffff, this.lightIntensity);
    this.sunLight.position.set(this.lightPosition.x, this.lightPosition.y, this.lightPosition.z);
    this.sunLight.castShadow = true;

    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    // const shadowDistance = 150/this.numberOfPanels;
    // this.sunLight.shadow.camera.left = -shadowDistance;
    // this.sunLight.shadow.camera.right = shadowDistance;
    // this.sunLight.shadow.camera.top = shadowDistance;
    // this.sunLight.shadow.camera.bottom = -shadowDistance;
    // this.sunLight.shadow.camera.near = 0.1;
    // this.sunLight.shadow.camera.far = 1000;

    if (this.setLightsMode) {
      this.lightHelper = new THREE.DirectionalLightHelper(this.sunLight, 5);
      this.scene.add(this.lightHelper);
    }

    this.scene.add(this.sunLight);
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 4)
    this.scene.add(ambientLight);
  }

  private loadModel() {
    const modelData = this.panelModels.find(model => model[0] === this.mountType);
    let panelsInRow = 6;
    let heightOfPanel = 1;
    let widthOfPanel = 2;
    let panelsNumber = this.numberOfPanels;

    if (modelData) {
      let modelBasePath = modelData[1]; // Base path for ground model files
      const modelPath = `${modelBasePath}`;
      if (this.mountType === 'GROUND') {
        const constructionSpacing = 14;
        const rowSpacing = 15;
        const constructionPerRow = 4;
        const fullSets = Math.floor(this.numberOfPanels / 12);
        const leftoverPanels = this.numberOfPanels % 12;
        panelsInRow = 4;
        heightOfPanel = 4;
        widthOfPanel = 7;
        panelsNumber = fullSets + (leftoverPanels ? 1 : 0);

        if (!fullSets) {
          this.loadLeftoverPanelsOfGroundModel(`${modelBasePath}${leftoverPanels}`, 0, 0);
        }

        const rows = Math.ceil(fullSets / constructionPerRow);
        let remainingConstruction = fullSets;

        const modelPath = `${modelBasePath}12`;
        this.loader.load(
          `/models-3-d/${modelPath}.glb`,
          (gltf) => {
            const model = gltf.scene;

            model.traverse((node: any) => {
              if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
              }
            });
            const totalWidth = Math.min(constructionPerRow, fullSets + (leftoverPanels ? 1 : 0)) * constructionSpacing;
            const totalDepth = rows * rowSpacing;

            // Offset the layout to the center
            const offsetX = -totalDepth / 2;
            const offsetZ = -totalWidth / 2;

            for (let i = 0; i < rows; i++) {
              const constructionInCurrentRow = Math.min(remainingConstruction, constructionPerRow);
              for (let j = 0; j < constructionInCurrentRow; j++) {
                remainingConstruction--;

                const panelClone = model.clone();
                const xPos = i * rowSpacing + offsetX;
                let zPos = j * constructionSpacing + offsetZ;
                panelClone.position.set(xPos, 0.85, zPos);
                this.groupOfObjects.add(panelClone);

                if (remainingConstruction === 0) {
                  if(leftoverPanels){
                    zPos = (j + 1) * constructionSpacing + offsetZ;
                    this.loadLeftoverPanelsOfGroundModel(`${modelBasePath}${leftoverPanels}`, xPos, zPos);
                  } else {
                    this.scene.add(this.groupOfObjects);

                  }
                }
              }
            }
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
          },
          (error) => {
            console.error('Error loading the model', error);
          }
        );


      } else if (this.mountType === 'SLANT_ROOF') {
        panelsInRow = 9;
        heightOfPanel = 2;
        widthOfPanel = 1;

        const rows = Math.ceil(this.numberOfPanels / panelsInRow);
        let remainingPanels = this.numberOfPanels;
        this.loader.load(
          `/models-3-d/${modelPath}.glb`,
          (gltf) => {
            this.model = gltf.scene;

            // Set shadows for each panel
            this.model.traverse((node: any) => {
              if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
              }
            });

            const panelSpacing = 4;
            const rowSpacing = -1.85;
            const heightSpacing = 1.3;

            const totalWidth = Math.min(panelsInRow, this.numberOfPanels) * panelSpacing;
            const totalDepth = rows * rowSpacing;

            // Offset the layout to the center
            const offsetX = -totalDepth / 2;
            const offsetZ = -totalWidth / 2;

            for (let i = 0; i < rows; i++) {
              const panelsInCurrentRow = Math.min(remainingPanels, panelsInRow);
              for (let j = 0; j < panelsInCurrentRow; j++) {
                remainingPanels--;

                // Clone the model for each panel
                const panelClone = this.model.clone();

                // Calculate the position of the panels
                const xPos = i * rowSpacing + offsetX;
                const zPos = j * panelSpacing + offsetZ;
                const yPos = i * heightSpacing;

                // Set the position of the panel
                panelClone.position.set(xPos, yPos, zPos);
                this.groupOfObjects.add(panelClone);
              }
            }
            this.scene.add(this.groupOfObjects);
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
          },
          (error) => {
            console.error('An error happened while loading the model', error);
          }
        );

      } else {
        const modelPath = `${modelBasePath}`;
        panelsInRow = 6;
        heightOfPanel = 1;
        widthOfPanel = 2;
        const rows = Math.ceil(this.numberOfPanels / panelsInRow); // Number of rows (max 6 panels per row)
        let remainingPanels = this.numberOfPanels; // Panels left to place
        this.loader.load(
          `/models-3-d/${modelPath}.glb`,
          (gltf) => {
            this.model = gltf.scene;

            // Set shadows for each panel
            this.model.traverse((node: any) => {
              if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
              }
            });

            const panelSpacing = 4.2;
            const rowSpacing = 4;

            let totalWidth;
            // Calculate width and depth of the entire panel layout
            totalWidth = Math.min(panelsInRow, this.numberOfPanels) * panelSpacing;
            const totalDepth = rows * rowSpacing;

            // Offset the layout to the center
            const offsetX = -totalDepth / 2;
            const offsetZ = -totalWidth / 2;

            for (let i = 0; i < rows; i++) {
              const panelsInCurrentRow = Math.min(remainingPanels, panelsInRow);
              for (let j = 0; j < panelsInCurrentRow; j++) {
                remainingPanels--;

                // Clone the model for each panel
                const panelClone = this.model.clone();

                // Calculate the position of the panels
                const xPos = i * rowSpacing + offsetX;
                const zPos = j * panelSpacing + offsetZ;

                // Set the position of the panel
                panelClone.position.set(xPos, 0, zPos);
                this.groupOfObjects.add(panelClone);

              }
            }
            this.scene.add(this.groupOfObjects);
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
          },
          (error) => {
            console.error('An error happened while loading the model', error);
          }
        );
      }
    }
    this.fitCameraToObjects(this.groupOfObjects,panelsInRow,heightOfPanel,widthOfPanel,panelsNumber);
  }

  private loadLeftoverPanelsOfGroundModel(modelPath: string, xPos: number, zPos: number) {
    this.loader.load(
      `/models-3-d/${modelPath}.glb`,
      (gltf) => {
        const model = gltf.scene;

        model.traverse((node: any) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });
        model.position.set(xPos, 0.85, zPos);
        this.groupOfObjects.add(model);
        this.scene.add(this.groupOfObjects);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.error('Error loading the model', error);
      }
    );
  }

// Updating the light position
  updateLightPosition() {
    this.sunLight.position.set(this.lightPosition.x, this.lightPosition.y, this.lightPosition.z);
    this.lightHelper.update();  // Update helper
    // console.log(`Light Position: X=${this.lightPosition.x}, Y=${this.lightPosition.y}, Z=${this.lightPosition.z}`);
  }

// Updating the light intensity
  updateLightIntensity() {
    this.sunLight.intensity = this.lightIntensity;
    console.log(`Light Intensity: ${this.lightIntensity}`);
  }

  updateCameraPosition() {
    this.camera.lookAt(this.groupOfObjects.position); // Ensure the camera is looking at the origin (center of the scene)
    // this.camera.position.set(Math.sin(this.cameraRotation.x) * radius, this.cameraPosition.y, Math.cos(this.cameraRotation.x) * radius);
    this.camera.position.set(this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z);
    // this.camera.rotation.set(this.cameraRotation.x * (Math.PI / 180),this.cameraRotation.y * (Math.PI / 180), this.cameraRotation.z  * (Math.PI / 180));
    this.camera.rotation.set(this.cameraRotation.x,this.cameraRotation.y, this.cameraRotation.z);

    this.camera.updateProjectionMatrix();
    // console.log(`Camera Position: X=${this.cameraPosition.x}, Y=${this.cameraPosition.y}, Z=${this.cameraPosition.z}`);
    // console.log(`Camera Rotation: X=${this.cameraRotation.x}, Y=${this.cameraRotation.y}, Z=${this.cameraRotation.z}`);
  }

  animate() {
    // requestAnimationFrame(() => this.animate());
    // if (this.setLightsMode) {
    //   this.controls.update();
    // }
    // this.renderer.render(this.scene, this.camera);

    const clock = new THREE.Clock();

    const animateGeometry = () => {
      const elapsedTime = clock.getElapsedTime()/10;

      // Update animation objects
      // this.groupOfObjects.rotation.x = elapsedTime;
      this.groupOfObjects.rotation.y = -elapsedTime;
      // this.groupOfObjects.rotation.z = elapsedTime;

      // Render
      this.renderer.render(this.scene, this.camera);

      // Call animateGeometry again on the next frame
      window.requestAnimationFrame(animateGeometry);
    };

    animateGeometry();

  }

  private fitCameraToObjects(group: THREE.Group,numberInRow: number, heightOfPanel: number, widthOfPanel: number, panelsNumber: number) {
    this.camera.position.set(this.cameraPosition.x,this.cameraPosition.y,this.cameraPosition.z);
    const rows = (panelsNumber + numberInRow - 1) / numberInRow;
    const heightOfObject = rows * heightOfPanel;
    const widthOfObject = widthOfPanel * Math.min(panelsNumber, numberInRow);
    const maxSize = Math.max(widthOfObject, heightOfObject);
    const size = 2 / maxSize;
    group.scale.set(size, size, size);
    this.camera.updateProjectionMatrix();
    if (this.controls) {
      this.controls.update();
    }
  }

  private addTransparentGround() {
    // Ground - transparent plane to catch shadows
    const groundGeometry = new THREE.PlaneGeometry(500, 500);

    // Set material to transparent with visible shadows
    const groundMaterial = new THREE.ShadowMaterial({
      opacity: 0.35, // Shadow transparency
    });

    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    this.groupOfObjects.add(ground);
    // this.scene.add(ground);
  }

  private loadHdrEnv() {
    this.hdrLoader.load('/medieval_cafe_1k.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.environment = texture;
    });
  }

}
