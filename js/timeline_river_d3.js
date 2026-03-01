// 定义朝代顺序
let dynasties = ['Eastern Wu', 'Jin', 'Southern Dynasties', 'Tang','Southern Tang', 'Song', 'Yuan', 'Ming', 'Qing', 'Modern'];
// 创建一个空对象来存储数据
  let dynastyBackgrounds = {
    'Eastern Wu': "images/建业.png", 
    'Jin': "images/建康.png",
    'Southern Dynasties': "images/建康.png", 
    'Tang': "images/金陵.png",
    'Southern Tang': "images/江宁.png", 
    'Song': "images/白下.png",
    'Yuan': "images/集庆.png", 
    'Ming': "images/应天.png",
    'Qing': "images/江宁.png", 
    'Modern': "images/南京.png",
  }
  
let sentiment = [0.378, 0.618, 0.618, 0.364, 0.397, 0.458, 0.331, 0.360, 0.397, 0.459];
// let sentiment = [0, 0.378, 0, 0.618, 0, 0.618, 0, 0.364, 0, 0.397, 0, 0.458, 0, 0.331, 0, 0.360, 0, 0.397, 0, 0.459, 0 ];
// let sentiment_dyn = [0, 0.271, 0, 0.343,0, 0.249, 0, 0.344, 0, 0.356, 0, 0.318, 0, 0.392, 0, 0.316, 0, 0.370, 0, 0.248, 0 ];
let dynasty_start_time = [229, 265, 420, 618, 937, 960, 1271, 1368, 1644, 1912];
let dynasty_end_time = [280, 420, 589, 907, 975, 1279, 1368, 1644, 1912, 2024];
let timeline_height = $('.chart5').height();
let timeline_width = $('.chart5').width();
let timeline_svg = d3.select('.chart5').append('svg').attr('viewBox', [0, 0, timeline_width, timeline_height]);
let timeline_padding_h = 0.02; //百分比
let timeline_scale_x = d3.scaleLinear().domain([dynasty_start_time[0], dynasty_end_time[dynasty_end_time.length - 1]]).range([timeline_padding_h * timeline_width, timeline_width * (1 - timeline_padding_h)]);
let timeline_padding_top = 0.1; 
let timeline_padding_bottom = 15;
let timeline_scale_y = d3.scaleLinear().domain([0, 1]).range([timeline_height - timeline_padding_bottom, timeline_height * timeline_padding_top]);
// 创建渐变
let timeline_gradient = timeline_svg.append('defs')
  .append('linearGradient')
    .attr('id', 'timeline-gradient')
    .attr('x1', '0%') // 渐变开始的 x 坐标
    .attr('y1', '0%') // 渐变开始的 y 坐标
    .attr('x2', '0%') // 渐变结束的 x 坐标
    .attr('y2', '100%'); // 渐变结束的 y 坐标

// 定义渐变起点的颜色
timeline_gradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', convertRGBtoRGBA(current_mode_color.timeline_river, 0.8)); // 较深的颜色

// 定义渐变终点的颜色
timeline_gradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', convertRGBtoRGBA(current_mode_color.timeline_river, 0)); // 较浅的颜色
let dynasty_paths_g = timeline_svg.append('g');
let curve_generator = d3.line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(d3.curveBumpX);
let area_generator = d3.area()
    .x(d => d.x)
    .y0(timeline_height - timeline_padding_bottom)
    .y1(d => d.y)
    .curve(d3.curveBumpX);

let timeline_clicked = false;
// area
dynasty_paths_g.selectAll('path').data(dynasties).join('path')
    .attr('class', 'timeline-area')
    .attr('d', (d, i) => {
        let data = [];
        data.push({'x': timeline_scale_x(dynasty_start_time[i]), 'y': timeline_scale_y(0)});
        data.push({'x': timeline_scale_x((dynasty_start_time[i] + dynasty_end_time[i])/2), 'y': timeline_scale_y(sentiment[i])});
        data.push({'x': timeline_scale_x(dynasty_end_time[i]), 'y': timeline_scale_y(0)});
        return area_generator(data);
    })
    .attr('fill', 'url(#timeline-gradient)')
    .style('cursor', 'pointer')
    .on('click', (e, d) => {
        if(dyn != d){
            timeline_clicked = true;
            timeline_isplaying = false;
            unchooseDynasty(dyn);
            chooseDynasty(d);
        }
    })
    .on('mouseover', function(e, d){
        if(dynasty_node_num.length != 0){
            let i = dynasties.indexOf(d);
            d3.select(`#ring-${i}`).attr('fill', convertRGBtoRGBA(current_mode_color.timeline_river, 0.15));
            knowledge_map_info_text.text(`${dynasties[i]}`)
            d3.selectAll('.g-knowledge-map-node').transition().duration(highlight_transition_duration).attr('opacity', 0.15);
            d3.selectAll('.knowledge-map-line').transition().duration(highlight_transition_duration).attr('opacity', 0.15);
            d3.selectAll('.g-knowledge-map-node-dynasty-id-' + i).transition().duration(highlight_transition_duration).attr('opacity', 1);
        }
    })
    .on('mouseout', function(e, d){
        if(dynasty_node_num.length != 0){
            let i = dynasties.indexOf(d);
            d3.select(`#ring-${i}`).attr('fill', 'transparent');
            knowledge_map_info_text.text('');
            d3.selectAll('.g-knowledge-map-node').transition().duration(highlight_transition_duration).attr('opacity', 1);
            d3.selectAll('.knowledge-map-line').transition().duration(highlight_transition_duration).attr('opacity', 1);
        }
    });
// 朝代名
timeline_svg.append('g').selectAll('text').data(dynasties).join('text')
    .attr('id', d => `text-${d.replaceAll(' ', '')}`)
    .attr('x', (d, i) => {
        return timeline_scale_x((dynasty_start_time[i] + dynasty_end_time[i])/2);
    })
    .attr('y', timeline_height - timeline_padding_bottom + 8)
    .text(d => d)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('opacity', 0.7)
    .style('cursor', 'pointer')
    .style('font-size', '12px')
    .on('click', (e, d) => {
        if(dyn != d){
            timeline_clicked = true;
            timeline_isplaying = false;
            unchooseDynasty(dyn);
            chooseDynasty(d);
        }
    });
// circle
timeline_svg.append('g').selectAll('circle').data(dynasties).join('circle')
    .attr('id', d => `circle-${d.replaceAll(' ', '')}`)
    .attr('cx', (d, i) => {
        return timeline_scale_x((dynasty_start_time[i] + dynasty_end_time[i])/2);
    })
    .attr('cy', (d, i) => timeline_scale_y(sentiment[i]))
    .attr('r', 5)
    .attr('fill', 'white')
    .attr('stroke', current_mode_color.timeline_river)
    .attr('display', 'none')
    .attr('opacity', 0);;
// 数字
timeline_svg.append('g').selectAll('text').data(dynasties).join('text')
    .attr('id', d => `sent-${d.replaceAll(' ', '')}`)
    .attr('x', (d, i) => {
        return timeline_scale_x((dynasty_start_time[i] + dynasty_end_time[i])/2);
    })
    .attr('y', (d, i) => timeline_scale_y(sentiment[i]) - 8)
    .text((d, i) => sentiment[i])
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'baseline')
    .style('font-size', '12px')
    .attr('display', 'none')
    .attr('opacity', 0);;

// hightline rect
timeline_svg.append('g').selectAll('rect').data(dynasties).join('rect')
    .attr('id', d => `rect-${d.replaceAll(' ', '')}`)    
    .attr('x', (d, i) => {
        return timeline_scale_x((dynasty_start_time[i] + dynasty_end_time[i])/2);
    })
    .attr('y', timeline_height - timeline_padding_bottom + 8)
    .attr('height', 20)
    .attr('width', (d, i) => document.getElementById(`text-${d.replaceAll(' ', '')}`).getBBox().width + 8)
    .attr('transform', d => `translate(${-(document.getElementById(`text-${d.replaceAll(' ', '')}`).getBBox().width + 8)/2} -10)`)
    .attr('fill', current_mode_color.timeline_river_rect)
    .attr('display', 'none')
    .attr('opacity', 0);
timeline_svg.append('g').selectAll('text').data(dynasties).join('text')
    .attr('id', d => `htext-${d.replaceAll(' ', '')}`)   
    .attr('x', (d, i) => {
        return timeline_scale_x((dynasty_start_time[i] + dynasty_end_time[i])/2);
    })
    .attr('y', timeline_height - timeline_padding_bottom + 8)
    .text(d => d)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .style('font-size', '12px')
    .attr('fill', 'white')
    .attr('display', 'none')
    .attr('opacity', 0);

let timeline_transition_duration = 400;
let background_transition_duration = 400;
let select_dyn = null
// 回调函数
// 选择一个朝代
function chooseDynasty(dynasty){     
    dyn = dynasty;
    select_dyn = dynasty.replaceAll(' ', '');
    d3.select(`#sent-${select_dyn}`).attr('display', '');
    d3.select(`#circle-${select_dyn}`).attr('display', '');
    d3.select(`#rect-${select_dyn}`).attr('display', '');
    d3.select(`#htext-${select_dyn}`).attr('display', '');
    d3.select(`#sent-${select_dyn}`).transition().duration(timeline_transition_duration).attr('opacity', 0.7);
    d3.select(`#circle-${select_dyn}`).transition().duration(timeline_transition_duration).attr('opacity', 1);
    d3.select(`#rect-${select_dyn}`).transition().duration(timeline_transition_duration).attr('opacity', 1);
    d3.select(`#htext-${select_dyn}`).transition().duration(timeline_transition_duration).attr('opacity', 1);
    // map view
    // 检查选择框的值并进行元素筛选
    let show = select_show_box.value;
    const event_circle = svg.selectAll(".event_circle")
    const work_line = svg.selectAll(".lines")
    const location_circle = svg.selectAll(".location_circle")

    if (show == "") {
        event_circle.style("display", "block");
        work_line.style("display", "block");
        location_circle.style("display", "block");
        works_points(dyn);
        location_points(dyn, "");
        event_points(dyn);
    } else if (show == "地点") {
        event_circle.style("display", "none");
        work_line.style("display", "none");
        location_circle.style("display", "block");
        location_points(dyn, "");
    } else if (show == "作品") {
        event_circle.style("display", "none");
        work_line.style("display", "block");
        location_circle.style("display", "none");
        works_points(dyn);
    } else if (show == "事件") {
        event_circle.style("display", "block");
        work_line.style("display", "none");
        location_circle.style("display", "none");
        event_points(dyn);
    }
    // distribution view
    location_bar(dyn);
    // drawPieChart(dyn, false)
    // info view
    set_litform_selectBox(dyn);
    // knowledgemap
    update_knowledge_map_by_dynasty_event_score(dyn);
    // background
    d3.select('#bg-image').transition().duration(background_transition_duration).style('opacity', 0);
    setTimeout(() => {
        d3.select('#bg-image').attr('src', dynastyBackgrounds[dyn]);
        setTimeout(()=>{d3.select('#bg-image').transition().duration(background_transition_duration).style('opacity', 1);}, 100) //稍微等图片渲染一下
    }, timeline_transition_duration);
}
// 取消选择
function unchooseDynasty(dynasty){
    if(dynasty == '') return;
    let select_dyn = dynasty.replaceAll(' ', '');
    d3.select(`#sent-${select_dyn}`).transition().duration(timeline_transition_duration).attr('opacity', 0);
    d3.select(`#circle-${select_dyn}`).transition().duration(timeline_transition_duration).attr('opacity', 0);
    d3.select(`#rect-${select_dyn}`).transition().duration(timeline_transition_duration).attr('opacity', 0);
    d3.select(`#htext-${select_dyn}`).transition().duration(timeline_transition_duration).attr('opacity', 0);
    setTimeout(() => {
        d3.select(`#sent-${select_dyn}`).attr('display', 'none');
    }, timeline_transition_duration);
    setTimeout(() => {
        d3.select(`#circle-${select_dyn}`).attr('display', 'none');
    }, timeline_transition_duration);
    setTimeout(() => {
        d3.select(`#rect-${select_dyn}`).attr('display', 'none');
    }, timeline_transition_duration);
    setTimeout(() => {
        d3.select(`#htext-${select_dyn}`).attr('display', 'none');
    }, timeline_transition_duration);
}

// 自动播放器
let timeline_isplaying = false;
let timeline_playInterval = 2000;
let timeline_playTimer = setInterval(function(){
    if(timeline_isplaying){
        let cur_dynasty_id = dynasties.indexOf(dyn);
        if(cur_dynasty_id == dynasties.length - 1){
            timeline_isplaying = false;
        }else{
            unchooseDynasty(dynasties[cur_dynasty_id])
            chooseDynasty(dynasties[cur_dynasty_id + 1]);
        }
    }
}, timeline_playInterval);
// play/pause button
const button_size = 30;
let timeline_playpause_button = timeline_svg.append('g')
    .append('image')
    .attr('width', button_size)
    .attr('height', button_size)
    .attr('x', timeline_width - button_size/2 - 10)
    .attr('y', button_size/2 + 20)
    .attr('xlink:href', current_mode_image.timeline_river_stop_icon)
    .attr('transform', `translate(${-button_size/2} ${-button_size/2})`)
    .attr('opacity', 0.6)
    .style('cursor', 'pointer')
    .attr('id', 'timeline_playpause_button')
    .on('click', function(){
        timeline_clicked = true;
        timeline_isplaying = !timeline_isplaying;
    })
    .on('mousedown', function(){
        d3.select(this).attr('opacity', 0.6)
    })
    .on('mouseup', function(){
        d3.select(this).attr('opacity', 0.9)
    })
    .on('mouseover', function(){
        d3.select(this).attr('opacity', 0.9)
    })
    .on('mouseout', function(){
        d3.select(this).attr('opacity', 0.6)
    });

// 延时一段后，打开timer
setTimeout(() => {
    if(!timeline_clicked){ //在等待文件加载时没被点
        chooseDynasty(dynasties[0]);
        timeline_isplaying = true;
    }
}, 2500);