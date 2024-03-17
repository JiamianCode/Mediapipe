let containerChart11 = document.getElementById('containerChart11');
containerChart11.style.height = '300px';
containerChart11.style.width = containerChart11.offsetWidth+'px';

let hotData = [];

function updateHeatmap(){
    // 初始化一个空数组来存放转换后的数据
    let transformedData = [];

    // 遍历 hotData 数组
    hotData.forEach((columnData, columnIndex) => {
        // 遍历列中的每个值
        columnData.forEach((value, rowIndex) => {
            // 将每个值转换为热力图期望的格式 [rowIndex, columnIndex, value]
            transformedData.push([rowIndex, columnIndex,  +value.toFixed(1)]);
        });
    });

    const data = transformedData.map(function (item) {
        return [item[1], item[0], item[2] || '-'];
    });

    const option = {
        tooltip: {
            position: 'top'
        },
        grid: {
            height: '50%',
            top: '10%',
            left: '10%',
            right: '3%',
        },
        xAxis: {
            type: 'category',
            splitArea: {
                show: true
            }
        },
        yAxis: {
            type: 'category',
            data: ['angle1DiffRatio', 'angle2DiffRatio', 'angle3DiffRatio', 'frequencyDiffRatio'],
            splitArea: {
                show: true
            }
        },
        visualMap: {
            min: -2,
            max: 2,
            calculable: true,
            inRange:{
              color:[
                  '#313695',
                  '#4575b4',
                  '#74add1',
                  '#abd9e9',
                  '#e0f3f8',
                  '#ffffbf',
                  '#fee090',
                  '#fdae61',
                  '#f46d43',
                  '#d73027',
                  '#a50026'
              ]
            },
            orient: 'horizontal',
            left: 'center',
            bottom: '15%'
        },
        series: [{
            name: 'Punch Card',
            type: 'heatmap',
            data: data,
            label: {
                show: true
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };

    // 初始化图表
    var myChart = echarts.init(containerChart11);
    myChart.setOption(option);
}