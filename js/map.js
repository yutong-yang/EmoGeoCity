// 定义按钮
// const filterbuttonwork = d3.select("#filter-button-work");
// const filterbuttonevent = d3.select("#filter-button-event");
// const filterbuttonlocation = d3.select("#filter-button-location");

// 定义下拉框
const select_show_box = document.getElementById("selectBox1");
const select_work_sent_box = document.getElementById("selectBox2");
const select_work_keywords_box = document.getElementById("selectBox3");
const select_work_wenti_box = document.getElementById("selectBox4");



// let colorScale = d3.scaleLinear()
//     .domain([0, 0.3, 1])
//     .range(["#00008B", "#ADD8E6", "#FFB6C1", "#8B0000"]);


// let colorScale = d3.scaleLinear()
// .domain([0, 0.5, 1])
// .range(["white", "blue", "red"]);

// let colorScale = d3.scaleQuantize()
// .domain([0, 1])
// .range(["white", "blue", "red"]);

// let colorScale = d3.scaleThreshold()
//     .domain([0.00001, 0.5])
//     .range(["white", "blue", "red"]);

// let opacityScale = d3.scaleLinear()
//     .domain([0, 0.00001, 0.5, 1])
//     .range([0.1, 0.5, 0.2, 0.5]);

let colorScale = d3.scaleThreshold()
    .domain([0.5])
    // .range(["blue", "red"]);
    .range([current_mode_color.emotion_negative, current_mode_color.emotion_positive]);//.range(["#6496bc", "#70896d"]); RGBA(81, 110, 188, 1)，RGBA(243, 136, 127, 1)
// .range(["#4686a2", "#c07359"])

let opacityScale = d3.scaleLinear()
    .domain([0, 0.5, 1])
    .range([0.8, 0.1, 0.8]);

/*
    创建svg
*/
// let width = 800;
// let height = 600;
// 获取容器元素
var container = document.querySelector('#graph');

// 获取容器元素的宽度和高度
var width = container.offsetWidth;
var height = container.offsetHeight;

// 使用 D3.js 动态创建 SVG 元素
let svg_origin = d3.select("#graph")
    .append("svg")
    .attr("id", "map-svg")
    .attr("width", width)
    .attr("height", '100%');

let svg = svg_origin.append('g');
let info_div_max_height = 300;
let screen_height = $('body').height();

// 添加拖拽和缩放功能
// var zoom = d3.zoom()
//     .scaleExtent([0.5, 10])
//     .on("zoom", function(e) { 
//         svg.selectAll(".map").attr("transform", e.transform);
//         svg.selectAll(".event_circle").attr("transform", e.transform);
//         svg.selectAll(".lines").attr("transform", e.transform);
//         svg.selectAll(".location_circle").attr("transform", e.transform);
//     });

let event_keyword_fontsize = 14;
let event_keyword_r = 10;
let event_circle_clicked = false;
let currentScale = 1;
let zoom = d3.zoom()
    .scaleExtent([0.4, 10])
    .on("zoom", function (e) {
        svg.attr('transform', e.transform);
        // // 获取当前的缩放比例
        currentScale = e.transform.k;
        // // 更新地图和 line、circle、图标的 transform 属性
        // svg.selectAll(".map").attr("transform", e.transform);
        // svg.selectAll(".event_circle").attr("transform", e.transform);
        // svg.selectAll(".lines").attr("transform", e.transform);
        // svg.selectAll(".location_circle").attr("transform", e.transform);
        // svg.selectAll(".location-highlight").attr("transform", e.transform);

        // // 根据缩放比例调整 line、circle 和图标的大小
        svg.selectAll(".lines").attr("stroke-width", 3 / Math.pow(currentScale, 0.8));
        svg.selectAll(".event_circle").attr("r", 3.5 / currentScale);
        svg.selectAll('.event-keyword').style('font-size', `${event_keyword_fontsize / currentScale}px`)
        // svg.selectAll(".location_circle").attr("width", 15 / currentScale).attr("height", 15 / currentScale);
        svg.selectAll(".location_circle").attr("r", 7 / currentScale);
        svg.selectAll(".location_circle").attr("stroke-width", 2 / Math.pow(currentScale, 0.8));
        let new_event_circle_r = event_keyword_r / currentScale;
        let event_keywords = svg.selectAll('.event-keyword');
        event_keywords.attr('x', function () {
            let old_r = parseFloat(d3.select(this).attr('data-r'));
            let angle = parseFloat(d3.select(this).attr('data-angle'));
            let old_x = parseFloat(d3.select(this).attr('x'));
            return old_x + Math.cos(angle) * (new_event_circle_r - old_r);
        })
            .attr('y', function () {
                let old_r = parseFloat(d3.select(this).attr('data-r'));
                let angle = parseFloat(d3.select(this).attr('data-angle'));
                let old_y = parseFloat(d3.select(this).attr('y'));
                return old_y + Math.sin(angle) * (new_event_circle_r - old_r);
            })
            .attr('transform', function () {
                let cx = parseFloat(d3.select(this).attr('x'));
                let cy = parseFloat(d3.select(this).attr('y'));
                let cur_degree = parseFloat(d3.select(this).attr('data-degree'));
                if (cur_degree <= 90) {
                    return `rotate(${cur_degree} ${cx} ${cy})`
                } else if (cur_degree <= 270) {
                    return `rotate(${cur_degree - 180} ${cx} ${cy})`
                } else {
                    return `rotate(${cur_degree - 360} ${cx} ${cy})`
                }
            })
            .attr('data-r', new_event_circle_r);
        // svg.selectAll(".location_circle").style("opacity", 0.2*currentScale);

        // // svg.selectAll(".location_circle").attr("width", 15 / Math.sqrt(currentScale)).attr("height", 15 / Math.sqrt(currentScale));
        // // svg.selectAll(".location_circle").attr("width", 15 / Math.pow(currentScale, 1/2)).attr("height", 15 / Math.pow(currentScale, 1/2));
        // 根据缩放比例调整线段的长度
        svg.selectAll(".location-highlight")
            .filter("line")
            .transition()
            .duration(50)
            .attr("y2", function () {
                let y1 = d3.select(this).attr("y1");
                return y1 - (80 / currentScale);
            });
        // 根据缩放比例调整文本元素的位置
        svg.selectAll(".location-highlight")
            .filter("text")
            .transition()
            .duration(50)
            .attr("y", function () {
                let line = d3.select(this.previousSibling);
                let y2 = line.attr("y2");
                return y2 - (5 / currentScale);
            });


    });

// .attr("class", "location-highlight");

svg_origin.call(zoom);



const show_words = function () {
    let words = select_work_keywords_box.value;
}


/*
    创建一个地理投影，用于对地图进行缩放、平移、旋转等操作
    创建一个地理路径生成器，用于绘制地图路径，将 projection 作为参数传入
    设置地图的中心位置,缩放程度,地图的平移量
*/
let projection = d3.geoMercator()
    .center([118.78, 32.07])
    .scale(50000)
    .translate([width / 2, height / 2 - 80]);


let path = d3.geoPath()
    .projection(projection);



/*
    加载南京市的地图数据，返回一个 Promise 对象
*/
// var map = new AMap.Map('graph', {
//     center: [118.78, 32.07],
//     zoom: 9
// });



ajax('json/nanjing.geoJson', function (err, geoJSON) {
    if (!err) {

        var geojson = new AMap.GeoJSON({
            geoJSON: geoJSON,
        });

        // geojson.setMap(map);
        // 在加载完成后，调用函数处理 D3.js 部分的数据
        handleD3Data(geoJSON);

    } else {
        console.error('There was a problem with the ajax operation:', err);
    }
});


// })

let workdata;
let locationdata;
let eventdata;
let keywords_2_workId_map;
// 处理 D3.js 部分的数据
function handleD3Data(data) {
    d3.json("json/nanjing.geoJson")
        .then(function (d3Data) {
            // 在这里处理 D3.js 部分的数据
            svg.selectAll("path")
                .data(d3Data.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("class", "map")
                .attr("fill", "#ffffff") //f2ebd4    70896d
                .attr("opacity", 0.5)
                .attr("stroke", "#999")
                .attr("stroke-width", 0.5)
                .on("mouseover", function (e) {
                    /*
                        鼠标悬停时设置 path
                        填充色蓝色
                        添加浮动框显示区域名称
                    */
                    d3.select(this)
                        .attr("fill", "#fff")
                        .append("title")
                        .text(function (d) {
                            return d.name;
                        });
                })
                .on("mouseout", function (e) {
                    d3.select(this)
                        .attr("fill", "#ffffff")
                        .select("title")
                        .remove();
                })


            // // 添加标记点1
            //    svg.append("circle")
            //    .attr("cx", projection([118.7668, 32.0296])[0])
            //    .attr("cy", projection([118.7668, 32.0296])[1])
            //    .attr("r", 5)
            //    .style("fill", "red");

            async function init_map_points() {
                // 生成全部地点点
                let sentimentScores_map = {};
                /*
                    读取poems.json, keywords.json, 获取全部地点情感
                 */
                d3.json("json/en/dynasty_keywords.json").then(function (data) {
                    keywords_2_workId_map = data;
                    d3.json("json/en/location_category.json").then(function (data) {
                        locationdata = data;
                        for (let category in data) {
                            for (let item of data[category]) {
                                let location = item["地名"];
                                if (location in keywords_2_workId_map['Modern']) {
                                    sentimentScores_map[location] = keywords_2_workId_map['Modern'][location]['until_average_score'];
                                }
                            }
                        }
                        for (let key in data) {

                            for (let i = 0; i < data[key].length; i++) {
                                let jd = data[key][i]['经度'];
                                let wd = data[key][i]['纬度'];
                                // console.log(jd);
                                let location = data[key][i]['地名'];
                                if (location in keywords_2_workId_map['Modern']) {
                                    let score_map = keywords_2_workId_map['Modern'][location]['until_average_score'];

                                    svg.append("circle")
                                        .attr("id", "location-icon-" + data[key][i]['地名'].replaceAll(' ', '-')) // 为每个地点图标元素添加一个唯一的 ID
                                        .attr("cx", projection([jd, wd])[0])
                                        .attr("cy", projection([jd, wd])[1])
                                        .attr("r", 7 / currentScale)
                                        .style('cursor', 'pointer')
                                        // .style("fill", "green")  //#6496bc
                                        .style("fill", function () {
                                            if (score_map != 0) {
                                                let color = colorScale(score_map);
                                                return color;
                                            } else {
                                                return "none";
                                            }
                                        })
                                        .style("opacity", function () {
                                            if (score_map != 0) {
                                                let opacity = opacityScale(score_map);
                                                return opacity;
                                            } else {
                                                return 0.1;
                                            }
                                        })
                                        .style("stroke", function () {
                                            if (score_map == 0) {
                                                return current_mode_color.map_location;
                                            } else {
                                                return "none";
                                            }
                                        })
                                        .attr("stroke-width", 2 / Math.pow(currentScale, 0.8))
                                        // .attr("class", "map")
                                        .attr("class", "location_circle")

                                        // svg.append("image")
                                        //     .attr("xlink:href", "images/location_icon.svg")
                                        //     .attr("id", "location-icon-" + data[key][i]['地名']) // 为每个地点图标元素添加一个唯一的 ID
                                        //     .attr("x", projection([jd, wd])[0]) //-7.5
                                        //     .attr("y", projection([jd, wd])[1]) //-12.5
                                        //     .attr("width", 15 / currentScale)
                                        //     .attr("height", 15 / currentScale)
                                        //     .style("opacity", 0.5 * currentScale)
                                        //     .attr("class", "location_circle")
                                        //     // .attr("class", "location_circle_"+key)


                                        .on("mouseover", function (e) {
                                            // 捕获鼠标光标的坐标
                                            const x = e.clientX + window.pageXOffset;
                                            const y = e.clientY + window.pageYOffset;

                                            d3.selectAll(".location-tip").remove();
                                            // 创建悬浮框元素并设置属性
                                            var tooltip = d3.select("body")
                                                .append("div")
                                                .attr("class", "location-tip")
                                                .text(data[key][i]['地名']);

                                            // 设置悬浮框的位置
                                            tooltip.style("left", (x + 10) + "px")
                                                .style("top", (y + 10) + "px");
                                        })
                                        .on("mouseout", function (e) {
                                            // 鼠标移出元素时删除悬浮框元素
                                            d3.selectAll(".location-tip").remove();
                                        })
                                        .on("click", function (e) {
                                            // 删除已经添加的线段和文本元素
                                            d3.selectAll(".location-highlight").remove();
                                            draw_highlightLocation_inplace(data[key][i]['地名']);
                                            clicked = true;
                                            generate_info_container(data[key][i]['地名']);
                                            // 绘制知识图谱——add by 白骐硕
                                            let location_id = data[key][i]['地名id'];
                                            draw_knowledge_map_by('location', location_id);
                                        })

                                }
                            }

                        }
                    })

                    d3.json("json/en/poems.json").then(function (data) {
                        poems = data;
                        poems_withLocation = Object.entries(poems['work']).filter(entries => entries[1]['location'].length > 0)
                    })
                })

                // // 初始状态下圆形可见
                // let isCircleVisible = true;
                // const location_circle=svg.selectAll(".location_circle")
                // location_circle.style("display", "block");

                // // 点击按钮切换圆形的状态
                // filterbuttonlocation.on("click", function(e) {
                // if (isCircleVisible) {
                //    location_circle.style("display", "none");
                //     // filterbuttonlocation.style("background-color","#bcd6c3")
                //     } else {
                //        location_circle.style("display", "block");
                //        //  filterbuttonevent.text("Hide Circle");
                //     //    filterbuttonlocation.style("background-color","white")
                //         }
                //         isCircleVisible = !isCircleVisible;
                //     }
                // );


                // 生成全部事件点
                d3.json('json/en/events_list.json').then((data) => {
                    // displayData(data)
                    eventdata = data;
                    let mouseover_enable_map = true;
                    let location2event = new Object();

                    for (let i = 0; i < data.events.length; i++) {
                        let location = data.events[i]['地点'];
                        if (!(location in location2event)) {
                            location2event[location] = []
                        }
                        location2event[location].push(i)
                    }
                    Object.keys(location2event).forEach((location) => {
                        let cur_event_index_list = location2event[location]
                        let jd = data.events[cur_event_index_list[0]]['经度'];
                        let wd = data.events[cur_event_index_list[0]]['纬度'];
                        svg.append("circle")
                            .attr("cx", projection([jd, wd])[0])
                            .attr("cy", projection([jd, wd])[1])
                            // .attr("r", 7)
                            .attr("r", 3.5 / currentScale)
                            .style("fill", current_mode_color.event)  //#6496bc
                            .style('cursor', 'pointer')
                            .style("opacity", "0.6")
                            // .attr("class", "map")
                            // .style("z-index", 10)
                            .attr("class", "event_circle")
                            .on('mouseover', (e) => {
                                if (!event_circle_clicked) {
                                    d3.selectAll('.event-keyword-' + location).attr('visibility', 'visible');
                                }
                            })
                            .on('mouseout', (e) => {
                                if (!event_circle_clicked) {
                                    d3.selectAll('.event-keyword-' + location).attr('visibility', 'hidden');
                                }
                            })
                            .on('click', (e) => {
                                d3.selectAll('.event-keyword').attr('visibility', 'hidden');
                                event_circle_clicked = true;
                                d3.selectAll('.event-keyword-' + location).attr('visibility', 'visible');
                            })

                        let event_num = cur_event_index_list.length;
                        let delta_angle = (360 / event_num) / 180 * Math.PI;
                        let r = event_keyword_r / currentScale;
                        let g = svg.append('g')
                        cur_event_index_list.forEach((i, ii) => {
                            let jd = data.events[i]['经度'];
                            let wd = data.events[i]['纬度'];
                            let cur_angle = delta_angle * ii;
                            let cur_degree = (360 / event_num) * ii;
                            let cx = projection([jd, wd])[0] + Math.cos(cur_angle) * r;
                            let cy = projection([jd, wd])[1] + Math.sin(cur_angle) * r;
                            g.append('text')
                                .attr('x', cx)
                                .attr('y', cy)
                                .attr('data-angle', cur_angle)
                                .attr('data-r', r)
                                .attr('data-degree', cur_degree)
                                .attr('transform', function () {
                                    if (cur_degree <= 90) {
                                        return `rotate(${cur_degree} ${cx} ${cy})`
                                    } else if (cur_degree <= 270) {
                                        return `rotate(${cur_degree - 180} ${cx} ${cy})`
                                    } else {
                                        return `rotate(${cur_degree - 360} ${cx} ${cy})`
                                    }
                                })
                                .classed('event-keyword', true)
                                .classed('event-keyword-' + location, true)
                                .attr('text-anchor', 'middle')
                                .attr('alignment-baseline', 'middle')
                                .attr('visibility', 'hidden')
                                .style('font-size', `${event_keyword_fontsize / currentScale}px`)
                                .style('cursor', 'pointer')
                                .text(data.events[i]['keyword'])
                                .on("mouseover", function (e) {
                                    // console.log("before mouseover:" + mouseover_enable_map)
                                    if (mouseover_enable_map == true) {
                                        // 捕获鼠标光标的坐标
                                        const x = e.clientX + window.pageXOffset;
                                        const y = e.clientY + window.pageYOffset;


                                        // 创建悬浮框元素并设置属性
                                        var tooltip = d3.select("body")
                                            .append("div")
                                            .attr("class", "tooltip")

                                        // 添加渐变条
                                        tooltip.append("div")
                                            .attr("class", "tooltip-gradient")
                                            .style("background", `linear-gradient(${'#a2a2cc'}, #ffffff)`)

                                        // 添加图标
                                        tooltip.append('div')
                                            .style('position', 'absolute')
                                            .style('background-color', '#a2a2cc')
                                            .style('color', 'white')
                                            .style('right', '7px')
                                            .style('top', '10px')
                                            .style('font-size', '15px')
                                            .text('Event');

                                        // 添加标题
                                        let title = tooltip.append('div').attr('class', 'knowledgemap-tip-title')
                                            .text(data.events[i]['事件名称'])
                                            .style('font-weight', 'bolder')
                                            .style('padding-left', '10px')
                                            .style('max-width', '250px')
                                            .style('font-size', '16px')
                                            .style('margin-top', '3px')
                                            .style('margin-bottom', '10px');

                                        let info_div = tooltip.append('div').attr('class', 'knowledgemap-tip-info-div')
                                            .style('max-height', (screen_height - y - 80 - parseInt(title.style('height').slice(0, -2))) + 'px')
                                            .style('padding-left', '10px')
                                            .style('padding-right', '10px')
                                            .style('overflow', 'auto');
                                        // 添加内容
                                        info_div.append('div').text('People').attr('class', 'knowledgemap-tip-subtitle');
                                        info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                                        info_div.append('div').text(data.events[i]['相关人物'])

                                        info_div.append('div').text('Dynasty').attr('class', 'knowledgemap-tip-subtitle');
                                        info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                                        info_div.append('div').text(data.events[i]['朝代'])

                                        info_div.append('div').text('Intro').attr('class', 'knowledgemap-tip-subtitle');
                                        info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                                        info_div.append('div').text(data.events[i]['事件内容'])


                                        // 设置悬浮框的位置
                                        tooltip.style("left", (x + 10) + "px")
                                            .style("top", (y + 10) + "px");
                                    }
                                })

                                .on("mouseout", function (e) {
                                    // 鼠标移出元素时删除悬浮框元素
                                    if (mouseover_enable_map) {
                                        d3.selectAll(".tooltip").remove();
                                    }

                                })
                                .on("click", function (e) {
                                    // 捕获鼠标光标的坐标
                                    d3.selectAll(".tooltip").remove();

                                    const x = e.clientX + window.pageXOffset;
                                    const y = e.clientY + window.pageYOffset;


                                    // 创建悬浮框元素并设置属性
                                    var tooltip = d3.select("body")
                                        .append("div")
                                        .attr("class", "tooltip")

                                    // 添加渐变条
                                    tooltip.append("div")
                                        .attr("class", "tooltip-gradient")
                                        .style("background", `linear-gradient(${'#a2a2cc'}, #ffffff)`)

                                    // 添加图标
                                    tooltip.append('div')
                                        .style('position', 'absolute')
                                        .style('background-color', '#a2a2cc')
                                        .style('color', 'white')
                                        .style('right', '7px')
                                        .style('top', '10px')
                                        .style('font-size', '15px')
                                        .text('Event');

                                    // 添加标题
                                    let title = tooltip.append('div').attr('class', 'knowledgemap-tip-title')
                                        .text(data.events[i]['事件名称'])
                                        .style('font-weight', 'bolder')
                                        .style('padding-left', '10px')
                                        .style('max-width', '250px')
                                        .style('font-size', '16px')
                                        .style('margin-top', '3px')
                                        .style('margin-bottom', '10px');

                                    let info_div = tooltip.append('div').attr('class', 'knowledgemap-tip-info-div')
                                        .style('max-height', (screen_height - y - 80 - parseInt(title.style('height').slice(0, -2))) + 'px')
                                        .style('padding-left', '10px')
                                        .style('padding-right', '10px')
                                        .style('overflow', 'auto');
                                    // 添加内容
                                    info_div.append('div').text('People').attr('class', 'knowledgemap-tip-subtitle');
                                    info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                                    info_div.append('div').text(data.events[i]['相关人物'])

                                    info_div.append('div').text('Dynasty').attr('class', 'knowledgemap-tip-subtitle');
                                    info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                                    info_div.append('div').text(data.events[i]['朝代'])

                                    info_div.append('div').text('Intro').attr('class', 'knowledgemap-tip-subtitle');
                                    info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                                    info_div.append('div').text(data.events[i]['事件内容'])


                                    // 设置悬浮框的位置
                                    tooltip.style("left", (x + 10) + "px")
                                        .style("top", (y + 10) + "px");

                                    mouseover_enable_map = false;
                                    // console.log("after click:"+mouseover_enable_map)
                                });
                        })
                    })

                    svg_origin.on("click", function (e) {
                        // console.log(e.target.className.baseVal)
                        // d3.selectAll(".tooltip").remove();
                        if (e.target.className.baseVal != "lines" &&
                            e.target.className.baseVal != "event_circle"
                            && !e.target.className.baseVal.includes("event-keyword")
                            ) {
                            // d3.selectAll(".tooltip").remove();
                            d3.selectAll(".tooltip").style("display", "none");
                            d3.selectAll('.knowledgemap-tip').remove();
                            mouseover_enable_map = true;
                            d3.selectAll('.event-keyword').attr('visibility', 'hidden');
                            event_circle_clicked = false;
                        }

                    })
                })


                // 生成全部作品点
                d3.json('json/en/works_list_v2.json').then((data) => {
                    workdata = data;
                    // console.log(data)
                    // console.log(data.works.length)
                    let mouseover_enable_map = true;

                    let groupedData = {};
                    for (let i = 0; i < data.works.length; i++) {
                        let jd = data.works[i]['经度'];
                        let wd = data.works[i]['纬度'];

                        let key = jd + ',' + wd;
                        if (!groupedData[key]) {
                            groupedData[key] = [];
                        }
                        groupedData[key].push(data.works[i]);
                    }

                    // Draw lines for each group of data points
                    for (let key in groupedData) {
                        let group = groupedData[key];
                        let jd = group[0]['经度'];
                        let wd = group[0]['纬度'];
                        let angleStep = 360 / group.length;
                        let angle = 10;
                        for (let i = 0; i < group.length; i++) {

                            let x1 = projection([jd, wd])[0];
                            let y1 = projection([jd, wd])[1];
                            let x2 = x1 + Math.cos(angle * Math.PI / 180) * 3.5;
                            let y2 = y1 + Math.sin(angle * Math.PI / 180) * 3.5;
                            let score = group[i]['score'];

                            let color = score === null ? "white" : colorScale(score);
                            let opacity = score === null ? 1 : opacityScale(score) * 0.8;
                            // 创建渐变元素
                            let gradientId = "gradient-" + score;
                            // let gradientId = group[i]['作品id'];
                            let gradient = svg.append("defs")
                                .append("linearGradient")
                                .attr("id", gradientId)
                                .attr('gradientUnits', 'userSpaceOnUse')
                                .attr("x1", "0%")
                                .attr("y1", "0%")
                                .attr("x2", "100%")
                                .attr("y2", "100%");

                            // 添加渐变的起始和结束颜色
                            gradient.append("stop")
                                .attr("offset", "0%")
                                .attr("stop-color", color)
                                .attr("stop-opacity", opacity);

                            gradient.append("stop")
                                .attr("offset", "100%")
                                .attr("stop-color", color)
                                .attr("stop-opacity", opacity * 0.3);


                            let strokeWidth = d3.scaleLinear()
                                .domain([0, 10])
                                .range([1, 2]);

                            // svg.append("image")
                            //     .attr("xlink:href", imageUrl1)
                            //     .attr("x", x1)
                            //     .attr("y", y1)
                            //     .attr("width", 10)
                            //     .attr("height", 10);
                            svg.append("line")
                                .attr("x1", x1)
                                .attr("y1", y1)
                                .attr("x2", x2)
                                .attr("y2", y2)
                                .attr("data-wenti", group[i]['文体'])
                                .attr("data-score", score)
                                .style("stroke-linecap", "round")
                                .style("stroke", "url(#" + gradientId + ")")
                                .style('cursor', 'pointer')
                                // .style("stroke-width", strokeWidth)
                                .attr("stroke-width", 3 / Math.pow(currentScale, 0.8))
                                // .style("opacity","0.6")
                                // .attr("class", class0)
                                .attr("class", "lines")
                                .on("mouseover", function (e) {
                                    if (mouseover_enable_map == true) {
                                        // 捕获鼠标光标的坐标
                                        const x = e.clientX + window.pageXOffset;
                                        const y = e.clientY + window.pageYOffset;

                                        // 创建悬浮框元素并设置属性
                                        var tooltip = d3.select("body")
                                            .append("div")
                                            .attr("class", "tooltip")

                                        // 添加渐变条
                                        tooltip.append("div")
                                            .attr("class", "tooltip-gradient")

                                        // 添加图标
                                        tooltip.append('div')
                                            .style('position', 'absolute')
                                            .style('background-color', '#5a7bd8')
                                            .style('color', 'white')
                                            .style('right', '7px')
                                            .style('top', '10px')
                                            .style('font-size', '15px')
                                            .text('Work');

                                        // 添加标题
                                        let title = tooltip.append('div').attr('class', 'knowledgemap-tip-title')
                                            .text(group[i]['作品名'])
                                            .style('font-weight', 'bolder')
                                            .style('padding-left', '10px')
                                            .style('max-width', '250px')
                                            .style('font-size', '16px')
                                            .style('margin-top', '3px')
                                            .style('margin-bottom', '10px');

                                        let info_div = tooltip.append('div').attr('class', 'knowledgemap-tip-info-div')
                                            .style('max-height', (screen_height - y - 80 - parseInt(title.style('height').slice(0, -2))) + 'px')
                                            .style('padding-left', '10px')
                                            .style('padding-right', '10px')
                                            .style('overflow', 'auto');
                                        // 添加内容
                                        info_div.append('div').text('Author').attr('class', 'knowledgemap-tip-subtitle');
                                        info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                                        info_div.append('div').text(group[i]['名字'])

                                        info_div.append('div').text('Dynasty').attr('class', 'knowledgemap-tip-subtitle');
                                        info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                                        info_div.append('div').text(group[i]['朝代'])

                                        info_div.append('div').text('Category').attr('class', 'knowledgemap-tip-subtitle');
                                        info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                                        info_div.append('div').text(group[i]['文体'])

                                        info_div.append('div').text('Content').attr('class', 'knowledgemap-tip-subtitle');
                                        info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                                        info_div.append('div').text(group[i]['诗歌全文'])


                                        info_div.append('div').text('Intro').attr('class', 'knowledgemap-tip-subtitle');
                                        info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                                        info_div.append('div').text(group[i]['内容简介'])


                                        // 设置悬浮框的位置
                                        tooltip.style("left", (x + 10) + "px")
                                            .style("top", (y + 10) + "px");
                                    }
                                })
                                .on("mouseout", function (e) {
                                    // 鼠标移出元素时删除悬浮框元素
                                    if (mouseover_enable_map) {
                                        d3.selectAll(".tooltip").remove();
                                    }
                                })
                                .on("click", function (e) {
                                    d3.selectAll(".tooltip").remove();
                                    if (mouseover_enable_map == true) {
                                        // 捕获鼠标光标的坐标
                                        const x = e.clientX + window.pageXOffset;
                                        const y = e.clientY + window.pageYOffset;

                                        // 创建悬浮框元素并设置属性
                                        var tooltip = d3.select("body")
                                            .append("div")
                                            .attr("class", "tooltip")

                                        // 添加渐变条
                                        tooltip.append("div")
                                            .attr("class", "tooltip-gradient")

                                        // 添加图标
                                        tooltip.append('div')
                                            .style('position', 'absolute')
                                            .style('background-color', '#5a7bd8')
                                            .style('color', 'white')
                                            .style('right', '7px')
                                            .style('top', '10px')
                                            .style('font-size', '15px')
                                            .text('Work');

                                        // 添加标题
                                        let title = tooltip.append('div').attr('class', 'knowledgemap-tip-title')
                                            .text(group[i]['作品名'])
                                            .style('font-weight', 'bolder')
                                            .style('padding-left', '10px')
                                            .style('max-width', '250px')
                                            .style('font-size', '16px')
                                            .style('margin-top', '3px')
                                            .style('margin-bottom', '10px');

                                        let info_div = tooltip.append('div').attr('class', 'knowledgemap-tip-info-div')
                                            .style('max-height', (screen_height - y - 80 - parseInt(title.style('height').slice(0, -2))) + 'px')
                                            .style('padding-left', '10px')
                                            .style('padding-right', '10px')
                                            .style('overflow', 'auto');
                                        // 添加内容
                                        info_div.append('div').text('Author').attr('class', 'knowledgemap-tip-subtitle');
                                        info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                                        info_div.append('div').text(group[i]['名字'])

                                        info_div.append('div').text('Dynasty').attr('class', 'knowledgemap-tip-subtitle');
                                        info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                                        info_div.append('div').text(group[i]['朝代'])

                                        info_div.append('div').text('Category').attr('class', 'knowledgemap-tip-subtitle');
                                        info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                                        info_div.append('div').text(group[i]['文体'])

                                        info_div.append('div').text('Content').attr('class', 'knowledgemap-tip-subtitle');
                                        info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                                        info_div.append('div').text(group[i]['诗歌全文'])


                                        info_div.append('div').text('Intro').attr('class', 'knowledgemap-tip-subtitle');
                                        info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                                        info_div.append('div').text(group[i]['内容简介'])


                                        // 设置悬浮框的位置
                                        tooltip.style("left", (x + 10) + "px")
                                            .style("top", (y + 10) + "px");
                                    }

                                    mouseover_enable_map = false;

                                });
                            angle += angleStep;
                        }
                    }

                    svg.on("click", function (e) {
                        // console.log(e.target.className.baseVal)
                        // d3.selectAll(".tooltip").remove();
                        if (e.target.className.baseVal != "lines" &&
                            e.target.className.baseVal != "event_circle"
                            && !e.target.className.baseVal.includes("event-keyword")
                            ) {
                            // d3.selectAll(".tooltip").remove();
                            d3.selectAll(".tooltip").style("display", "none");
                            d3.selectAll('.knowledgemap-tip').remove();
                            mouseover_enable_map = true;
                            // console.log("after click the blank:"+mouseover_enable_map);
                        }

                    })
                })
            }
            init_map_points();

        })

};

// })




/*
    全选
 */
// let showAllBtn = document.querySelector("#show-all-btn");
// showAllBtn.addEventListener("click", function() {
//     // 在这里实现取消筛选的逻辑
//     location_points("", "");
//     event_points("");
//     works_points("");
// });

/*
    作品筛选函数
 */
var works_points = function (dyn) {
    let sent = select_work_sent_box.value;
    let keywords = select_work_keywords_box.value;
    let wenti = select_work_wenti_box.value;

    d3.selectAll(".lines").remove();


    let data = workdata;
    let num = 0;
    let mouseover_enable_map = true;


    let groupedData = {};
    for (let i = 0; i < data.works.length; i++) {
        if ((data.works[i]['朝代'] == dyn || dyn == "") && (data.works[i]['情感1'] == sent || sent == "") && (data.works[i]['关键词'] == keywords || keywords == "") && (data.works[i]['文体'] == wenti || wenti == "")) {
            // if ((dynasties.indexOf(data.works[i]['朝代']) <= dynasties.indexOf(dyn) || dyn == "") && (data.works[i]['情感1'] == sent || sent == "") && (data.works[i]['关键词'] == keywords || keywords == "")) {
            num += 1;
            let jd = data.works[i]['经度'];
            let wd = data.works[i]['纬度'];

            // console.log(data.works[i]['经度'])


            let key = jd + ',' + wd;
            if (!groupedData[key]) {
                groupedData[key] = [];
            }
            groupedData[key].push(data.works[i]);
        }
    }
    // console.log(groupedData)

    // Draw lines for each group of data points
    for (let key in groupedData) {

        // console.log('@', key);
        let group = groupedData[key];
        let jd = group[0]['经度'];
        let wd = group[0]['纬度'];
        let angleStep = 360 / group.length;
        let angle = 10;
        for (let i = 0; i < group.length; i++) {

            let x1 = projection([jd, wd])[0];
            let y1 = projection([jd, wd])[1];
            let x2 = x1 + Math.cos(angle * Math.PI / 180) * 3.5;
            let y2 = y1 + Math.sin(angle * Math.PI / 180) * 3.5;
            let score = group[i]['score'];

            let strokeWidth = d3.scaleLinear()
                .domain([0, 10])
                .range([1, 2]);

            let color = score === null ? "white" : colorScale(score);
            let opacity = score === null ? 1 : opacityScale(score) * 0.8;

            // 创建渐变元素
            let gradientId = "gradient-" + score;
            // let gradientId = group[i]['作品id'];
            let gradient = svg.append("defs")
                .append("linearGradient")
                .attr("id", gradientId)
                .attr('gradientUnits', 'userSpaceOnUse')
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "100%")
                .attr("y2", "100%");

            // 添加渐变的起始和结束颜色
            gradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", color)
                .attr("stop-opacity", opacity);

            gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", color)
                .attr("stop-opacity", opacity * 0.3);

            // svg.append("image")
            //     .attr("xlink:href", imageUrl1)
            //     .attr("x", x1)
            //     .attr("y", y1)
            //     .attr("width", 10)
            //     .attr("height", 10);
            svg.append("line")
                .attr("x1", x1)
                .attr("y1", y1)
                .attr("x2", x2)
                .attr("y2", y2)
                .attr("data-wenti", group[i]['文体'])
                .attr("data-score", score)
                .style("stroke-linecap", "round")
                .style("stroke", "url(#" + gradientId + ")")
                // .style("stroke-width", strokeWidth)
                .attr("stroke-width", 3 / Math.pow(currentScale, 0.8))
                // .style("opacity","0.6")
                // .attr("class", class0)
                .attr("class", "lines")
                .style('cursor', 'pointer')
                .on("mouseover", function (e) {
                    if (mouseover_enable_map == true) {
                        // 捕获鼠标光标的坐标
                        const x = e.clientX + window.pageXOffset;
                        const y = e.clientY + window.pageYOffset;

                        // 创建悬浮框元素并设置属性
                        var tooltip = d3.select("body")
                            .append("div")
                            .attr("class", "tooltip")

                        // 添加渐变条
                        tooltip.append("div")
                            .attr("class", "tooltip-gradient")

                        // 添加图标
                        tooltip.append('div')
                            .style('position', 'absolute')
                            .style('background-color', '#5a7bd8')
                            .style('color', 'white')
                            .style('right', '7px')
                            .style('top', '10px')
                            .style('font-size', '15px')
                            .text('Work');

                        // 添加标题
                        let title = tooltip.append('div').attr('class', 'knowledgemap-tip-title')
                            .text(group[i]['作品名'])
                            .style('font-weight', 'bolder')
                            .style('padding-left', '10px')
                            .style('max-width', '250px')
                            .style('font-size', '16px')
                            .style('margin-top', '3px')
                            .style('margin-bottom', '10px');

                        let info_div = tooltip.append('div').attr('class', 'knowledgemap-tip-info-div')
                            .style('max-height', (screen_height - y - 80 - parseInt(title.style('height').slice(0, -2))) + 'px')
                            .style('padding-left', '10px')
                            .style('padding-right', '10px')
                            .style('overflow', 'auto');
                        // 添加内容
                        info_div.append('div').text('Author').attr('class', 'knowledgemap-tip-subtitle');
                        info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                        info_div.append('div').text(group[i]['名字'])

                        info_div.append('div').text('Dynasty').attr('class', 'knowledgemap-tip-subtitle');
                        info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                        info_div.append('div').text(group[i]['朝代'])

                        info_div.append('div').text('Category').attr('class', 'knowledgemap-tip-subtitle');
                        info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                        info_div.append('div').text(group[i]['文体'])

                        info_div.append('div').text('Content').attr('class', 'knowledgemap-tip-subtitle');
                        info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                        info_div.append('div').text(group[i]['诗歌全文'])

                        info_div.append('div').text('Intro').attr('class', 'knowledgemap-tip-subtitle');
                        info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                        info_div.append('div').text(group[i]['内容简介'])




                        // 设置悬浮框的位置
                        tooltip.style("left", (x + 10) + "px")
                            .style("top", (y + 10) + "px");
                    }
                })
                .on("mouseout", function (e) {
                    // 鼠标移出元素时删除悬浮框元素
                    if (mouseover_enable_map) {
                        d3.selectAll(".tooltip").remove();
                    }
                })
                .on("click", function (e) {
                    d3.selectAll(".tooltip").remove();
                    // console.log("clicked")
                    // console.log("after click:"+mouseover_enable_map)
                    if (mouseover_enable_map == true) {
                        // 捕获鼠标光标的坐标
                        const x = e.clientX + window.pageXOffset;
                        const y = e.clientY + window.pageYOffset;

                        // 创建悬浮框元素并设置属性
                        var tooltip = d3.select("body")
                            .append("div")
                            .attr("class", "tooltip")

                        // 添加渐变条
                        tooltip.append("div")
                            .attr("class", "tooltip-gradient")

                        // 添加图标
                        tooltip.append('div')
                            .style('position', 'absolute')
                            .style('background-color', '#5a7bd8')
                            .style('color', 'white')
                            .style('right', '7px')
                            .style('top', '10px')
                            .style('font-size', '15px')
                            .text('Work');

                        // 添加标题
                        let title = tooltip.append('div').attr('class', 'knowledgemap-tip-title')
                            .text(group[i]['作品名'])
                            .style('font-weight', 'bolder')
                            .style('padding-left', '10px')
                            .style('max-width', '250px')
                            .style('font-size', '16px')
                            .style('margin-top', '3px')
                            .style('margin-bottom', '10px');

                        let info_div = tooltip.append('div').attr('class', 'knowledgemap-tip-info-div')
                            .style('max-height', (screen_height - y - 80 - parseInt(title.style('height').slice(0, -2))) + 'px')
                            .style('padding-left', '10px')
                            .style('padding-right', '10px')
                            .style('overflow', 'auto');
                        // 添加内容
                        info_div.append('div').text('Author').attr('class', 'knowledgemap-tip-subtitle');
                        info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                        info_div.append('div').text(group[i]['名字'])

                        info_div.append('div').text('Dynasty').attr('class', 'knowledgemap-tip-subtitle');
                        info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                        info_div.append('div').text(group[i]['朝代'])

                        info_div.append('div').text('Category').attr('class', 'knowledgemap-tip-subtitle');
                        info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                        info_div.append('div').text(group[i]['文体'])

                        info_div.append('div').text('Content').attr('class', 'knowledgemap-tip-subtitle');
                        info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                        info_div.append('div').text(group[i]['诗歌全文'])

                        info_div.append('div').text('Intro').attr('class', 'knowledgemap-tip-subtitle');
                        info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                        info_div.append('div').text(group[i]['内容简介'])


                        // 设置悬浮框的位置
                        tooltip.style("left", (x + 10) + "px")
                            .style("top", (y + 10) + "px");
                    }

                    mouseover_enable_map = false;
                });
            angle += angleStep;
        }
    }

    svg.on("click", function (e) {
        // console.log(e.target.className.baseVal)
        // d3.selectAll(".tooltip").remove();
        if (e.target.className.baseVal != "lines" &&
            e.target.className.baseVal != "event_circle"
            && !e.target.className.baseVal.includes("event-keyword")
            ) {
            // d3.selectAll(".tooltip").remove();
            d3.selectAll(".tooltip").style("display", "none");
            d3.selectAll('.knowledgemap-tip').remove();
            mouseover_enable_map = true;
            // console.log("after click the blank:"+mouseover_enable_map)
        }

    })
};



/*
    地点筛选函数：
 */
var location_points = function (dyn, cat) {

    d3.selectAll(".location_circle").remove();
    let data = locationdata;
    let sentimentScores_map_2 = {};
    for (let category in data) {
        for (let item of data[category]) {
            let location = item["地名"];
            if (dyn === "") {
                dyn = "Modern";
            }
            if (dyn in keywords_2_workId_map) {
                if (location in keywords_2_workId_map[dyn]) {
                    sentimentScores_map_2[location] = keywords_2_workId_map[dyn][location]['until_average_score'];
                }
            }
        }
    }

    for (let key in data) {
        d3.selectAll()
        // if ((dynasties.indexOf(data[key][i]['朝代']) <= dynasties.indexOf(dyn) || dyn == "") && (key == cat || cat == "")) {
        if (key == cat || cat == "") {


            for (let i = 0; i < data[key].length; i++) {

                // if (data[key][i]['朝代'] == dyn || dyn == "") {
                if ((key == cat || cat == "")) {

                    let jd = data[key][i]['经度'];
                    let wd = data[key][i]['纬度'];
                    // console.log(jd);
                    let location = data[key][i]['地名'];
                    if (dyn === "") {
                        dyn = "Modern";
                    }
                    if (location in keywords_2_workId_map[dyn]) {
                        let score_map = keywords_2_workId_map[dyn][location]['until_average_score'];
                        // console.log(score_map)

                        svg.append("circle")
                            .attr("id", "location-icon-" + data[key][i]['地名'].replaceAll(' ', '-')) // 为每个地点图标元素添加一个唯一的 ID
                            .attr("cx", projection([jd, wd])[0])
                            .attr("cy", projection([jd, wd])[1])
                            .attr("r", 7 / currentScale)
                            .style('cursor', 'pointer')
                            // .style("fill", "green")  //#6496bc
                            .style("fill", function () {
                                if (score_map != 0) {
                                    let color = colorScale(score_map);
                                    return color;
                                } else {
                                    return "none";
                                }
                            })
                            .style("opacity", function () {
                                if (score_map != 0) {
                                    let opacity = opacityScale(score_map);
                                    return opacity;
                                } else {
                                    return 0.1;
                                }
                            })
                            .style("stroke", function () {
                                if (score_map == 0) {
                                    return current_mode_color.map_location;
                                } else {
                                    return "none";
                                }
                            })
                            .attr("stroke-width", 2 / Math.pow(currentScale, 0.8))
                            // .attr("class", "map")
                            .attr("class", "location_circle")

                            // svg.append("image")
                            //     .attr("xlink:href", "images/location_icon.svg")
                            //     .attr("id", "location-icon-" + data[key][i]['地名']) // 为每个地点图标元素添加一个唯一的 ID
                            //     .attr("x", projection([jd, wd])[0]) // - 7.5
                            //     .attr("y", projection([jd, wd])[1])  // - 12.5
                            //     .attr("width", 15 / currentScale)
                            //     .attr("height", 15 / currentScale)
                            //     .style("opacity", 0.5 * currentScale)
                            //     // .attr("class", "location_circle")
                            //     .attr("class", "location_circle")


                            .on("mouseover", function (e) {
                                // 捕获鼠标光标的坐标
                                const x = e.clientX + window.pageXOffset;
                                const y = e.clientY + window.pageYOffset;

                                d3.selectAll(".location-tip").remove();
                                // 创建悬浮框元素并设置属性
                                var tooltip = d3.select("body")
                                    .append("div")
                                    .attr("class", "location-tip")
                                    .text(data[key][i]['地名']);

                                // 设置悬浮框的位置
                                tooltip.style("left", (x + 10) + "px")
                                    .style("top", (y + 10) + "px");
                            })
                            .on("mouseout", function (e) {
                                // 鼠标移出元素时删除悬浮框元素
                                d3.selectAll(".location-tip").remove();
                            })
                            .on("click", function (e) {
                                // 删除已经添加的线段和文本元素
                                d3.selectAll(".location-highlight").remove();
                                draw_highlightLocation_inplace(data[key][i]['地名']);
                                clicked = true;
                                generate_info_container(data[key][i]['地名']);
                                // 绘制知识图谱——add by 白骐硕
                                let location_id = data[key][i]['地名id'];
                                draw_knowledge_map_by('location', location_id);
                            })
                    }
                }
            }
        }
    }
    d3.json("json/en/poems.json").then(function (data) {
        poems = data;
        poems_withLocation = Object.entries(poems['work']).filter(entries => entries[1]['location'].length > 0)
    })

}


/*
    事件筛选函数：
 */
var event_points = function (dyn) {

    d3.selectAll(".event_circle").remove();
    d3.selectAll('.event-keyword').remove();
    event_circle_clicked = false;

    let data = eventdata;
    let mouseover_enable_map = true;
    let location2event = new Object();

    for (let i = 0; i < data.events.length; i++) {

        if (data.events[i]['朝代'] != dyn && dyn != "") {
            continue;
        } else {
            // if ((dynasties.indexOf(data.events[i]['朝代']) <= dynasties.indexOf(dyn) || dyn == "")) {
            // 在这里添加事件
            let location = data.events[i]['地点'];
            if (!(location in location2event)) {
                location2event[location] = [];
            }
            location2event[location].push(i);
        }
    }
    Object.keys(location2event).forEach((location) => {
        let cur_event_index_list = location2event[location]
        let jd = data.events[cur_event_index_list[0]]['经度'];
        let wd = data.events[cur_event_index_list[0]]['纬度'];
        svg.append("circle")
            .attr("cx", projection([jd, wd])[0])
            .attr("cy", projection([jd, wd])[1])
            // .attr("r", 7)
            .attr("r", 3.5 / currentScale)
            .style("fill", current_mode_color.event)  //#6496bc
            .style("opacity", "0.6")
            // .attr("class", "map")
            // .style("z-index", 10)
            .attr("class", "event_circle")
            .style('cursor', 'pointer')
            .on('mouseover', (e) => {
                if (!event_circle_clicked) {
                    d3.selectAll('.event-keyword-' + location).attr('visibility', 'visible');
                }
            })
            .on('mouseout', (e) => {
                if (!event_circle_clicked) {
                    d3.selectAll('.event-keyword-' + location).attr('visibility', 'hidden');
                }
            })
            .on('click', (e) => {
                d3.selectAll('.event-keyword').attr('visibility', 'hidden');
                event_circle_clicked = true;
                d3.selectAll('.event-keyword-' + location).attr('visibility', 'visible');
            })

        let event_num = cur_event_index_list.length;
        let delta_angle = (360 / event_num) / 180 * Math.PI;
        let r = event_keyword_r / currentScale;
        let g = svg.append('g')
        cur_event_index_list.forEach((i, ii) => {
            let jd = data.events[i]['经度'];
            let wd = data.events[i]['纬度'];
            let cur_angle = delta_angle * ii;
            let cur_degree = (360 / event_num) * ii;
            let cx = projection([jd, wd])[0] + Math.cos(cur_angle) * r;
            let cy = projection([jd, wd])[1] + Math.sin(cur_angle) * r;
            g.append('text')
                .attr('x', cx)
                .attr('y', cy)
                .attr('data-angle', cur_angle)
                .attr('data-r', r)
                .attr('data-degree', cur_degree)
                .attr('transform', function () {
                    if (cur_degree <= 90) {
                        return `rotate(${cur_degree} ${cx} ${cy})`
                    } else if (cur_degree <= 270) {
                        return `rotate(${cur_degree - 180} ${cx} ${cy})`
                    } else {
                        return `rotate(${cur_degree - 360} ${cx} ${cy})`
                    }
                })
                .classed('event-keyword', true)
                .classed('event-keyword-' + location, true)
                .attr('text-anchor', function(){
                    if(cur_degree > 90 && cur_degree <= 270){
                        return 'end';
                    }else{
                        return 'start';
                    }
                })
                .attr('alignment-baseline', 'middle')
                .attr('visibility', 'hidden')
                .style('font-size', `${event_keyword_fontsize / currentScale}px`)
                .style('cursor', 'pointer')
                .text(data.events[i]['keyword'])
                .on("mouseover", function (e) {
                    // console.log("before mouseover:" + mouseover_enable_map)
                    if (mouseover_enable_map == true) {
                        // 捕获鼠标光标的坐标
                        const x = e.clientX + window.pageXOffset;
                        const y = e.clientY + window.pageYOffset;


                        // 创建悬浮框元素并设置属性
                        var tooltip = d3.select("body")
                            .append("div")
                            .attr("class", "tooltip")

                        // 添加渐变条
                        tooltip.append("div")
                            .attr("class", "tooltip-gradient")
                            .style("background", `linear-gradient(${'#a2a2cc'}, #ffffff)`)

                        // 添加图标
                        tooltip.append('div')
                            .style('position', 'absolute')
                            .style('background-color', '#a2a2cc')
                            .style('color', 'white')
                            .style('right', '7px')
                            .style('top', '10px')
                            .style('font-size', '15px')
                            .text('Event');

                        // 添加标题
                        let title = tooltip.append('div').attr('class', 'knowledgemap-tip-title')
                            .text(data.events[i]['事件名称'])
                            .style('font-weight', 'bolder')
                            .style('padding-left', '10px')
                            .style('max-width', '250px')
                            .style('font-size', '16px')
                            .style('margin-top', '3px')
                            .style('margin-bottom', '10px');

                        let info_div = tooltip.append('div').attr('class', 'knowledgemap-tip-info-div')
                            .style('max-height', (screen_height - y - 80 - parseInt(title.style('height').slice(0, -2))) + 'px')
                            .style('padding-left', '10px')
                            .style('padding-right', '10px')
                            .style('overflow', 'auto');
                        // 添加内容
                        info_div.append('div').text('People').attr('class', 'knowledgemap-tip-subtitle');
                        info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                        info_div.append('div').text(data.events[i]['相关人物'])

                        info_div.append('div').text('Dynasty').attr('class', 'knowledgemap-tip-subtitle');
                        info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                        info_div.append('div').text(data.events[i]['朝代'])

                        info_div.append('div').text('Intro').attr('class', 'knowledgemap-tip-subtitle');
                        info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                        info_div.append('div').text(data.events[i]['事件内容'])


                        // 设置悬浮框的位置
                        tooltip.style("left", (x + 10) + "px")
                            .style("top", (y + 10) + "px");
                    }
                })

                .on("mouseout", function (e) {
                    // 鼠标移出元素时删除悬浮框元素
                    if (mouseover_enable_map) {
                        d3.selectAll(".tooltip").remove();
                    }

                })
                .on("click", function (e) {
                    // 捕获鼠标光标的坐标
                    d3.selectAll(".tooltip").remove();

                    const x = e.clientX + window.pageXOffset;
                    const y = e.clientY + window.pageYOffset;


                    // 创建悬浮框元素并设置属性
                    var tooltip = d3.select("body")
                        .append("div")
                        .attr("class", "tooltip")
                        .style("display", "block"); // 添加这一行

                    // 添加渐变条
                    tooltip.append("div")
                        .attr("class", "tooltip-gradient")
                        .style("background", `linear-gradient(${'#a2a2cc'}, #ffffff)`)

                    // 添加图标
                    tooltip.append('div')
                        .style('position', 'absolute')
                        .style('background-color', '#a2a2cc')
                        .style('color', 'white')
                        .style('right', '7px')
                        .style('top', '10px')
                        .style('font-size', '15px')
                        .text('Event');

                    // 添加标题
                    let title = tooltip.append('div').attr('class', 'knowledgemap-tip-title')
                        .text(data.events[i]['事件名称'])
                        .style('font-weight', 'bolder')
                        .style('padding-left', '10px')
                        .style('max-width', '250px')
                        .style('font-size', '16px')
                        .style('margin-top', '3px')
                        .style('margin-bottom', '10px');

                    let info_div = tooltip.append('div').attr('class', 'knowledgemap-tip-info-div')
                        .style('max-height', (screen_height - y - 80 - parseInt(title.style('height').slice(0, -2))) + 'px')
                        .style('padding-left', '10px')
                        .style('padding-right', '10px')
                        .style('overflow', 'auto');
                    // 添加内容
                    info_div.append('div').text('People').attr('class', 'knowledgemap-tip-subtitle');
                    info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                    info_div.append('div').text(data.events[i]['相关人物'])

                    info_div.append('div').text('Dynasty').attr('class', 'knowledgemap-tip-subtitle');
                    info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                    info_div.append('div').text(data.events[i]['朝代'])

                    info_div.append('div').text('Intro').attr('class', 'knowledgemap-tip-subtitle');
                    info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
                    info_div.append('div').text(data.events[i]['事件内容'])


                    // 设置悬浮框的位置
                    tooltip.style("left", (x + 10) + "px")
                        .style("top", (y + 10) + "px");

                    mouseover_enable_map = false;
                    // console.log("after click:"+mouseover_enable_map)
                });
        })

    })
    svg_origin.on("click", function (e) {
        // console.log(e.target.className.baseVal)
        // d3.selectAll(".tooltip").remove();
        if (e.target.className.baseVal != "lines" &&
            e.target.className.baseVal != "event_circle" 
            && !e.target.className.baseVal.includes("event-keyword")
            ) {
            // console.log(e.target.className.baseVal)
            // d3.selectAll(".tooltip").remove();
            d3.selectAll(".tooltip").style("display", "none");
            d3.selectAll('.knowledgemap-tip').remove();
            mouseover_enable_map = true;
            d3.selectAll('.event-keyword').attr('visibility', 'hidden');
            event_circle_clicked = false;
        }

    })
}










// selectbox1的筛选
select_show_box.addEventListener('change', function (show) {
    // console.log(show)
    const event_circle = svg.selectAll(".event_circle")
    const work_line = svg.selectAll(".lines")
    const location_circle = svg.selectAll(".location_circle")

    show = select_show_box.value
    // console.log(show)
    if (show == "") {
        // console.log("select_dyn: "+select_dyn)


        event_circle.style("display", "block");
        work_line.style("display", "block");
        location_circle.style("display", "block");




    }

    else if (show == "地点") {
        event_circle.style("display", "none");
        work_line.style("display", "none");
        location_circle.style("display", "block");
    }

    else if (show == "作品") {
        event_circle.style("display", "none");
        work_line.style("display", "block");
        location_circle.style("display", "none");
    }


    else if (show == "事件") {
        event_circle.style("display", "block");
        work_line.style("display", "none");
        location_circle.style("display", "none");
    }



})



// 作品的筛选条件：1.朝代；2.情感；3.关键词
select_work_sent_box.addEventListener('change', function () {
    works_points(dyn);
});
select_work_keywords_box.addEventListener('change', function () {
    works_points(dyn);
});
select_work_wenti_box.addEventListener('change', function () {
    works_points(dyn);
});






// 绘制空心圆
// svg_origin.append("circle")
// .attr("cx", width / 2)
// .attr("cy", height / 2 -50)
// .attr("r", '36%')
// .style("fill", "none")
// // .style("stroke", "#70896d")
// .style("stroke", "white")
// .style("stroke-width", 8)
// // .style("opacity",0.3);

// 剪切区域路径
// svg_origin.append("clipPath")
//   .attr("id", "clipCircle")
//   .append("circle")
//   .attr("cx", width / 2)
//   .attr("cy", height / 2 -50)
//   .attr("r",'36%')
//   .attr("stroke-width", 1)
//   .attr("stroke", "#999");

// 应用剪切路径
// svg_origin.attr("clip-path", "url(#clipCircle)");

// svg.append("image")
//     .attr("xlink:href", "images/李白.png");
//     // .attr("x", x_position)
//     // .attr("y", y_position)
//     // .attr("width", image_width)
//     // .attr("height", image_height);

let libai = document.createElement("img");
libai.src = "images/李白.png";
libai.style.position = "absolute";
libai.style.left = 650 + "px";
libai.style.top = 150 + "px";
libai.style.width = 150 + "px";
libai.style.height = 150 + "px";
// libai.style.transform = "rotate(-30deg)";
libai.style.opacity = 0.9;
//暂时注释掉
// document.body.appendChild(libai);

libai.addEventListener("click", function () {
    // 在这里添加你的代码，实现点击图像时突出李白的效果
    let libai_id = 695; // 假设李白在知识图谱中的 ID 为 "person-1"
    draw_knowledge_map_by_person(libai_id);

    // d3.select('#knowledge-map-node-' + libai_id).select('circle').transition().duration(highlight_transition_duration).attr('stroke-width', 2.5);
    // d3.selectAll('.g-knowledge-map-node').transition().duration(highlight_transition_duration).attr('opacity', 0.15);
    // d3.selectAll('.knowledge-map-line').transition().duration(highlight_transition_duration).attr('opacity', 0.15);
    // d3.selectAll('.knowledge-map-set-' + libai_id).transition().duration(highlight_transition_duration).attr('opacity', 1);
});

// function highlightLocation(locationName) {
//     // 选择对应的地点图标元素
//     let locationIcon = d3.select("#location-icon-" + locationName);
//     let x = parseFloat(locationIcon.attr("x"));
//     let y = parseFloat(locationIcon.attr("y"));
//     // 在地图上添加一个圆形元素
//     svg.append("circle")
//         .attr("cx", x)
//         .attr("cy", y)
//         .attr("r", 5)
//         .style("fill", "none")
//         .style("stroke", "red")
//         .style("stroke-width", 1)
//         .attr("class", "location_circle")
//         ;
//         // 使用 transition 方法添加过渡动画
//     locationIcon.transition()
//       .duration(500) // 过渡动画持续时间
//     //   .attr("width", 300) // 放大图标的宽度
//     //   .attr("height", 300) // 放大图标的高度
//       .attr("opacity", 1); // 改变图标的颜色
//   }

function draw_highlightLocation_inplace(locationName) {
    // 删除已经添加的线段和文本元素
    d3.selectAll(".location-highlight").remove();
    // 选择对应的地点图标元素
    let locationIcon = d3.select("#location-icon-" + locationName.replaceAll(' ', '-'));
    // 获取地点图标的坐标
    let x = parseFloat(locationIcon.attr("cx"));
    let y = parseFloat(locationIcon.attr("cy")) + 8;
    // 计算线段的起点和终点坐标
    let x1 = x;
    let y1 = y - 10;
    let x2 = x;
    let y2 = y - 40;
    // 在容器元素中添加一条线段
    svg.append("line")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .style("stroke", "black")
        .style("opacity", "0.5")
        .style("stroke-width", 1)
        .style("stroke-dasharray", "3,2") // 设置虚线的样式
        .attr("class", "location-highlight")
        ;
    // 在容器元素中添加一个文本元素，用于显示地名
    svg.append("text")
        .attr("x", x)
        .attr("y", y - 40)
        .attr("text-anchor", "middle")
        .style("font-size", 12)
        .style("opacity", "0.5")
        .text(locationName)
        .attr("class", "location-highlight")
        ;
}

function highlightLocation(locationName) {
    // 删除已经添加的线段和文本元素
    d3.selectAll(".location-highlight").remove();
    // 选择对应的地点图标元素
    let locationIcon = d3.select("#location-icon-" + locationName.replaceAll(' ', '-'));
    // 获取地点图标的坐标
    let x = parseFloat(locationIcon.attr("cx"));
    let y = parseFloat(locationIcon.attr("cy")) + 8;
    // 计算缩放比例和平移量
    let scale = 5;
    let translate = [width / 2 - scale * x, height / 2 - scale * y];
    // 更新地图的缩放比例和平移量
    svg_origin.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
    // 计算线段的起点和终点坐标
    let x1 = x;
    let y1 = y - 10;
    let x2 = x;
    let y2 = y - 80;
    // 在容器元素中添加一条线段
    svg.append("line")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .style("stroke", "black")
        .style("opacity", "0.5")
        .style("stroke-width", 1)
        .style("stroke-dasharray", "3,2") // 设置虚线的样式
        .attr("class", "location-highlight")
        ;
    // 在容器元素中添加一个文本元素，用于显示地名
    svg.append("text")
        .attr("x", x)
        .attr("y", y - 80)
        .attr("text-anchor", "middle")
        .style("font-size", 12)
        .style("opacity", "0.5")
        .text(locationName)
        .attr("class", "location-highlight")
        ;
}




// $('#knowledge-map-node-' + id).click()
window.addEventListener("message", function (event) {
    if (event.data.type === "HIGHLIGHT_LOCATION") {
        // 获取传递过来的地点名称
        let locationName = event.data.locationName;
        // 调用 highlightLocation 函数突出显示对应的地点图标
        highlightLocation(locationName);
    }
});








