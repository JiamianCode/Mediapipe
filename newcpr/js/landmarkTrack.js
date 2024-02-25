//高斯平滑
function gaussianSmooth(dataY, sigma = 2) {
    // 此处假设dataY是包含y值的数组
    const gaussKernel = [];
    let kernelSize = Math.ceil(sigma * 3) * 2 + 1;
    let kernelHalf = Math.floor(kernelSize / 2);
    let sum = 0;

    for (let i = -kernelHalf; i <= kernelHalf; i++) {
        let value = Math.exp(-(i * i) / (2 * sigma * sigma));
        gaussKernel.push(value);
        sum += value;
    }

    // 归一化高斯核
    const normalizedKernel = gaussKernel.map(val => val / sum);

    return dataY.map((_, idx) => {
        let weightedSum = 0;
        let weightSum = 0;
        for (let i = -kernelHalf; i <= kernelHalf; i++) {
            let dataIndex = idx + i;
            if (dataIndex >= 0 && dataIndex < dataY.length) {
                weightedSum += dataY[dataIndex] * normalizedKernel[i + kernelHalf];
                weightSum += normalizedKernel[i + kernelHalf];
            }
        }
        return weightedSum / weightSum;
    });
}

//更新图表
function updateLandmarkTrackChart(targetIndex, chartName) {
    const svg = d3.select(chartName);
    const margin = { top: 40, right: 30, bottom: 20, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    svg.selectAll("*").remove();

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // 从keypointPositions筛选出最新的50个对应targetIndex的数据点
    const filteredPositions = keypointPositions
        .filter(pos => pos.index === targetIndex)
        .slice(-50); // 保留最后50个元素

    // 提取y值数组
    const yValues = filteredPositions.map(pos => pos.y);
    const smoothedYValues = gaussianSmooth(yValues);

    const xScale = d3.scaleLinear()
        .domain([0, smoothedYValues.length - 1])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        //.domain([Math.min(...smoothedYValues), Math.max(...smoothedYValues)])
        .domain([0.5, 1])
        .range([height, 0]);

    const line = d3.line()
        .x((_, i) => xScale(i))
        .y(d => yScale(d));

    chart.append("path")
        .datum(smoothedYValues)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    chart.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    chart.append("g")
        .call(d3.axisLeft(yScale));

    svg.append("text")
        .attr("x", (width / 2) + margin.left)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Wrist Position Over Time");
}

// 平滑、寻找极大值和计算频率
function calculateFrequency(index,maxPeaksToConsider = 5) {
    // 从keypointPositions中筛选指定关键点的数据
    const filteredPositions = keypointPositions.filter(pos => pos.index === index);
    // 提取y值和时间戳
    const yValues = filteredPositions.map(pos => pos.y);
    const timestamps = filteredPositions.map(pos => pos.time);

    // 应用高斯平滑
    const smoothedYValues = gaussianSmooth(yValues);

    // 寻找极大值
    let peaks = [];
    for (let i = 1; i < smoothedYValues.length - 1; i++) {
        if (smoothedYValues[i] > smoothedYValues[i - 1] && smoothedYValues[i] > smoothedYValues[i + 1]) {
            peaks.push({ time: timestamps[i], value: smoothedYValues[i] });
        }
    }

    // 仅考虑最新的若干个极大值
    const recentPeaks = peaks.slice(-maxPeaksToConsider);

    // 计算震动频率
    if (recentPeaks.length > 1) {
        const duration = (recentPeaks[recentPeaks.length - 1].time - recentPeaks[0].time) / 1000; // 秒
        const frequency = (recentPeaks.length - 1) / duration; // 频率（Hz）

        // 保留两位小数并转换为数字类型
        return Number(frequency.toFixed(2));
    }

    return 0; // 如果没有足够的极大值来计算频率，返回0
}
