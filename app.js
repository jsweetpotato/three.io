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
    this._setupModel();
    this._setupControls();

    window.onresize = this.resize.bind(this);
    this.resize();

    requestAnimationFrame(this.render.bind(this));
  }

  _setupCamera() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      100
    );
    camera.position.z = 7;
    this._camera = camera;
  }

  _setupLight() {
    const color = [0xfadf69, 0x0aafff];
    const intensity = 2;
    const light = new THREE.DirectionalLight(color[0], intensity);
    light.position.set(-1, 2, 4);
    this._scene.add(light);
  }

  _setupControls() {
    new THREE.OrbitControls(this._camera, this._divContainer);
  }

  // _setupModel() {
  //   const vertics = [];
  //   for (let i = 0; i < 10000; i++){
  //     const x = THREE.Math.randFloatSpread(8);
  //     const y = THREE.Math.randFloatSpread(8);
  //     const z = THREE.Math.randFloatSpread(8);

  //     vertics.push(x, y, z);
  //   }

  //   const geometry = new THREE.BufferGeometry();
  //   geometry.setAttribute(
  //     "position",
  //     new THREE.Float32BufferAttribute(vertics, 3)
  //   );

  //   const sprite = new THREE.TextureLoader().load("../examples/textures/sprites/ball.png")

  //   const material = new THREE.PointsMaterial({
  //     map: sprite,
  //     alphaTest: 1, //해당 값보다 클때만 렌더링
  //     color: 0x00ffff,
  //     size: 0.1,
  //     sizeAttenuation: true //원근감에 따른 크기변화 유무
  //   });

  //   const points = new THREE.Points(geometry, material);
  //   this._scene.add(points);
  // }

  // _setupModel() {
  //   const vertices = [
  //     -1, 1, 0, 1, 1, 0, -1, -1, 0, 1, -1, 0];
    
  //   const geometry = new THREE.BufferGeometry();
  //   geometry.setAttribute("position", new THREE.Float32Attribute(vertices, 3));

  //   const material = new THREE.LineDashedMaterial({
  //     color: 0x00ffff,
  //     dashSize: 0.2, //그려지는 선 길이
  //     gapSize: 0.1, //선 사이 간격
  //     scale: 1 //대쉬 영역 표현 배수
  //   })

  //   const line = new THREE.Line(geometry, material);
  //   line.computeLineDistances();//데쉬 라인으로 하려면 꼭 넣어야 함
  //   this._scene.add(line);
  // }

  _setupModel() {
    // 메쉬 베이직 매테리얼 - 광원에 영향을 받지 않음
    // const material = new THREE.MeshBasicMaterial({
    //   visible: true, //보일지 안보일지 정함
    //   transparent: true, //opacity값 사용 여부
    //   opacity: 0.5, //0 ~ 1까지 값, transparent를 true값으로 정해야지 사용 가능
    //   depthTest: false, //렌더링 되는 메쉬에 픽셀 위치의 z값을 depthBuffer 값을 이용해검사할지에 대한 여부
    //   depthWrite: false, //렌더링 되는 메쉬에 픽셀 위치의 z값을 depthBuffer값에 저장할 것인지 여부
    //   side: THREE.FrontSide, //렌더링 할 면 선택
    //   color: 0xffffff,
    //   wireframe: false
    // });

    // const material = new THREE.MeshLambertMaterial({
    //   transparent: true,
    //   opacity: 0.5,
    //   side:THREE.DoubleSide,
    //   color: 0x00ffff, //재질 색상 값
    //   emissive: 0x0000, //광원에 영향을 받지 않는 재질 자체에서 방출하는 색상 값
    //   wireframe:false
    // })

    //메쉬퐁매테리얼 -> 메쉬가 렌더링 되는 픽셀 단위로 광원에 영향을 계산하는 재질
    const material = new THREE.MeshPhongMaterial({
      color: 0x00ffff, //재질의 색상 값
      emissive: 0x0000, //다른 광원에 영향을 받지 않는 재질 자체에서 방출하는 색상값
      specular: 0xff0000, //광원에 의해서 반사되는 색상
      shininess: 10, //specular 강도
      flatShading: true, //메쉬를 평평하게 렌더링 할지 여부
      wireframe:false
    })

    const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
    box.position.set(-1, 0, 0);
    this._scene.add(box);

    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.6,32,32), material);
    sphere.position.set(1, 0, 0);
    this._scene.add(sphere);
  }

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
    time *= 0.001 //second unit
  }
}

window.onload = function () {
  new App();
}