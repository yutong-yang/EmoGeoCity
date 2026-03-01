const container_infobox = document.querySelector('.info-box');
const containerWidth = container_infobox.offsetWidth;
const containerHeight = container_infobox.offsetHeight;

const svg_infobox = d3.select('.info-box')
    .append('svg')
    .attr('width', containerWidth)
    .attr('height', containerHeight);


n = 5
aaa = containerHeight / (n+1)

// 绘制大圆圈
svg_infobox.append('circle')
    .attr('cx', containerWidth / 8)
    .attr('cy', aaa +1)
    .attr('r', 5)
    // .style('stroke', 'black')
    .style('fill', current_mode_color.emotion_negative)
    .style('opacity', 0.5);

// 绘制文本
svg_infobox.append('text')
    .attr('x', (containerWidth / 4) + 25)
    .attr('y', aaa + 5)
    .text('Location')
    .style('font-size', '12px');

// // 绘制线条
// svg_infobox.append('line')
//     .attr('x1', (containerWidth / 8) - 10)
//     .attr('y1', aaa * 2)
//     .attr('x2', (containerWidth / 8) + 10)
//     .attr('y2', aaa * 2)
//     .style('stroke', 'red')
//     .style('opacity', 0.5)
//     .style('stroke-width', '2px')
const lines = 5;
const angle = Math.PI / lines;
const lineLength = 15; // 线条长度
const x1 = (containerWidth / 8) - lineLength / 2;
const y1 = aaa * 2;
const x2 = (containerWidth / 8) + lineLength / 2;
const y2 = aaa * 2 + 2;
const cx = (x1 + x2) / 2;
const cy = (y1 + y2) / 2;

// 定义颜色比例尺
// const colorScale_info = d3.scaleLinear()
//     .domain([0, lines - 1])
//     .range(['blue', 'red']);
const colorScale_info = d3.scaleThreshold()
    .domain([lines / 2])
    // .range(['blue', 'red']);
    .range([current_mode_color.emotion_negative, current_mode_color.emotion_positive]);

for (let i = 0; i < lines; i++) {
    const x1r = cx + (x1 - cx) * Math.cos(angle * i) - (y1 - cy) * Math.sin(angle * i);
    const y1r = cy + (x1 - cx) * Math.sin(angle * i) + (y1 - cy) * Math.cos(angle * i);
    const x2r = cx + (x2 - cx) * Math.cos(angle * i) - (y2 - cy) * Math.sin(angle * i);
    const y2r = cy + (x2 - cx) * Math.sin(angle * i) + (y2 - cy) * Math.cos(angle * i);

    svg_infobox.append('line')
        .attr('x1', x1r)
        .attr('y1', y1r)
        .attr('x2', x2r)
        .attr('y2', y2r)
        .style('stroke', colorScale_info(i))
        .style('opacity', 0.35)
        .style('stroke-width', '2px');
}


// 绘制文本
svg_infobox.append('text')
    .attr('x', (containerWidth / 4) + 25)
    .attr('y', aaa * 2 + 5)
    .text('Work')
    .style('font-size', '12px');

// 绘制小圆圈
svg_infobox.append('circle')
    .attr('cx', containerWidth / 8)
    .attr('cy', (aaa * 3) + 1)
    .attr('r', 3)
    // .style('stroke', 'black')
    .style('fill', current_mode_color.event)
    .style('opacity', 0.6);

// 绘制文本
svg_infobox.append('text')
    .attr('x', (containerWidth / 4) + 25)
    .attr('y', (aaa * 3) + 5)
    .text('Event')
    .style('font-size', '12px');

// 定义颜色和透明度比例尺
let colorScale_info_bar = d3.scaleThreshold()
    .domain([0.5])
    // .range(["blue", "red"]);
    .range([current_mode_color.emotion_negative, current_mode_color.emotion_positive]);

let opacityScale_info_bar = d3.scaleLinear()
    .domain([0, 0.5, 1])
    .range([0.8, 0.1, 0.8]);

// 创建第一个矩形的渐变
var gradient_info1 = svg_infobox.append("defs")
  .append("linearGradient")
  .attr("id", "gradient_info1")
  .attr("x1", "0%")
  .attr("y1", "0%")
  .attr("x2", "100%")
  .attr("y2", "0%");

gradient_info1.append("stop")
  .attr("offset", "0%")
  .attr("stop-color", colorScale_info_bar(0))
  .attr("stop-opacity", opacityScale_info_bar(0));

gradient_info1.append("stop")
  .attr("offset", "100%")
  .attr("stop-color", colorScale_info_bar(0))
  .attr("stop-opacity", opacityScale_info_bar(0.5));

// 创建第二个矩形的渐变
var gradient_info2 = svg_infobox.append("defs")
  .append("linearGradient")
  .attr("id", "gradient_info2")
  .attr("x1", "0%")
  .attr("y1", "0%")
  .attr("x2", "100%")
  .attr("y2", "0%");

gradient_info2.append("stop")
  .attr("offset", "0%")
  .attr("stop-color", colorScale_info_bar(1))
  .attr("stop-opacity", opacityScale_info_bar(0.5));

gradient_info2.append("stop")
  .attr("offset", "100%")
  .attr("stop-color", colorScale_info_bar(1))
  .attr("stop-opacity", opacityScale_info_bar(1));

// svg_infobox.append('text')
//   .attr('x', (containerWidth / 8)-10)
//   .attr('y', (aaa * 4))
//   .text('0')
//   .style('font-size', '12px');

// svg_infobox.append('text')
//   .attr('x', (containerWidth / 8 * 7) + 10)
//   .attr('y', (aaa * 4))
//   .text('1')
//   .attr('text-anchor', 'end')
//   .style('font-size', '12px');

// 使用渐变填充第一个矩形
svg_infobox.append("rect")
.attr('x', (containerWidth / 8)-10)
.attr('y', (aaa * 4) +4)
.attr('width', (containerWidth / 8 * 3) + 10)
.attr('height', '10')
.style('fill', 'url(#gradient_info1)');

// 使用渐变填充第二个矩形
svg_infobox.append("rect")
.attr('x', (containerWidth / 2))
.attr('y', (aaa * 4) + 4)
.attr('width', (containerWidth / 8 * 3) + 10)
.attr('height', '10')
.style('fill', 'url(#gradient_info2)');

svg_infobox.append('text')
  .attr('x', (containerWidth / 8)-10)
  .attr('y', (aaa * 4) -  6)
  .text('0')
  .attr('alignment-baseline', 'hanging')
  .style('font-size', '12px');

svg_infobox.append('text')
  .attr('x', (containerWidth / 8 * 7) + 10)
  .attr('y', (aaa * 4) -  6)
  .text('1')
  .attr('alignment-baseline', 'hanging')
  .attr('text-anchor', 'end')
  .style('font-size', '12px');

svg_infobox.append('text')
  .attr('x', (containerWidth / 8)-10)
  .attr('y', (aaa * 4) + 16)
  .text('Negative')
  .attr('alignment-baseline', 'hanging')
  .style('font-size', '12px');

svg_infobox.append('text')
  .attr('x', (containerWidth / 8 * 7) + 10)
  .attr('y', (aaa * 4) + 16)
  .text('Positive')
  .attr('alignment-baseline', 'hanging')
  .attr('text-anchor', 'end')
  .style('font-size', '12px');





// // 绘制文本
// svg_infobox.append('text')
//     .attr('x', (containerWidth / 8)-10-6)
//     .attr('y', (aaa * 4) +5)
//     .text('0')
//     .style('font-size', '12px');

// // 绘制文本
// svg_infobox.append('text')
//     .attr('x', (containerWidth / 8) + 10 + 4)
//     .attr('y', (aaa * 4) + 5 )
//     .text('1')
//     .style('font-size', '12px');

// 绘制文本
// svg_infobox.append('text')
//     .attr('x', (containerWidth / 4) + 25)
//     .attr('y', (aaa * 4) + 5)
//     .text('0 Negative - 1 Positive')
//     .style('font-size', '12px');


// 封装一下生成右侧信息栏的函数
const generate_info_container = async function (location_name) {
    if (location2obj == null) {
        let json = await new Promise(resolve => {
            resolve(d3.json('json/en/location2obj.json'));
        })
        location2obj = json;
    }
    if (dynasty_keywords == null) {
        let json = await new Promise(resolve => {
            resolve(d3.json('json/en/dynasty_keywords.json'));
        })
        dynasty_keywords = json;
    }
    let infoContainer = document.getElementById("info-container"); // 获取父元素
    infoContainer.innerHTML = ""; // 清空父元素中的内容
    // 在info横向显示（英文适用）-优化
    let nameElement = document.createElement("div"); // 创建一个新的 div 元素
    nameElement.textContent = location2obj[location_name]['地名']; // 设置 div 元素的文本内容
    nameElement.style.fontSize = "20px"; // 设置 div 元素的字体大小
    nameElement.style.fontWeight = "bold"; // 设置 div 元素的字体粗细
    nameElement.style.color = "black"; // 设置 div 元素的字体颜色
    nameElement.style.opacity = "0.8"; // 设置 div 元素的字体颜色
    nameElement.style.textAlign = "center"; // 设置 div 元素的文本对齐方式
    infoContainer.appendChild(nameElement); // 将 div 元素附加到父元素中

    let typeElement = document.createElement("div"); // 创建一个新的 div 元素
    typeElement.textContent = "「Category」" + location2obj[location_name]['地名类别']; // 设置 div 元素的文本内容
    typeElement.style.fontSize = "13px"; // 设置 div 元素的字体大小
    typeElement.style.color = "black"; // 设置 div 元素的字体颜色
    typeElement.style.opacity = "0.8"; // 设置 div 元素的字体颜色
    infoContainer.appendChild(typeElement); // 将 div 元素附加到父元素中

    let dysElement = document.createElement("div"); // 创建一个新的 div 元素
    dysElement.textContent = "「Dynasty」" + location2obj[location_name]['朝代']; // 设置 div 元素的文本内容
    dysElement.style.fontSize = "13px"; // 设置 div 元素的字体大小
    dysElement.style.color = "black"; // 设置 div 元素的字体颜色
    dysElement.style.opacity = "0.8"; // 设置 div 元素的字体颜色
    infoContainer.appendChild(dysElement); // 将 div 元素附加到父元素中

    let infoElement = document.createElement("div"); // 创建一个新的 div 元素
    infoElement.textContent = "「Intro」" + location2obj[location_name]['地名描述']; // 设置 div 元素的文本内容
    infoElement.style.fontSize = "13px"; // 设置 div 元素的字体大小
    infoElement.style.color = "black"; // 设置 div 元素的字体颜色
    infoElement.style.opacity = "0.8"; // 设置 div 元素的字体颜色
    infoContainer.appendChild(infoElement); // 将 div 元素附加到父元素中


    // 折线
    let dynasties = ['Eastern Wu', 'Jin', 'Southern Dynasties', 'Tang', 'Southern Tang', 'Song', 'Yuan', 'Ming', 'Qing', 'Modern'];
    let scores = [];
    for (let i = 0; i < dynasties.length; i++) {
        let dynasty = dynasties[i];
        let score = dynasty_keywords[dynasty][location_name]['until_average_score'];
        scores.push(score);
    }

    // 获取折线图元素
    let lineChart = document.querySelector(".line-chart");

    // 检查折线图元素是否存在
    if (lineChart) {
        // 清空折线图元素
        lineChart.innerHTML = "";
    } else {
        // 在 .info-container 元素中添加一个新的 div 元素
        lineChart = document.createElement("div");
        lineChart.className = "line-chart";
        infoContainer.appendChild(lineChart);
    }

    // 设置画布大小和边距
    let infoContainerWidth = infoContainer.offsetWidth;
    let margin = { top: 15, right: 10, bottom: 5, left: 10 };
    let width = infoContainerWidth * 0.9 - margin.left - margin.right;
    let height = 30;

    // 定义 x 和 y 比例尺
    let x = d3.scaleLinear()
        .domain([0, scores.length - 1])
        .range([0, width]);

    let y = d3.scaleLinear()
        .domain([0, d3.max(scores)])
        .range([height, 0]);

    // 定义折线生成器
    let line = d3.line()
        .defined(function (d) { return d !== 0; }) // 添加这一行
        .x(function (d, i) { return x(i); })
        .y(function (d) { return y(d); });

    // 创建 SVG 元素
    let svg = d3.select(lineChart).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let colorScale_zhexian = d3.scaleLinear()
        .domain([0, 1])
        .range(["rgba(106 ,159 ,147, .4)", "rgba(106 ,159 ,147 ,1)"]);

    let opacityScale_zhexian = d3.scaleLinear()
        .domain([0, 0.5, 1])
        .range([0.8, 0.1, 0.8]);

    // 创建一个线性渐变
    let gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", x(0)).attr("y1", y(0))
        .attr("x2", x(scores.length - 1)).attr("y2", y(d3.max(scores)))
        .selectAll("stop")
        .data(scores)
        .enter().append("stop")
        .attr("offset", function (d, i) { return i / (scores.length - 1); })
        .attr("stop-color", function (d) { return colorScale(d); })
        .attr("stop-opacity", function (d) { return 0.5 * opacityScale(d); });

    // 添加折线
    svg.append("path")
        .datum(scores)
        .attr("fill", "none")
        .attr("stroke", "url(#gradient)")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    // 为每个数据点添加文本标签
    let labels = svg.selectAll("text")
        .data(scores)
        .enter().append("text")
        .attr("x", function (d, i) {
            if (i === scores.length - 1) {
                // 将最后一个数据点的文本标签显示在左侧
                return x(i) - 60;
            }
            else if (i === scores.length - 2) {
                // 将最后一个数据点的文本标签显示在左侧
                return x(i) - 20;
            }
            else {
                return x(i);
            }
        })
        .attr("y", function (d) { return y(d) - 5; })
        .text(function (d, i) { return dynasties[i] + ": " + d.toFixed(3); })
        .style('font-family', 'JinlingXi')
        .style('font-size', '12px')
        .style('opacity', 0);


    // 为每个数据点添加圆形元素
    find_location_eventwork_num(location2obj[location_name]['地名id']).then(num_list => {
        // console.log(num_list.filter(d => d > 0));
        let circle_r_scale = d3.scaleLinear().domain(d3.extent(num_list.filter(d => d > 0))).range([2, 6]);

        let colorScale = d3.scaleThreshold()
            .domain([0.5])
            .range([current_mode_color.emotion_negative, current_mode_color.emotion_positive]);

        let opacityScale = d3.scaleLinear()
            .domain([0, 0.5, 1])
            .range([0.8, 0.1, 0.8]);

        let circles = svg.selectAll("circle")
            .data(scores)
            .enter().append("circle")
            .attr("cx", function (d, i) { return x(i); })
            .attr("cy", function (d) { return y(d); })
            .attr("r", function (d, i) {
                if (num_list[i] === 0) {
                    return 0;
                } else {
                    return circle_r_scale(num_list[i]);
                }
            })
            .style('opacity', function (d) {
                if (d === 0) {
                    return 0.4;
                } else {
                    return opacityScale(d);
                }
            })
            .style('fill', function (d) {
                if (d === 0) {
                    return "gray";
                } else {
                    return colorScale(d);
                }
            });

        // 为圆形元素添加鼠标事件监听器
        circles.on('mouseover', function (e, d) {
            let i = scores.indexOf(d);
            // 当鼠标悬停在一个圆形元素上时，显示对应的文本标签，并隐藏最大值的文本标签
            d3.select(labels.nodes()[i]).style('opacity', 0.8);
            maxScoreText.style('opacity', 0);
        })
            .on('mouseout', function (e, d) {
                let i = scores.indexOf(d);
                // 当鼠标离开一个圆形元素时，隐藏对应的文本标签，并显示最大值的文本标签
                d3.select(labels.nodes()[i]).style('opacity', 0);
                maxScoreText.style('opacity', 0.8);
            });
    })

    // // 为每个数据点添加三角形元素
    // let triangles = svg.selectAll("path.diamond")
    // .data(scores)
    // .enter().append("path")
    // .attr("class", "triangle")
    // .attr("d", d3.symbol().type(d3.symbolDiamond).size(20))
    // .attr("transform", function(d, i) { return "translate(" + x(i) + "," + y(d) + ")"; })
    // .style('opacity', 0.9)
    // .style('fill', colorScale_zhexian(d3.max(scores)))

    // // 为三角形元素添加鼠标事件监听器
    // triangles.on('mouseover', function(d, i) {
    //     d3.select(labels.nodes()[i]).style('opacity', 0.8);
    // })
    // .on('mouseout', function(d, i) {
    //     d3.select(labels.nodes()[i]).style('opacity', 0);
    // });

    // // 添加 y 轴最大值和最小值
    // let maxScoreText = svg.append("text")
    //     .attr("x", 0)
    //     .attr("y", y(d3.max(scores)))
    //     .text(d3.max(scores).toFixed(3))
    //     .style('font-family', 'JinlingXi')
    //     .style('font-size', '12px')
    //     .style('opacity', 0.8);

    // // 找到最大值对应的x坐标
    // let maxX = x(scores.indexOf(d3.max(scores)));

    // // 定义线生成器
    // let lineGenerator = d3.line()
    //     .x(function(d) { return d[0]; })
    //     .y(function(d) { return d[1]; });

    // // 添加线
    // svg.append("path")
    //     .datum([[maxX, y(d3.max(scores))], [0, y(d3.max(scores))]])
    //     .attr("fill", "none")
    //     .attr("stroke", "black") // 设置颜色为绿色
    //     .attr("stroke-width", 1)
    //     .attr("stroke-dasharray", "2,2") // 设置为虚线
    //     .attr("stroke-opacity", 0.2) // 设置透明度为0.3
    //     .attr("d", lineGenerator);

    // 找到最大值对应的x坐标
    let maxX = x(scores.indexOf(d3.max(scores)));
    // 添加 y 轴最大值
    let maxScoreText = svg.append("text")
        .attr("x", maxX - 12) // 将x坐标设置为最大值对应的x坐标
        .attr("y", y(d3.max(scores)) - 5) // 将y坐标设置为最大值对应的y坐标，并向上偏移5个单位
        .text(d3.max(scores).toFixed(3))
        .style('font-family', 'JinlingXi')
        .style('font-size', '12px')
        .style('opacity', 0.8);



    // svg.append("text")
    //     .attr("x", 0)
    //     .attr("y", y(0))
    //     .text(0);

    // chart2_wc和chart2_list的位置根据info-container 的高度决定
    let chart4Wc = document.querySelector(".chart2_wc");
    let chart4List = document.querySelector(".chart2_list");

    let infoContainerHeight = infoContainer.offsetHeight;
    let chart4WcTop = infoContainerHeight + 10; // 根据 #info-container 元素的高度计算 .chart4_wc 元素的 top 值
    let chart4ListTop = chart4WcTop + chart4Wc.offsetHeight + 10; // 根据 .chart4_wc 元素的 top 值和高度计算 .chart4_list 元素的 top 值

    chart4Wc.style.top = chart4WcTop + "px"; // 设置 .chart4_wc 元素的 top 值
    chart4List.style.top = chart4ListTop + "px"; // 设置 .chart4_list 元素的 top 值


    let infochart4 = document.querySelector(".chart4");
    let infochart4Height = infochart4.offsetHeight;
    let chart4ListHeight = infochart4Height - chart4ListTop; // 根据 #info-container 元素的高度和 .chart4_list 元素的 top 值计算 .chart4_list 元素的高度

    chart4List.style.height = chart4ListHeight + "px"; // 设置 .chart4_list 元素的高度

    location_change(location_name);
}


// 地点查询
let location2obj = null;
let dynasty_keywords = null
let location_search_input = document.getElementById('location-search-input');
location_search_input.oninput = async function(){
    let autocomplete_box =  d3.select('.location-search-autocomplete-box');
    autocomplete_box.html('');
    let value = location_search_input.value;
    if(value == ''){
        return;
    }
    if(location2obj == null){
        let json = await new Promise(resolve => {
            resolve(d3.json('json/en/location2obj.json'));
        })
        location2obj = json;
    }
    if(dynasty_keywords == null){
        let json = await new Promise(resolve => {
            resolve(d3.json('json/en/dynasty_keywords.json'));
        })
        dynasty_keywords = json;
    }
    for(let location_name in location2obj){
        if(location_name.toLowerCase().includes(value.toLowerCase())){
            autocomplete_box.append('div')
                .text(location_name)
                .on('click', ()=>{
                    location_search_input.value = location_name;
                    autocomplete_box.html('');
                    let location_id = location2obj[location_name]['地名id'];
                    // 视图联动——————图谱、地图
                    window.postMessage({ type: "HIGHLIGHT_LOCATION", locationName: location_name }, "*");
                    draw_knowledge_map_by('location', location_id);
                    // 视图联动——————右边的info
                    generate_info_container(location_name);
                })
        }
    }
}

// 事件重要性得分筛选
let slider_width = $('.select-box').width() * 0.8;
$('.range-slider').jRange({
    from: 0,
    to: 10,
    step: 1,
    scale: [],
    theme: 'theme-jinling',
    format: '%s',
    width: slider_width,
    showLabels: true,
    isRange : true,
    onstatechange: function(){
        let range_value = new Object();
        range_value.low = parseFloat(d3.select('.event-score-slider').select('.slider-container').select('.pointer-label.low').text());
        range_value.high = parseFloat(d3.select('.event-score-slider').select('.slider-container').select('.pointer-label.high').text());
        update_knowledge_map_by_dynasty_event_score('default', range_value)
    }
});
