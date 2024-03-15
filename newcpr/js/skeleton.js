const skeletonContainer = document.getElementById('skeletonContainer');
const skeleton3D = document.getElementById('skeleton3D');
skeleton3D.style.width = skeletonContainer.offsetWidth + 'px';
skeleton3D.style.height = skeletonContainer.offsetWidth + 'px';

const myChart = echarts.init(skeleton3D, null, {
    renderer: 'canvas', // 使用 canvas 渲染器
    useDirtyRect: false // 关闭脏矩形优化，确保全画布更新
});
/*
// POSE_CONNECTIONS定义的所有线条
const lineSeries = POSE_CONNECTIONS.map(() => ({
    type: 'line3D',
    lineStyle: {
        width: 4 // 设置线条的宽度
    },
    data: [] // 初始时不包含数据
}));
*/
// 假设 POSE_CONNECTIONS 定义了所有线条连接的点的索引
// 过滤掉与前10个点相关的连线
const filteredConnections = POSE_CONNECTIONS.filter(connection => {
    // connection 是一个包含两个点索引的数组
    // 检查两个点的索引是否都大于等于10
    return connection[0] > 9 && connection[1] > 9;
});

// 根据过滤后的连线创建 lineSeries
const lineSeries = filteredConnections.map(() => ({
    type: 'line3D',
    lineStyle: {
        width: 4 // 设置线条的宽度
    },
    data: [] // 初始时不包含数据
}));


// 初始echarts配置
const option = {
    tooltip: {},
    backgroundColor: '#fff',
    visualMap: { // 视觉映射组件，用于数据的颜色映射
        show: false, // 不显示视觉映射组件
        dimension: 2, // 指定映射的维度，这里是 z 轴
        min: 0, // 数据最小值
        max: 1, // 数据最大值
        inRange: { // 数据在选定范围内时的颜色
            color: [
                '#313695','#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf',
                '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'
            ]
        }
    },
    xAxis3D: {
        type: 'value',
        min: 0,
        max: 1,
        axisLabel: {show: false}, // 不显示坐标轴的标签
        axisTick: {show: false}, // 不显示坐标轴刻度
        name: '' // 不显示坐标轴名称
    },
    yAxis3D:{
        type: 'value',
        min: 0,
        max: 1,
        axisLabel: {show: false}, // 不显示坐标轴的标签
        axisTick: {show: false}, // 不显示坐标轴刻度
        name: '' // 不显示坐标轴名称
    },
    zAxis3D:{
        type: 'value',
        min: 0,
        max: 1,
        axisLabel: {show: false}, // 不显示坐标轴的标签
        axisTick: {show: false}, // 不显示坐标轴刻度
        name: '' // 不显示坐标轴名称
    },
    // 3D 网格配置
    grid3D: {
        // 视图控制组件
        viewControl: {
            projection: 'perspective', // 设置为透视投影
            rotateSensitivity: 1,
            zoomSensitivity: 1,
            panSensitivity: 1,
            autoRotate: false    // 图表会绕着 z 轴自动旋转
        }
    },
    // 系列列表
    series: [{
        type: 'scatter3D',
        data: []
    }].concat(lineSeries) // 散点图系列加上所有的线条系列
};

// 应用配置项
if (option && typeof option === 'object') {
    myChart.setOption(option);
}


function updateData(results) {
    if(!(results && results.poseLandmarks)) return;

    // 保存当前的视图控制状态
    var currentOption = myChart.getOption();
    var viewControl = currentOption.grid3D[0].viewControl;
    var landmarks = results.poseLandmarks;
    /*
    // 关键点数据
    var scatterData = landmarks.map(lm => [lm.x, lm.z/2+0.5, -lm.y+1]);
    var seriesUpdate = [{
        type: 'scatter3D',
        data: stterData
    }];

    // 连线数据：为每个line3D系列更新数据
    POSE_CONNECTIONS.forEach((connection, index) => {
        seriesUpdate.push({
            type: 'line3D',
            // 指定需要更新的系列索引，跳过第一个散点图系列
            seriesIndex: index + 1,
            data: [
                [landmarks[connection[0]].x, landmarks[connection[0]].z/2+0.5, -landmarks[connection[0]].y+1],
                [landmarks[connection[1]].x, landmarks[connection[1]].z/2+0.5, -landmarks[connection[1]].y+1]
            ]
        });
    });
    */
    // 第0个关键点的数据，单独作为一个系列
    var firstPointData = [[landmarks[0].x, landmarks[0].z/2+0.5, -landmarks[0].y+1]];

    // 第11个及之后的关键点的数据，作为另一个系列
    var otherPointsData = landmarks.slice(11).map(lm => [lm.x, lm.z/2+0.5, -lm.y+1]);

    var scatterData=[...firstPointData,...otherPointsData];
    // 系列更新数组
    var seriesUpdate = [
        {
            // 第0个关键点的系列
            type: 'scatter3D',
            data: firstPointData,
            symbolSize: 20, // 为第0个关键点单独设置较大的大小
        },
        {
            // 第11个及之后关键点的系列
            type: 'scatter3D',
            data: otherPointsData,
            symbolSize: 10, // 为其他关键点设置默认大小，可以根据需要调整
        }
    ];

    POSE_CONNECTIONS.forEach((connection, index) => {
        // 检查连接的两个点的索引是否都大于9
        if (connection[0] > 9 && connection[1] > 9) {
            seriesUpdate.push({
                type: 'line3D',
                // 由于过滤了部分连接，seriesIndex可能需要根据实际保留的连线数量进行调整
                // 这里的处理方式依赖于你如何组织line3D系列，因此可能需要根据实际情况调整索引计算方式
                seriesIndex: index + 1, // 假设第一个系列不是line3D，调整seriesIndex以匹配正确的系列
                data: [
                    [landmarks[connection[0]].x, landmarks[connection[0]].z / 2 + 0.5, -landmarks[connection[0]].y + 1],
                    [landmarks[connection[1]].x, landmarks[connection[1]].z / 2 + 0.5, -landmarks[connection[1]].y + 1]
                ]
            });
        }
    });

    // 计算z轴的最大值和最小值
    let zValues = scatterData.map(point => point[2]);
    let zMin = Math.min(...zValues);
    let zMax = Math.max(...zValues);

    // 更新echarts实例的配置，设置散点图数据和连接线数据
    // 同时应用之前保存的视图控制状态
    myChart.setOption({
        visualMap: {
            min: zMin, // 使用计算出的最小值
            max: zMax, // 使用计算出的最大值
        },
        grid3D: {
            viewControl: viewControl
        },
        series: seriesUpdate
    });
}
