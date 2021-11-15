class App{
  constructor() {
    const divContainer = document.querySelector('#webgl-container');
    this._divContainer = divContainer;

    const renderer = new THREE.WebGL1Renderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    divContainer.appendChild(renderer.domElement);
    this._renderer = renderer;

    const scene = new THREE.Scene();
    this._scene = scene;

    this._setupCamera();
    this._setupLight();
    this._loadTexture();
    this._setupModel();
    this._setupControls();
    this._changeScene();

    window.onresize = this.resize.bind(this);
    this.resize();

    requestAnimationFrame(this.render.bind(this));
  }

  _setupCamera() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(
      100,
      width / height,
      0.1,
      1000
    );
    camera.position.z = 10;
    this._camera = camera;
    this._scene.add(camera);
  }
s
  _setupLight() {
    const color = [0xB6DFF3, 0xF5CECF];
    const intensity = 1;
    const light = new THREE.DirectionalLight(color[0], intensity);
    const light2 = new THREE.DirectionalLight(color[2], intensity);
    light.position.set(-2, 3, 4);
    light2.position.set(2, -2, -2);
    this._camera.add(light);
    this._camera.add(light2);
  }

  _setupControls() {
    new THREE.OrbitControls(this._camera, this._divContainer);
  }

  _loadTexture() {
    const textureLoader = new THREE.TextureLoader();

    const iceMap = textureLoader.load("./images/Blue_Ice_001_COLOR.jpg");
    const iceAO = textureLoader.load("./images/Blue_Ice_001_OCC.jpg");
    const iceNormal = textureLoader.load("./images/Blue_Ice_001_NORM.jpg");
    const iceRough = textureLoader.load("./images/Blue_Ice_001_ROUGH.jpg");
    const iceDisp = textureLoader.load("./images/Blue_Ice_001_DISP.png");

    const fabricMap = textureLoader.load("./images/Fabric_Alcantara_001_basecolor.jpg");
    const fabricAO = textureLoader.load("./images/Fabric_Alcantara_001_ambientOcclusion.jpg");
    const fabricNormal = textureLoader.load("./images/Fabric_Alcantara_001_normal.jpg");
    const fabricRough = textureLoader.load("./images/Fabric_Alcantara_001_roughness.jpg");
    const fabricDisp = textureLoader.load("./images/Fabric_Alcantara_001_height.png");

    const BGMap = textureLoader.load("./images/background.jpg");

    const iceMaterial = new THREE.MeshStandardMaterial({
      map: iceMap,
      normalMap: iceNormal,

      aoMap: iceAO,
      aoMapIntensity: 5,

      displacementMap: iceDisp,
      displacementScale: 0.1,
      // displacementBias: -,

      roughnessMap: iceRough,
      roughness: 0.5,
    });

    const fabricMaterial = new THREE.MeshStandardMaterial({
      map: fabricMap,
      normalMap: fabricNormal,

      aoMap: fabricAO,
      aoMapIntensity: 1,

      displacementMap: fabricDisp,
      displacementScale: 0.05,
      displacementBias: -0.019,

      roughnessMap: fabricRough,
      roughness: 0.9
    });

    const BGMaterial = new THREE.MeshBasicMaterial({
      map: BGMap,
      side: THREE.BackSide
    })

    this._iceMaterial = iceMaterial;
    this._fabricMaterial = fabricMaterial;
    this._BGMaterial = BGMaterial;
  }

  _setupModel() {
    const group = new THREE.Object3D();
    this._scene.add(group);

    const radius = 4;
    const widthSegments = 150;
    const heightSegments = 150;

    const backgroundBox = new THREE.SphereGeometry(200,30,30);
    const background = new THREE.Mesh(backgroundBox, this._BGMaterial);
    group.add(background);

    const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const iceSphere = new THREE.Mesh(sphereGeometry, this._iceMaterial);

    const boxGeometry = new THREE.BoxBufferGeometry(5, 5, 5, widthSegments, heightSegments);
    const iceBox = new THREE.Mesh(boxGeometry, this._fabricMaterial);


    const model = [iceSphere, iceBox];
    group.add(model[0]);
    this._group = group;
    this._model = model;
  }

  _changeScene() {
    const changeScenebtn = document.querySelector("button");
    let currentModel = changeScenebtn.value;
    changeScenebtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentModel === "box") {
        this._group.remove(this._model[0]);    
        this._group.add(this._model[1]);
        currentModel = "sphere";
      } else if (currentModel === "sphere") {
        this._group.remove(this._model[1]);      
        this._group.add(this._model[0]);
        currentModel = "box";
    }
    });
  }

  //버튼을 눌렀을 때 신이 변경 되어야 함
  //

  resize() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;

    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize(width, height);
  }

  render(time) {
    this._renderer.render(this._scene, this._camera);
    this.update(time);
    requestAnimationFrame(this.render.bind(this));
  }

  update(time) {
    time *= 0.001; //second unit
  }
}

window.onload = function () {
  new App();
}