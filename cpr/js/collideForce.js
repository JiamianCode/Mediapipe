const poseCanvas = document.getElementById('poseCanvas');
const context = poseCanvas.getContext('2d');
// 设置canvas的宽高
const width = 800;
const height = 800;
// 注意修改的时候要对应修改生成的data

let nodes = null;
let color = null;

// 预加载图片
let nodeImage = new Image();
nodeImage.src = 'img/hand.png'; // 替换为你的图片路径
nodeImage.onload = function() {
    // 图片加载完成后，可以执行相关的绘制操作或初始化
    // 例如，你可能需要在这里调用 initSimulation() 函数
};

// 后续添加控制逻辑来初始化
initSimulation();

function initSimulation(){
    poseCanvas.width = width;
    poseCanvas.height = height;

    // 生成节点数据
    // 使用自执行函数立即生成数据
    const data = (() => {
        const k = width / 200; // 定义节点大小的基础值
        const r = d3.randomUniform(k, k * 4); // 定义随机半径的范围
        const n = 4; // 分组数量
        // 生成200个节点数据，每个节点带有随机半径和分组信息
        return Array.from({length: 200}, (_, i) => ({r: r(), group: i && (i % n + 1)}));
    })();

    color = d3.scaleOrdinal(d3.schemeTableau10); // 定义一个颜色比例尺
    nodes = data.map(Object.create); // 从数据中创建节点

    // 设置力模拟
    // 可以后续调整力效果用
    const simulation = d3.forceSimulation(nodes)
        .alphaTarget(0.3) // 设置冷却率，使得模拟持续进行而不会太快停止
        .velocityDecay(0.1) // 设置速度衰减率，模拟低摩擦环境
        .force("x", d3.forceX().strength(0.01)) // x轴向中心的力
        .force("y", d3.forceY().strength(0.01)) // y轴向中心的力
        .force("collide", d3.forceCollide().radius(d => d.r + 1).iterations(3)) // 碰撞力，避免节点重叠
        .force("charge", d3.forceManyBody().strength((d, i) => i ? 0 : -width * 2 / 3)) // 节点间的排斥或吸引力
        .on("tick", ticked); // 每个“tick”（时间间隔）时执行的函数
}

// 更新仿真环境
function updateSimulationWithPose(results,index) {
    if (results.poseLandmarks && results.poseLandmarks[index]) {
        const landmark = results.poseLandmarks[index];
        // 更新交互点位置，传递归一化坐标
        updateInteractionPoint(landmark.x, landmark.y);
    }
}
// 根据Pose关键点更新交互点位置
function updateInteractionPoint(normalizedX, normalizedY) {
    // 归一化坐标转换为canvas坐标
    const x = normalizedX * width - width / 2;
    const y = normalizedY * height - height / 2;

    // 假设我们更新的是仿真中的一个特定节点，例如nodes[0]
    nodes[0].fx = x*0.8;
    nodes[0].fy = y*3;

    // 这里不需要调用仿真的tick函数或强制更新，
    // 因为d3的仿真会在下一个tick自动应用这些变化
}

function ticked() {
    context.clearRect(0, 0, width, height); // 清除画布
    context.save(); // 保存当前绘图状态
    context.translate(width / 2, height / 2); // 将绘图原点移到画布中心

    // 在nodes[0]的位置绘制方形
    // if(nodes && nodes.length > 0) {
    //     const squareSize = 20; // 方形的边长
    //     const d = nodes[0];
    //     context.beginPath(); // 开始新路径
    //     // 计算方形的左上角坐标，以使方形中心与节点位置对齐
    //     const squareX = d.x - squareSize / 2;
    //     const squareY = d.y - squareSize / 2;
    //     context.rect(squareX, squareY, squareSize, squareSize); // 绘制方形
    //     context.fillStyle = 'red'; // 设置填充颜色，这里使用红色作为示例
    //     context.fill(); // 填充方形
    // }

    // 在nodes[0]的位置绘制图片
    if(nodes && nodes.length > 0) {
        const d = nodes[0];
        // 假设图片的尺寸是固定的，你可以根据需要调整这些值
        const imgWidth = 40; // 图片的宽度
        const imgHeight = 40; // 图片的高度
        // 计算图片的左上角坐标，以使图片中心与节点位置对齐
        const imgX = d.x - imgWidth / 2;
        const imgY = d.y - imgHeight / 2;
        // 绘制图片
        context.drawImage(nodeImage, imgX, imgY, imgWidth, imgHeight);
    }

    // 绘制其余节点
    for (let i = 1; i < nodes.length; ++i) {
        const d = nodes[i];
        context.beginPath(); // 开始新路径
        context.moveTo(d.x + d.r, d.y); // 移动到起始点
        context.arc(d.x, d.y, d.r, 0, 2 * Math.PI); // 绘制圆形
        context.fillStyle = color(d.group); // 设置填充颜色
        context.fill(); // 填充路径
    }

    context.restore(); // 恢复之前保存的绘图状态
}