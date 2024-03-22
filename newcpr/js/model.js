//注意模型的异步加载，使用时需要注意，不过操作带来的时间差可以忽略这个问题
let modelSession;
// 模型初始化，加载模型
async function initModel() {
    modelSession = new onnx.InferenceSession();
    await modelSession.loadModel("model/model.onnx");
}

async function updateModel(results) {
    // 创建一个数组来存储所有关键点的坐标
    const allPoints = [];

    // 将每个关键点的 x、y、z 坐标依次存入数组中
    results.poseLandmarks.forEach(point => {
        allPoints.push(point.x);
        allPoints.push(point.y);
        allPoints.push(point.z);
    });

    // 创建一个Float32Array来存储输入数据
    const inputData = new Float32Array(allPoints);
    // 创建一个tensor作为输入
    const inputTensor = new onnx.Tensor(inputData, "float32", [1, 99]); // 这里的维度[1, 99]应根据模型的具体输入需求调整

    // 运行模型
    const outputMap = await modelSession.run([inputTensor]);
    // 获取输出
    const outputData = outputMap.values().next().value.data;

    // 计算重构误差
    let mse = 0;
    for(let i = 0; i < inputData.length; i++) {
        mse += (inputData[i] - outputData[i]) ** 2;
    }
    mse /= inputData.length; // 除以特征数量得到均值

    // 更新页面显示
    // 在控制台输出mse的值和模型的输出结果
    console.log(`MSE: ${mse}`);
    //console.log(`Model Output: ${mse <= 0.026 ? `CPR` : `Non-CPR`}`);
    return mse <= 0.1 ? `CPR` : `Non-CPR`;
}

initModel().then(() => {
    console.log('model loaded');
}).catch(console.error);

