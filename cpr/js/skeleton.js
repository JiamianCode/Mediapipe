// 获取包含three.js渲染器的div
const container = document.getElementById('pose-container');
container.style.width = '800px';
container.style.height = '600px';
// 创建场景
const scene = new THREE.Scene();

// 创建透视相机
const camera3d = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
// 调整相机位置以匹配Python图像的视角
camera3d.position.set(0, 0, 5);
camera3d.lookAt(new THREE.Vector3(0, 0, 0));

// 创建渲染器，并设置透明背景
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(container.offsetWidth, container.offsetHeight);
renderer.setClearColor(0x000000, 0);
container.appendChild(renderer.domElement);

// 初始化OrbitControls
const controls = new THREE.OrbitControls(camera3d, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

// 创建坐标轴帮助对象
const axesHelper = new THREE.AxesHelper(5);
axesHelper.material = new THREE.LineBasicMaterial({ color: 0x000000 });
scene.add(axesHelper);

// 创建一个组来存放关键点的球体和骨骼连线
const keypointsGroup = new THREE.Group();
scene.add(keypointsGroup);

// 添加网格辅助对象
const size = 10;
const divisions = 10;
const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

// 定义颜色映射
function generateColorMap(length) {
    const colors = [];
    for (let i = 0; i < length; i++) {
        const hue = (i / length) * 360;
        colors.push(new THREE.Color(`hsl(${hue}, 100%, 50%)`));
    }
    return colors;
}
const colormap = generateColorMap(33); // 假设有33个关键点

// 更新关键点的函数
function updateKeypoints(results) {
    // 清除现有关键点和骨骼
    while (keypointsGroup.children.length > 0) {
        const child = keypointsGroup.children[0];
        keypointsGroup.remove(child);
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
    }

    // 重新创建关键点的球体和骨骼连线
    results.poseLandmarks.forEach((keypoint, index) => {
        const color = colormap[index % colormap.length]; // 使用颜色映射

        // 创建球体几何体表示关键点
        const geometry = new THREE.SphereGeometry(0.05, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: color });
        const sphere = new THREE.Mesh(geometry, material);

        // 设置球体的位置
        sphere.position.x = keypoint.x - 0.5;
        sphere.position.y = keypoint.y - 0.5;
        sphere.position.z = keypoint.z - 0.5;

        // 将球体添加到组中
        keypointsGroup.add(sphere);
    });

    // 连接骨骼
    POSE_CONNECTIONS.forEach(connection => {
        const [index1, index2] = connection;
        const point1 = results.poseLandmarks[index1];
        const point2 = results.poseLandmarks[index2];

        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(point1.x - 0.5, point1.y - 0.5, point1.z - 0.5),
            new THREE.Vector3(point2.x - 0.5, point2.y - 0.5, point2.z - 0.5)
        ]);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        keypointsGroup.add(line);
    });

    // 更新渲染器
    renderer.render(scene, camera3d);
}

// 动画循环渲染函数
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera3d);
}
animate();
