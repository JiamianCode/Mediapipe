let wristPositions = []; // 存储每一帧右手腕的位置
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
function updateChart() {
    const svg = d3.select("#chart1");
    const margin = {top: 40, right: 30, bottom: 20, left: 40};
    const width = 400 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    svg.selectAll("*").remove();

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // 提取y值数组
    const yValues = wristPositions.map(pos => pos.y);
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
