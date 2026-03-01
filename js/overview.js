// let colorScale_overview = d3.scaleThreshold()
//     .domain([0.5])
//     .range(["blue", "red"]);//.range(["#6496bc", "#70896d"]);

let colorScale_overview = d3.scaleLinear()
    .domain([0, 1])
    .range([current_mode_color.wenti_pie_scale_low, current_mode_color.wenti_pie_scale_high]);

// let colorScale_overview = d3.scaleThreshold()
//     .domain([0.5])
//     .range(["blue", "red"]);//.range(["#6496bc", "#70896d"]);

let opacityScale_overview = d3.scaleLinear()
    .domain([0, 0.5, 1])
    .range([0.8, 0.1, 0.8]);

// 选择你想要添加SVG的div
var div = d3.select(".overview_grad");

// 在div中添加一个SVG元素
var svg_overview = div.append("svg")
    .attr("width", '100')
    .attr("height", '10');


// 创建一个线性渐变
var gradient_overview = svg_overview.append("defs")
  .append("linearGradient")
  .attr("id", "gradient_overview")
  .attr("x1", "0%")
  .attr("y1", "0%")
  .attr("x2", "100%")
  .attr("y2", "0%");

// 定义渐变的开始（使用颜色比例尺）
gradient_overview.append("stop")
  .attr("offset", "0%")
  .attr("stop-color", colorScale_overview(0))
  .attr("stop-opacity", opacityScale_overview(0));

// 定义渐变的结束（使用颜色比例尺）
gradient_overview.append("stop")
  .attr("offset", "100%")
  .attr("stop-color", colorScale_overview(1))
  .attr("stop-opacity", opacityScale_overview(1));

// 使用渐变填充矩形
svg_overview.append("rect")
.attr('x', 0)
.attr('y', 0)
.attr('width', '100')
.attr('height', '10')
.style('fill', 'url(#gradient_overview)');

// 在SVG中添加一个文本元素
svg_overview.append("text")
.attr('x', 0)  // 这是文本元素的x坐标，你可以根据需要修改这个值
.attr('y', 8)  // 这是文本元素的y坐标，你可以根据需要修改这个值
.text("Few - Many")  // 这是文本元素的内容
.style('font-size', '10px');  // 这是文本元素的字体大小，你可以根据需要修改这个值


/*
    地点bar函数：
 */
// let location_bar = function (dyn) {
//     d3.select("#overviewbar").remove();


//     $.ajax({
//         url: "json/en/location_category.json",
//         type: "GET",
//         dataType: "json",
//         success:
//             function (data) {

//                 let keywords_2_workId_overview;
//                 let sentimentScores_overview = {};

//           /*
//               读取poems.json, keywords.json, 获取全部地点情感
//            */
//               d3.json("json/en/dynasty_keywords.json").then(function(data) {
//                 keywords_2_workId_overview = data;
//                 d3.json("json/en/location_category.json").then(function(data) {
//                     for (let category in data) {
//                         for (let item of data[category]) {
//                             let location = item["地名"];
//                             if (dyn === "") {
//                                 dyn = "现当代";
//                             }
//                             if (dyn in keywords_2_workId_overview) {
//                                 if (location in keywords_2_workId_overview[dyn]) {
//                                     if (keywords_2_workId_overview[dyn][location]['until_average_score'] != 0){
//                                         sentimentScores_overview[location] = keywords_2_workId_overview[dyn][location]['until_average_score'];}
//                                 }
//                             }
//                         }
//                     }

//                     // 将数据转换为数组
//                     let dataArray = [];
//                       for (let location in sentimentScores_overview) {
//                         dataArray.push({location: location, score: sentimentScores_overview[location]});
//                     }

//                     // 按分数从大到小排序
//                     dataArray.sort(function(a, b) {
//                         return b.score - a.score;
//                     });




//                     // 设置内边距
//                     let margin = {top: 20, right: 20, bottom: 20, left: 20};

//                     // 设置SVG的宽度和高度
//                     let container = d3.select(".overview_bar");
//                     let width = dataArray.length * 30
//                     let height = parseInt(container.style("height"))- margin.bottom - margin.top;

//                     // 创建SVG元素
//                     let svg = d3.select(".overview_bar")
//                         .append("svg")
//                         .attr("width", width + margin.left + margin.right)
//                         .attr("height", height + margin.top + margin.bottom)
//                         .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
//                         .attr("id", "overviewbar")
//                         ;




//                     // 设置比例尺
//                     let xScale = d3.scaleBand()
//                         .domain(dataArray.map(function(d) { return d.location; }))
//                         // .range([0, width])
//                         // .range([0, dataArray.length * 30])
//                         .range([30, dataArray.length * 30 + 30])
//                         .padding(0.1);

//                     // 添加x轴
//                     let xAxis = svg.append("g")
//                         .attr("transform", "translate(0," + height + ")")
//                         .call(d3.axisBottom(xScale));

//                     // 设置x轴字体样式
//                     xAxis.selectAll("text")
//                         .style('font-family', 'JinlingXi')
//                         .style("font-size", "9px") // 设置字体大小
//                         .style("fill", "black"); // 设置字体颜色



//                     // 设置比例尺
//                     let yScale = d3.scaleLinear()
//                         .domain([0, 1])
//                         .range([height, 5]);

//                     // 添加y轴
//                     let yAxis = svg.append("g")
//                         .attr("transform", "translate(30, 0)")
//                         .call(d3.axisLeft(yScale).tickValues([0,0.2,0.4,0.6,0.8, 1]));


//                     // 设置y轴字体样式
//                     yAxis.selectAll("text")
//                         .style('font-family', 'JinlingXi')
//                         .style("font-size", "9px") // 设置字体大小
//                         .style("fill", "black"); // 设置字体颜色



//                     // 绘制条形图
//                     svg.selectAll("rect")
//                         .data(dataArray.filter(function(d) { return d.score != 0; })) // 过滤掉分数为0的数据
//                         .enter()
//                         .append("rect")
//                         .attr("x", function(d) { return xScale(d.location); })
//                         .attr("y", function(d) { return yScale(d.score); })
//                         .attr("width", xScale.bandwidth())
//                         .attr("height", function(d) { return height - yScale(d.score); })
//                         // .style("stroke", "black") // 设置条形的边框颜色
//                         // .style("stroke-width", "1px") // 设置条形的边框宽度
//                         .attr("fill", function(d) { return colorScale_overview(d.score); }) // 根据分数设置条形的填充颜色
//                         .style("opacity", function(d) { return opacityScale_overview(d.score); }) // 根据分数设置条形的透明度
//                         // .style("box-shadow", "2px 2px 5px rgba(0, 0, 0, 0.3)"); // 设置条形的阴影效果
//                         .on("click", function(d){
//                             // 获取当前点击的圆形元素对应的地点名称或 ID
//                             let locationName = d.location;
//                             // 使用 window.postMessage 方法向 map.js 发送数据
//                             window.postMessage({ type: "HIGHLIGHT_LOCATION", locationName: locationName }, "*");
//                         })


//                     // 添加x轴和y轴
//                     svg.append("g")
//                         .attr("transform", "translate(0," + height + ")")
//                         // .call(d3.axisBottom(xScale));

//                     svg.append("g")
//                         // .call(d3.axisLeft(yScale));



//                 })


//             })
//         }
//     });
// }
let location_bar = function (dyn) {
    d3.selectAll("#overviewbar").remove();

    $.ajax({
        url: "json/en/location_category.json",
        type: "GET",
        dataType: "json",
        success:
            function (data) {

                let keywords_2_workId_overview;
                let sentimentScores_overview = {};

                /*
                    读取poems.json, keywords.json, 获取全部地点情感
                 */
                d3.json("json/en/dynasty_keywords.json").then(function (data) {
                    keywords_2_workId_overview = data;
                    d3.json("json/en/location_category.json").then(function (data) {
                        for (let category in data) {
                            for (let item of data[category]) {
                                let location = item["地名"];
                                if (dyn === "") {
                                    dyn = "Modern";
                                }
                                if (dyn in keywords_2_workId_overview) {
                                    if (location in keywords_2_workId_overview[dyn]) {
                                        if (keywords_2_workId_overview[dyn][location]['until_average_score'] != 0) {
                                            sentimentScores_overview[location] = keywords_2_workId_overview[dyn][location]['until_average_score'];
                                        }
                                    }
                                }
                            }
                        }

                        // 将数据转换为数组
                        let dataArray = [];
                        for (let location in sentimentScores_overview) {
                            dataArray.push({ location: location, score: sentimentScores_overview[location] });
                        }

                        // 按分数从大到小排序
                        dataArray.sort(function (a, b) {
                            return b.score - a.score;
                        });

                        // 设置内边距
                        let margin = { top: 20, right: 30, bottom: 20, left: 30 };

                        // 设置SVG的宽度和高度
                        let container = d3.select(".overview_bar");
                        let width = parseInt(container.style("width")) - margin.left - margin.right;
                        let height = dataArray.length * 10;

                        // 创建SVG元素
                        let svg = d3.select(".overview_bar")
                            .append("svg")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom + 30)
                            // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                            .attr("id", "overviewbar");

                        // 设置比例尺
                        let xScale = d3.scaleLinear()
                            .domain([0, 1])
                            .range([0, width]);

                        let yScale = d3.scaleBand()
                            .domain(dataArray.map(function (d) { return d.location; }).reverse())
                            .range([height, 0])
                            .padding(0.1);

                        // 添加x轴
                        let xAxis = svg.append("g")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                            .call(d3.axisTop(xScale).tickValues([0, 1]).tickFormat(function (d) { return d == 0 ? "0 Negative" : "1 Positive"; }).tickSize(0)) // 设置刻度值和刻度文本
                            .call(g => g.select(".domain").remove()); // 去掉x轴线

                        // 设置x轴字体样式
                        xAxis.selectAll("text")
                            .attr("y", -8) // 设置文本的y坐标
                            // .attr("dy", "0.32em") // 设置文本的垂直偏移
                            .attr("text-anchor", "middle") // 设置文本的水平对齐方式
                            .style('font-family', 'JinlingXi')
                            .style("font-size", "9px") // 设置字体大小
                            .style("fill", "black"); // 设置字体颜色



                        // 添加y轴
                        let yAxis = svg.append("g")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                            .call(d3.axisLeft(yScale).tickSize(0)) // 设置刻度线长度为0
                            .call(g => g.select(".domain").remove()) // 去掉y轴线
                            .selectAll(".tick") // 选择所有刻度
                            .on("click", function (e, d) { // 为每个刻度添加点击事件监听器
                                // 获取当前点击的刻度对应的地点名称或 ID
                                let locationName = d;
                                // 使用 window.postMessage 方法向 map.js 发送数据
                                window.postMessage({ type: "HIGHLIGHT_LOCATION", locationName: locationName }, "*");
                            });


                        // 设置y轴字体样式
                        yAxis.selectAll("text")
                            .style('font-family', 'JinlingXi')
                            .style("font-size", "9px") // 设置字体大小
                            .style("fill", "black") // 设置字体颜色
                            .style("display", "none");

                        // 添加小三角形来标记0和1，尖尖朝下，大小变小，透明度降低
                        svg.append("polygon")
                            .attr("points", function() {
                                let x1 = xScale(0) + margin.left;
                                let y1 = margin.top + 1; // 调整三角形的位置
                                let x2 = x1 - 3; // 调整三角形的大小
                                let y2 = y1 - 5; // 调整三角形的大小
                                let x3 = x1 + 3; // 调整三角形的大小
                                let y3 = y2;
                                return x1 + "," + y1 + " " + x2 + "," + y2 + " " + x3 + "," + y3;
                            })
                            .attr("fill", "black")
                            .style("fill-opacity", 0.5); // 调整三角形的透明度

                        svg.append("polygon")
                            .attr("points", function() {
                                let x1 = xScale(1) + margin.left;
                                let y1 = margin.top + 1; // 调整三角形的位置
                                let x2 = x1 - 3; // 调整三角形的大小
                                let y2 = y1 - 5; // 调整三角形的大小
                                let x3 = x1 + 3; // 调整三角形的大小
                                let y3 = y2;
                                return x1 + "," + y1 + " " + x2 + "," + y2 + " " + x3 + "," + y3;
                            })
                            .attr("fill", "black")
                            .style("fill-opacity", 0.5); // 调整三角形的透明度






                        // 绘制条形图
                        // svg.selectAll("rect")
                        //     .data(dataArray.filter(function (d) { return d.score != 0; })) // 过滤掉分数为0的数据
                        //     .enter()
                        //     .append("rect")
                        //     .attr("x", function (d) { return margin.left; })
                        //     .attr("y", function (d) { return yScale(d.location) + margin.top; })
                        //     .attr("width", function (d) { return xScale(d.score); })
                        //     .attr("height", yScale.bandwidth())
                        //     // .attr("fill", function (d) { return colorScale_overview(d.score); }) // 根据分数设置条形的填充颜色
                        //     .attr("fill", 'rgba(106 ,159 ,147, .3)')//rgba(106 ,159 ,147, .4)  rgba(106 ,159 ,147 ,1)
                        //     // .style("opacity", 0.3)
                        //     // .style("opacity", function (d) { return opacityScale_overview(d.score); }) // 根据分数设置条形的透明度
                        //     .on("click", async function (d) {
                        //         // 获取当前点击的圆形元素对应的地点名称或 ID
                        //         let locationName = d.location;
                        //         // 使用 window.postMessage 方法向 map.js 发送数据
                        //         window.postMessage({ type: "HIGHLIGHT_LOCATION", locationName: locationName }, "*");
                        //         // 视图联动——知识图谱
                        //         if (location2obj == null) {
                        //             let json = await new Promise(resolve => {
                        //                 resolve(d3.json('json/en/location2obj.json'));
                        //             })
                        //             location2obj = json;
                        //         }
                        //         draw_knowledge_map_by('location', location2obj[locationName]['地名id']);
                        //         //视图联动——右边info
                        //         generate_info_container(locationName);
                        //     })

                        // 绘制线条和圆
                        // 绘制虚线，并添加class和id
                        svg.selectAll(".myLine") // 使用class选择元素
                            .data(dataArray.filter(function (d) { return d.score != 0; })) // 过滤掉分数为0的数据
                            .enter()
                            .append("line")
                            .attr("class", "myLine") // 添加class
                            .attr("id", function (d, i) { return "line" + i; }) // 添加id，每条线的id都不同
                            .attr("x1", function (d) { return margin.left; })
                            .attr("y1", function (d) { return yScale(d.location) + margin.top + yScale.bandwidth() / 2; }) // 线的起点在y轴标签的中心
                            .attr("x2", function (d) { return xScale(d.score) + margin.left; })
                            .attr("y2", function (d) { return yScale(d.location) + margin.top + yScale.bandwidth() / 2; }) // 线的终点在y轴标签的中心
                            .attr("stroke", function (d) { return colorScale(d.score); }) // 根据分数设置线的颜色
                            // .attr("stroke", 'rgba(106 ,159 ,147, 1)')
                            .style("stroke-opacity", function (d) { return opacityScale(d.score); })
                            .attr("stroke-width", 1)
                            .attr("stroke-dasharray", "2.4, 4, 0.8, 8") // 设置线的样式为虚线
                            ; // 根据分数设置线的透明度


                        // // 绘制圆圈
                        // svg.selectAll(".myCircle")
                        //     .data(dataArray.filter(function (d) { return d.score != 0; })) // 过滤掉分数为0的数据
                        //     .enter()
                        //     .append("circle")
                        //     .attr("class", "myCircle") // 添加class
                        //     .attr("cx", function (d) { return margin.left - 10; }) // margin.left - 10; xScale(d.score) + margin.left;
                        //     .attr("cy", function (d) { return yScale(d.location) + margin.top + yScale.bandwidth()/2; })
                        //     .attr("r", 2)
                        //     .attr("fill", function (d) { return colorScale(d.score); }) // 根据分数设置圆圈的填充颜色
                        //     .style("opacity", function (d) { return opacityScale(d.score); }) // 根据分数设置圆圈的透明度
                        //     .on("click", async function (d) {
                        //         // 获取当前点击的圆形元素对应的地点名称或 ID
                        //         let locationName = d.location;
                        //         // 使用 window.postMessage 方法向 map.js 发送数据
                        //         window.postMessage({ type: "HIGHLIGHT_LOCATION", locationName: locationName }, "*");
                        //         // 视图联动——知识图谱
                        //         if (location2obj == null) {
                        //             let json = await new Promise(resolve => {
                        //                 resolve(d3.json('json/en/location2obj.json'));
                        //             })
                        //             location2obj = json;
                        //         }
                        //         draw_knowledge_map_by('location', location2obj[locationName]['地名id']);
                        //         //视图联动——右边info
                        //         generate_info_container(locationName);
                        //     });

                        
                        // 绘制菱形
                        svg.selectAll(".myDiamond")
                            .data(dataArray.filter(function (d) { return d.score != 0; })) // 过滤掉分数为0的数据
                            .enter()
                            .append("path")
                            .attr("class", "myDiamond") // 添加class
                            .attr("d", function (d) {
                                var x = margin.left - 10; // margin.left - 10; xScale(d.score) + margin.left;
                                var y = yScale(d.location) + margin.top + yScale.bandwidth()/2;
                                return "M" + x + " " + y + " l3 -3 l3 3 l-3 3 z";
                            })
                            .attr("fill", function (d) { return colorScale(d.score); }) // 根据分数设置菱形的填充颜色
                            .style("opacity", function (d) { return opacityScale(d.score); }) // 根据分数设置菱形的透明度
                            .on("click", async function (e, d) {
                                // 获取当前点击的菱形元素对应的地点名称或 ID
                                let locationName = d.location;
                                // 使用 window.postMessage 方法向 map.js 发送数据
                                window.postMessage({ type: "HIGHLIGHT_LOCATION", locationName: locationName }, "*");
                                // 视图联动——知识图谱
                                if (location2obj == null) {
                                    let json = await new Promise(resolve => {
                                        resolve(d3.json('json/en/location2obj.json'));
                                    })
                                    location2obj = json;
                                }
                                draw_knowledge_map_by('location', location2obj[locationName]['地名id']);
                                //视图联动——右边info
                                generate_info_container(locationName);
                            });




                        // 绘制文本，并添加class
                        svg.selectAll(".myText")
                            .data(dataArray.filter(function (d) { return d.score != 0; })) // 过滤掉分数为0的数据
                            .enter()
                            .append("text")
                            .attr("class", "myText") // 添加class
                            .attr("x", function (d) { return xScale(d.score) + margin.left; }) // margin.left - 10; xScale(d.score) + margin.left;
                            .attr("y", function (d) { return yScale(d.location) + margin.top + yScale.bandwidth()/2; })
                            .attr("dy", "0.35em") // 垂直对齐
                            .text(function (d) { return d.location; }) // 设置文本内容为地点名称
                            .attr("fill", function (d) { return colorScale(d.score); }) // 根据分数设置文本颜色
                            // .attr("fill", 'rgba(106 ,159 ,147, 1)')
                            .style("opacity", function (d) { return opacityScale(d.score); }) // 根据分数设置透明度
                            .style("font-size", "10px") // 设置字号
                            .style('cursor', 'pointer')
                            .on("click", async function (e, d) {
                                // 获取当前点击的文本元素对应的地点名称或 ID
                                let locationName = d.location;
                                // 使用 window.postMessage 方法向 map.js 发送数据
                                window.postMessage({ type: "HIGHLIGHT_LOCATION", locationName: locationName }, "*");
                                // 视图联动——知识图谱
                                if (location2obj == null) {
                                    let json = await new Promise(resolve => {
                                        resolve(d3.json('json/en/location2obj.json'));
                                    })
                                    location2obj = json;
                                }
                                draw_knowledge_map_by('location', location2obj[locationName]['地名id']);
                                //视图联动——右边info
                                generate_info_container(locationName);
                            });


                    })
                })
            }
    });
}


/*
    文体pie
*/

let pie_chart_tooltip = d3.select(".overview_wenti")
.append("div")
.style("position", "absolute")
.style("visibility", "hidden")
.style("font-size", "12px") // 设置字体大小为 12px
.style("left", "5px")
.text("I'm a tooltip!");

function drawPieChart(dynasty, allDynasties) {
    d3.selectAll(".overview_wenti").selectAll("svg").remove();

    d3.json("json/en/litform.json").then(function (data) {
        let width = document.querySelector('.overview_wenti').offsetWidth;
        let height = document.querySelector('.overview_wenti').offsetHeight;
        let margin = 0;
        let radius = Math.min(width, height) / 2 - margin;

        // 创建工具提示
        // let tooltip = d3.select(".overview_wenti")
        //     .append("div")
        //     .style("position", "absolute")
        //     .style("visibility", "hidden")
        //     .style("font-size", "12px") // 设置字体大小为 12px
        //     .text("I'm a tooltip!");

        let svg = d3.select(".overview_wenti")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2.5 + "," + height / 2 + ")");

        // 判断是否需要统计所有朝代的文体数量
        if (allDynasties) {
            // 遍历所有朝代的数据
            let allData = {};
            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    let dynastyData = data[key];
                    for (let wenti in dynastyData) {
                        if (dynastyData.hasOwnProperty(wenti)) {
                            if (!allData.hasOwnProperty(wenti)) {
                                allData[wenti] = 0;
                            }
                            allData[wenti] += dynastyData[wenti];
                        }
                    }
                }
            }

            // 使用汇总后的数据绘制饼图
            drawPie(allData);
        } else {
            // 使用指定朝代的数据绘制饼图
            drawPie(data[dynasty]);
        }

        function drawPie(data) {
            // 对数据进行排序
            let sortedData = d3.entries(data).sort(function (a, b) {
                return d3.descending(a.value, b.value);
            });

            // 创建颜色比例尺
            let colorScale = d3.scaleLinear()
                .domain([0, d3.max(sortedData, function (d) { return d.value; })])
                // .range(["lightblue", "green"]);
                .range([current_mode_color.wenti_pie_scale_low, current_mode_color.wenti_pie_scale_high]);
                // .range(["rgba(81,110,188, .4)", "rgba(81,110,188 ,.8)"]);
                // .range(["RGBA(147, 181, 207, .4)", "RGBA(147, 181, 207, .8)"]);
                // .range(["RGBA(199, 210, 212, .4)", "RGBA(199, 210, 212, 1)"]);

            let pie = d3.pie()
                .value(function (d) { return d.value; });
            let data_ready = pie(sortedData);

            let clicked = false;

            svg.selectAll('whatever')
                .data(data_ready)
                .enter()
                .append('path')
                .attr('d', d3.arc()
                    .innerRadius(radius * 0.3) // 设置内半径为外半径的 0.4 倍，使饼图变为空心的
                    .outerRadius(function (d) { // 根据每个扇形所表示的数据值动态计算每个扇形的半径
                        return radius * 0.6 + radius * 0.4 * d.data.value / d3.max(sortedData, function (d) { return d.value; });
                    }))
                .attr('fill', function (d) { return colorScale(d.data.value); })
                .attr("stroke", "black")
                .style("stroke-width", "0.05px")
                // .style("opacity", 0.5)

                .on("mouseover", function (e, d) {
                    // 恢复先前高亮显示的线条的原始样式
                    d3.selectAll(".lines")
                        // .filter(function() {
                        //     // 筛选出先前高亮显示的线条
                        //     return d3.select(this).style("stroke") == "green";
                        // })
                        .style("stroke", function () {
                            // 获取当前线条的分数
                            let score = this.getAttribute("data-score");

                            // 计算当前线条的渐变 ID
                            let gradientId = "gradient-" + score;

                            // 返回当前线条的原始渐变
                            return "url(#" + gradientId + ")";
                        });

                    // 显示工具提示
                    pie_chart_tooltip.text(d.data.key + ": " + d.data.value);
                    pie_chart_tooltip.style("visibility", "visible");

                    // 高亮显示地图中与饼图扇形表示的文体相对应的线条
                    d3.selectAll(".lines")
                        .filter(function () {
                            // 获取当前线条的文体信息
                            let lineWenti = this.getAttribute("data-wenti");

                            // 筛选出与饼图扇形表示的文体相对应的线条
                            return lineWenti == d.data.key;
                        })
                        .style("stroke", current_mode_color.header_backgroundcolor)
                        .style("opacity", 0.9);
                })

                .on("mouseout", function () {
                    if (!clicked) {
                        // 隐藏工具提示
                        pie_chart_tooltip.style("visibility", "hidden");

                        // 恢复地图中线条的原始样式
                        d3.selectAll(".lines")
                            .style("stroke", function () {
                                // 获取当前线条的分数
                                let score = this.getAttribute("data-score");

                                // 计算当前线条的渐变 ID
                                let gradientId = "gradient-" + score;

                                // 返回当前线条的原始渐变
                                return "url(#" + gradientId + ")";
                            })
                        // .style("stroke-width", "2px");
                    }
                })

                .on("click", function (e, d) {
                    clicked = !clicked;
                    // 禁用鼠标移出事件
                    // d3.selectAll('path').on('mouseout', null);

                    // 恢复先前高亮显示的线条的原始样式
                    d3.selectAll(".lines")
                        // .filter(function() {
                        //     // 筛选出先前高亮显示的线条
                        //     return d3.select(this).style("stroke") == "red";
                        // })
                        .style("stroke", function () {
                            // 获取当前线条的分数
                            let score = this.getAttribute("data-score");

                            // 计算当前线条的渐变 ID
                            let gradientId = "gradient-" + score;

                            // 返回当前线条的原始渐变
                            return "url(#" + gradientId + ")";
                        });

                    // 高亮显示地图中与饼图扇形表示的文体相对应的线条
                    d3.selectAll(".lines")
                        .filter(function () {
                            // 获取当前线条的文体信息
                            let lineWenti = this.getAttribute("data-wenti");

                            // 筛选出与饼图扇形表示的文体相对应的线条
                            return lineWenti == d.data.key;
                        })
                        .style("stroke", 'rgb(106 ,159 ,147)')
                        .style("opacity", 0.9);
                });
            // 在饼图的空心中画一个圆环
            svg.append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", radius * 0.27) // 设置圆环的半径为内半径
                .style("fill", "none")
                .style("stroke", current_mode_color.wenti_pie_central_ring)
                .style("stroke-width", "1.5px")
                .style("stroke-opacity", 0.15);
        }
    });
}

// 文体筛选框
let litform_data;
async function set_litform_selectBox(dynasty){
    if(litform_data == null){
        let json = await new Promise(resolve => {
            resolve(d3.json('json/en/litform.json'));
        })
        litform_data = json;
    }
    let lit_dict = new Object();
    let total_num = 0;
    // 把文体数据组织成数组 ['a', 10] value是百分比
    if(dynasty == ""){
        for(let tmp_dyn in litform_data){
            for(let wenti in litform_data[tmp_dyn]){
                if(!(wenti in lit_dict)){
                    lit_dict[wenti] = 0;
                }
                lit_dict[wenti] += litform_data[tmp_dyn][wenti];
            }
        }
        
    }else{
        lit_dict = litform_data[dynasty];
    }
    let lit_list = Object.entries(lit_dict);
    lit_list.forEach(d => {
        total_num += d[1]; //计算总数
    })
    for(let i = 0; i < lit_list.length; ++i){
        let percent = lit_list[i][1] / total_num;
        let zeroCount = 0;
        let percentStr = percent.toString().split('.')[1];
        while(percentStr[zeroCount] == '0'){
            zeroCount++;
        }
        if(zeroCount < 2){
            zeroCount = 2
        }else{
            zeroCount++;
        }
        lit_list[i][1] = Math.floor(lit_list[i][1] / total_num * (Math.pow(10, zeroCount))) / Math.pow(10, zeroCount-2); // 转换百分比，精确到第一位有效数字
    }
    lit_list = lit_list.sort((a, b) => b[1] - a[1]);
    for(let i = 0; i < lit_list.length; ++i){
        lit_list[i][1] = `${lit_list[i][0]}(${lit_list[i][1]}%)`;
    }
    lit_list.unshift(['', 'All']) //selectValue display
    // 根据lit_list添加option
    let select = d3.select('#selectBox4').html('');
    select.selectAll('option').data(lit_list).join('option')
        .attr('value', d => d[0])
        .text(d => d[1]);
}


// drawPieChart(null, true)
set_litform_selectBox('')
location_bar('Modern')
