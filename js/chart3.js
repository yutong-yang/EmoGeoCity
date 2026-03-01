// global variables
let location_mode_version = 2 // 1 or 2
let links_is_arc = true; //true:连线用曲线 false: 连线用直线
let simulation = null;
let svg_height_knowledgemap = $('.chart3').height();
let svg_width_knowledgemap = $('.chart3').width();
let nodes = [];
let links = [];
let knowledge_map = null;
let is_whole_map = false;
let svg_knowledgemap = d3.select('.chart3').append('svg')
    .attr('viewBox', [0, 0, svg_width_knowledgemap, svg_height_knowledgemap])
    // .attr('width', svg_width_knowledgemap)
    // .attr('height', svg_height_knowledgemap)
    .attr('class', 'svg-knowledgemap')
    // .style('overflow', 'visible');
let g_knowledgemap = svg_knowledgemap.append('g').attr('class', 'g-knowledge-map').attr('id', 'g-knowledge-map').attr('transform', d3.zoomIdentity);
// 添加缩放和拖拽效果
let knowledge_map_zoom = d3.zoom()
.extent([[0, 0], [svg_width_knowledgemap, svg_height_knowledgemap]])
.scaleExtent([0.05, 5])
.on("zoom", svg_knowledgemap_zoomed)
svg_knowledgemap.call(knowledge_map_zoom);
let highlight_transition_duration = 600;
let circle_r;
svg_knowledgemap.on('click', function(e){
    if(d3.select(e.target).attr('class') == 'svg-knowledgemap'){
        if(cur_click_id != null){
            // 取消上次选定的内容
            // d3.select('#knowledge-map-node-' + cur_click_id).select('circle').transition().duration(highlight_transition_duration).attr('stroke-width', 1);
            let type = cur_click_id.slice(0, cur_click_id.indexOf('-'));
            d3.selectAll('.g-knowledge-map-node').transition().duration(highlight_transition_duration).attr('opacity', 1);
            d3.selectAll('.knowledge-map-line').transition().duration(highlight_transition_duration).attr('opacity', 1);
            d3.select('#knowledge-map-node-' + cur_click_id).select('image').attr('transform', `translate(${-circle_r[type]}, ${-circle_r[type]})`);
            d3.select('#knowledge-map-node-' + cur_click_id).select('image').attr('width', 2 * (circle_r[type])).attr('height', 2 * (circle_r[type]));
            // 删除tip面板
            remove_knowledge_map_tip();
            mouseover_enable = true;
            cur_click_id = null;
        }
    }
});
let has_extend_id = new Map();
let has_included_link = new Map();
let mouseover_enable = true;
let cur_click_id = null;
let relative_list = ['event', 'person', 'work', 'location', 'poem'];
let knowledge_map_dynasty_id = 9;
let knowledge_map_dynasty_list = ['Eastern Wu', 'Jin', 'Southern Dynasties', 'Tang', 'Southern Tang', 'Song', 'Yuan', 'Ming', 'Qing', 'Modern'];
let knowledge_map_event_score_range = new Object();
knowledge_map_event_score_range.low = 0;
knowledge_map_event_score_range.high = 10;

// 右上角info
let knowledge_map_info_text = svg_knowledgemap.append('g').append('text').attr('alignment-baseline', 'baseline').attr('text-anchor', 'end').attr('x', svg_width_knowledgemap - 10).attr('y', svg_height_knowledgemap - 10).style('font-size', '15px');

// color define
const type_color = {'person': '', 'event': '#a2a2cc', 'location': '#5a7bd8', 'work': '#5a7bd8', 'poem': '#5a7bd8'};
let person_type_color = new Object();
let node_type_image_list = ['伶', '僧', '将', '文', '曲', '术', '艺', 'none']
node_type_image_list.forEach(d => {
    person_type_color[d] = current_mode_color.person_type_color[d];
})

const unique_nodes = function(nodes){
    const res = new Map();
    // return nodes.filter((item) => !res.has(item['id']) && res.set(item['id'], 1));
    return nodes.filter((item) => item['id'] != 'person-2507' && !res.has(item['id']) && res.set(item['id'], 1));
}
const unique_links = function(links){
    const res = new Map();
    // return links.filter((item) => !res.has(item.source + ' ' + item.target) && res.set(item.source + ' ' + item.target, 1) && res.set(item.target + ' ' + item.source, 1));
    return links.filter((item) => item.source != 'person-2507' && item.target != 'person-2507' && !res.has(item.source + ' ' + item.target) && res.set(item.source + ' ' + item.target, 1) && res.set(item.target + ' ' + item.source, 1));
}

const chart3_display= function(){
    // d3.select('.chart').style('display', 'none');
    // d3.select('.chart2').style('display', 'none');
    // d3.select('.chart4').style('display', 'none');
    d3.select('.chart3').style('display', 'inline');
    d3.selectAll('.knowledgemap-tip').style('display', 'inline');
}

// 点击node扩展图谱
const click_extend_map = function(d){
    // 参数： d -> {id:..., name:..., type:...}
    // 更新nodes和links
    if(simulation != null){
        // // console.log('Simulation Stop!')
        simulation.stop();
    }
    let cur_object = d;
    // // console.log(cur_object);
    update_nodes_links(cur_object);
    // // console.log(nodes);
    // // console.log(links);
    draw_knowledge_map_by_nodes_links();
};

// 缩放
function svg_knowledgemap_zoomed(e) {
    // console.log(e);
    g_knowledgemap.attr("transform", e.transform);
}

// 更新nodes和links数组
const update_nodes_links = function(cur_object){
    // 参数：cur_object -> {id:..., name:..., type:...}
    // 去除simulation时向nodes和links中添加的信息
    nodes = nodes.map(d =>{
        return {
            id: d.id,
            name: d.name,
            type: d.type,
            dynasty_id: d.dynasty_id
        };
    });
    links = links.map(d => {
        if(d.source.id == undefined){
            return {
                source: d.source,
                target: d.target
            };
        }else{
            return {
                source: d.source.id,
                target: d.target.id
            };
        }
        
    })
    // 根据当前节点向nodes和links中添加内容
    nodes.push({
        id: cur_object.id,
        name: cur_object.name,
        type: cur_object.type,
        dynasty_id: cur_object.dynasty_id
    });
    relative_list.forEach(cur_list_name => {
        knowledge_map[cur_object.type][cur_object.id][cur_list_name].forEach(d => {
            nodes.push({
                id: d.id,
                name: d.name,
                type: cur_list_name,
                dynasty_id: d.dynasty_id
            });
            links.push({
                source: cur_object.id,
                target: d.id
            })
        });
    });
    nodes = unique_nodes(nodes);
    links = unique_links(links);
    links.forEach(d => {
        has_included_link.set(d.source + ' ' + d.target, 1);
        has_included_link.set(d.target + ' ' + d.source, 1);
    })
};

// 画出tip面板
const draw_knowledge_map_tip = function(d){
    // 生成tip
    let width = 250;
    let height = svg_height_knowledgemap - 80;
    let x = $('#main').width() - width - 30;
    let y = 430;
    let detail = knowledge_map[d.type][d.id].detail;
    // let btn_height = 30;
    let cur_type_color = null;
    if(d.type === 'person'){
        cur_type_color = person_type_color[knowledge_map[d.type][d.id].person_type];
    }else{
        cur_type_color = type_color[d.type];
    }
    let div = d3.select("body")
    .append("div")
    .attr("class", "knowledgemap-tip")
    .style('opacity', '0')
    .style('width', width + 'px')
    // .style('height', height + 'px')
    .style("right", "730px")
    .style("top", y + "px")
    .style('display', 'inline');

    // 旧版tip的text内容
    // let text_div = div.append('div').style('max-height', height - btn_height + 'px').style('overflow', 'auto');
    // text_div.append('p').text(d.name).style('font-weight', 'bold');
    // detail.forEach(d => {
    //     text_div.append('p')
    //         .style('margin-top', '5px')
    //         .text(d[0] + '：');
    //     text_div.append('p')
    //         .style('text-indent', '2em')
    //         .text(d[1]);
    // });

    // 新版tip的text内容
    // 渐变条
    let bar_height = 7;
    let title_y = 10;
    div.append('div')
        .attr('class', 'knowledgemap-tip-headbar')
        .style('background-image', `linear-gradient(${cur_type_color}, #ffffff)`)
        .style('height', bar_height + 'px')
        .style('width', 'inherit');
    // 类型图标
    if(d.type != 'person' || knowledge_map[d.type][d.id].person_type != 'none'){
        div.append('div')
        .style('position', 'absolute')
        .style('background-color', cur_type_color)
        .style('color', 'white')
        .style('right', '7px')
        .style('top', title_y + 'px')
        .style('font-size', '18px')
        .text(() => {
            if(d.type === 'person'){
                return knowledge_map[d.type][d.id].person_type === 'none'? 'Person': knowledge_map[d.type][d.id].person_type;
            }else if(d.type === 'event'){
                return 'Event';
            }else{
                return 'Work';
            }
        });
    }
    // 标题
    let text_padding_left = '10px';
    let text_padding_right = '10px';
    div.append('div').attr('class', 'knowledgemap-tip-title')
        .text(d.name)
        .style('font-weight', 'bolder')
        .style('padding-left', text_padding_left)
        .style('max-width', '180px')
        .style('font-size', '18px')
        .style('margin-top', (title_y - bar_height) + 'px')
        .style('margin-bottom', '10px');
    // 内容div
    let info_div = div.append('div').attr('class', 'knowledgemap-tip-info-div')
        .style('max-height', height + 'px')
        .style('padding-left', text_padding_left)
        .style('padding-right', text_padding_right)
        .style('overflow', 'auto');
    let sub_title_fontsize = '16px';
    let sub_title_fontweight = 'bold';
    // 简介
    info_div.append('div').text('Intro').attr('class', 'knowledgemap-tip-subtitle');
    info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
    let basic_info = knowledge_map[d.type][d.id].info;
    basic_info.forEach(item => {
        let row_div = info_div.append('div').style('display', 'flex');
        row_div.append('div').style('width', '30%').text(item[0]);
        row_div.append('div').style('flex-grow', 1).text(item[1]);
    })
    // detail
    detail.forEach(item => {
        info_div.append('div').text(item[0]).attr('class', 'knowledgemap-tip-subtitle');
        info_div.append('div').attr('class', 'knowledgemap-tip-subtitle-line');
        info_div.append('div').style('text-indent', '2em').text(item[1]);
    })
    // 检查当前节点是否有新的可拓展的内容
    let relative_num = 0;
    relative_list.forEach(relative_name => {
        let cur_list =  knowledge_map[d.type][d.id][relative_name];
        cur_list.forEach(tmp_node => {
            if(!has_included_link.has(d.id + ' ' + tmp_node.id)){
                relative_num += 1;
            }
        })
    })
    if(!is_whole_map && !has_extend_id.has(d.id) && relative_num != 0 && location_mode_version == 1){
        div.append('div').text('点击以拓展图谱')
            .style('text-decoration', 'underline')
            .style('font-style', 'italic')
            .style('margin-top', '10px')
            .style('padding-left', '20px')
            .style('color', '#6C948C')
            .style('cursor', 'pointer')
            .on('click', function(){
                has_extend_id.set(d.id, 1);
                click_extend_map(d);
                mouseover_enable = false;
                cur_click_id = d.id;
                d3.select('#knowledge-map-node-' + cur_click_id).select('circle').attr('stroke-width', 2.5);
                d3.selectAll('.g-knowledge-map-node').attr('opacity', 0.15);
                d3.selectAll('.knowledge-map-line').attr('opacity', 0.15);
                d3.selectAll('.knowledge-map-set-' + cur_click_id).attr('opacity', 1);
                d3.select(this).remove();
            });
    }
    div.transition().duration(highlight_transition_duration).style('opacity', '1');
}
// 删除tip面板
const remove_knowledge_map_tip = function(){
    // 删除面板
    d3.selectAll('.knowledgemap-tip').remove();
}

// 根据起点终点，和中间点的凸起高度，生成弧线path的d，（用二次贝塞尔曲线实现
const get_arc_d = function(start_point, end_point, height){
    let theta = Math.atan((end_point.y - start_point.y)/(end_point.x - start_point.x));
    let mid_point = new Object();
    if(links_is_arc){
        mid_point.x = (start_point.x + end_point.x)/2 - height * Math.sin(theta);
        mid_point.y = (start_point.y + end_point.y)/2 + height * Math.cos(theta);
    }else{
        mid_point.x = (start_point.x + end_point.x)/2;
        mid_point.y = (start_point.y + end_point.y)/2;
    }    
    return ['M', start_point.x.toString(), start_point.y.toString(), 'Q', mid_point.x.toString(), mid_point.y.toString(), end_point.x.toString(), end_point.y.toString()].join(' ');
}

// 计算节点所连接的边的数量
const link_count = function(node){
    let node_id = node.id;
    let count = 0;
    links.forEach(link => {
        if(link.source.id === node_id || link.target.id ===node_id){
            count += 1;
        }
    });
    return count;
}

// 根据朝代和事件重要性得分更新图谱
const update_knowledge_map_by_dynasty_event_score = function(new_dynasty = 'default', new_event_score_range = 'default'){
    if(new_dynasty != 'default'){
        knowledge_map_dynasty_id = knowledge_map_dynasty_list.indexOf(new_dynasty);
    }
    if(new_event_score_range != 'default'){
        knowledge_map_event_score_range.low = new_event_score_range.low;
        knowledge_map_event_score_range.high = new_event_score_range.high;
    }
    // node
    let dom_nodes_list = d3.selectAll('.g-knowledge-map-node').nodes();
    dom_nodes_list.forEach(d => {
        let cur_event_score = parseFloat(d3.select(d).attr('data-event-score'));
        let cur_dynasty_id = parseInt(d3.select(d).attr('data-dynasty-id'));
        if(isNaN(cur_event_score)){
            cur_event_score = (knowledge_map_event_score_range.low + knowledge_map_event_score_range.high) / 2;
        }
        if(cur_event_score <= knowledge_map_event_score_range.high && cur_event_score >= knowledge_map_event_score_range.low && cur_dynasty_id <= knowledge_map_dynasty_id){
            d3.select(d).style('display', '');
        }else{
            d3.select(d).style('display', 'none');
        }
    })
    // link
    let dom_links_list = d3.selectAll('.knowledge-map-line').nodes();
    dom_links_list.forEach(d => {
        let cur_event_score_source = parseFloat(d3.select(d).attr('data-event-score-source'));
        let cur_event_score_target = parseFloat(d3.select(d).attr('data-event-score-target'));
        let cur_dynasty_id_source = parseInt(d3.select(d).attr('data-dynasty-id-source'));
        let cur_dynasty_id_target = parseInt(d3.select(d).attr('data-dynasty-id-target'));
        if(isNaN(cur_event_score_source)){
            cur_event_score_source = (knowledge_map_event_score_range.low + knowledge_map_event_score_range.high) / 2;
        }
        if(isNaN(cur_event_score_target)){
            cur_event_score_target = (knowledge_map_event_score_range.low + knowledge_map_event_score_range.high) / 2;
        }
        if(cur_event_score_source >= knowledge_map_event_score_range.low && cur_event_score_source <= knowledge_map_event_score_range.high && cur_event_score_target >= knowledge_map_event_score_range.low && cur_event_score_target <= knowledge_map_event_score_range.high && cur_dynasty_id_source <= knowledge_map_dynasty_id && cur_dynasty_id_target <= knowledge_map_dynasty_id){
            d3.select(d).style('display', '');
        }else{
            d3.select(d).style('display', 'none');
        }
    })
    // 自动缩放
    if(dynasty_node_num.length != 0){
        let scale = svg_height_knowledgemap / (2 * dynasty_outerRadius[knowledge_map_dynasty_id]);
        if(scale < 0.05){
            scale = 0.05;
        }else if(scale > 5){
            scale = 5;
        }
        let translate = [svg_width_knowledgemap / 2 - scale * svg_width_knowledgemap / 2, svg_height_knowledgemap / 2 - scale * svg_height_knowledgemap / 2];
        // 更新地图的缩放比例和平移量
        svg_knowledgemap.transition()
            .duration(750)
            .call(knowledge_map_zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
    }
    
}

let delta_dynasty_r = 30;

// 自定义力圆环力，把每个朝代分布到不同的圆环上
let g_ring = g_knowledgemap.append('g').attr('id', 'g-ring');
let dynasty_outerRadius = [];
let dynasty_node_num = [];
function dynastyForce(centerX, centerY, delta_radius=80, strength=0.1) {
    // 返回一个函数，该函数将被D3力模拟调用
    return function (alpha) {
        nodes.forEach(function (d) {
            // 计算节点到圆环中心的距离
            const dx = d.x - centerX;
            const dy = d.y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 计算目标距离（在内半径和外半径之间）
            let targetDistance;
            if(d.dynasty_id == 0){
                targetDistance = dynasty_outerRadius[0]/2;
            }else{
                targetDistance = (dynasty_outerRadius[d.dynasty_id] + dynasty_outerRadius[d.dynasty_id-1])/2;
            }
            // const targetDistance = delta_radius * d.dynasty_id;

            // 计算力的方向和大小
            let force;
            if(Math.abs(distance - targetDistance) < 5){
                force = 0;
            }else{
                force = (distance - targetDistance) / distance * alpha * strength;
            }
            // 应用力
            d.vx -= force * dx;
            d.vy -= force * dy;
        });
    };
}

// 根据nodes和links列表绘制知识图谱
const draw_knowledge_map_by_nodes_links = function(){
    svg_knowledgemap.selectAll('.g-knowledge-map-link').remove();
    svg_knowledgemap.selectAll('.g-knowledge-map-node').remove();
    // 计算每个朝代各个类型节点的数量，以确定各个朝代圆环的大小
    dynasty_outerRadius = [];
    dynasty_node_num = [];
    for(let i = 0; i < 10; ++i){
        dynasty_node_num.push(new Object({'person': 0, 'event': 0, 'work': 0, 'location': 0, 'poem': 0, 'total': 0}))
    }
    nodes.forEach(d => {
        dynasty_node_num[d.dynasty_id][d.type]++;
        dynasty_node_num[d.dynasty_id]['total']++;
    })
    // 每个类型圆圈的半径
    circle_r = {'person': 40, 'event': 30, 'work': 20, 'location': 40, 'poem': 20};
    let type_area = {};
    for(let t in circle_r){
        type_area[t] = Math.PI * circle_r[t] * circle_r[t];
    }
    let prev_r = 0;
    for(let i = 0; i< 10; ++i){
        if(dynasty_node_num[i].total == 0){
            dynasty_outerRadius.push(prev_r + 10); //没有节点默认是10
            prev_r = dynasty_outerRadius[i];
        }else{
            let node_area = 0;
            for(let t in dynasty_node_num[i]){
                if(t == 'total'){
                    continue;
                }
                node_area += (dynasty_node_num[i][t] * type_area[t]);
            }
            let next_r = Math.sqrt(node_area / Math.PI + prev_r * prev_r);
            next_r += 40; //在满足面积要求的基础上增加一个基础距离
            dynasty_outerRadius.push(next_r);
            prev_r = next_r;
        }
    }
    // 画出朝代圈，辅助线
    g_ring.html('');
    let ring_arc = d3.arc().innerRadius((d, i) => {{
        if(i == 0){
            return 0;
        }else{
            return dynasty_outerRadius[i-1];
        }
    }})
    .outerRadius((d, i) => dynasty_outerRadius[i])
    .startAngle(0)
    .endAngle(Math.PI * 2);
    g_ring.append('g').selectAll('circle').data(dynasty_outerRadius).join('circle')
        .attr('cx', svg_width_knowledgemap/2)
        .attr('cy', svg_height_knowledgemap/2)
        .attr('r',  d => d)
        .attr('fill', 'transparent')
        // .attr('stroke', current_mode_color.knowledge_map_ring)
        .attr('stroke', (d, i) => `rgba(47, 94, 94, ${1 - i * 0.09})`)
        .attr('stroke-dasharray', "2.4, 4, 0.8, 6") // 设置为虚线，数字表示虚线和空白的长度
        .attr('stroke-width', 1);
    g_ring.append('g').attr('transform', `translate(${svg_width_knowledgemap/2} ${svg_height_knowledgemap/2})`)
        .selectAll('path').data(dynasty_outerRadius).join('path')
        .attr('id', function(d, i) { return `ring-${i}`; })
        .attr('d', ring_arc)
        .attr('fill', 'transparent')
        .on('mouseover', function(e, d){
            let i = dynasty_outerRadius.indexOf(d);
            d3.select(this).attr('fill', convertRGBtoRGBA(current_mode_color.timeline_river, 0.15));
            knowledge_map_info_text.text(`${knowledge_map_dynasty_list[i]}`)
            d3.selectAll('.g-knowledge-map-node').transition().duration(highlight_transition_duration).attr('opacity', 0.15);
            d3.selectAll('.knowledge-map-line').transition().duration(highlight_transition_duration).attr('opacity', 0.15);
            d3.selectAll('.g-knowledge-map-node-dynasty-id-' + i).transition().duration(highlight_transition_duration).attr('opacity', 1);
        })
        .on('mouseout', function(e){
            d3.select(this).attr('fill', 'transparent');
            knowledge_map_info_text.text('');
            d3.selectAll('.g-knowledge-map-node').transition().duration(highlight_transition_duration).attr('opacity', 1);
            d3.selectAll('.knowledge-map-line').transition().duration(highlight_transition_duration).attr('opacity', 1);
        });
    let circle_r_clicked_extend = 25;
    // let lines = g_knowledgemap.append('g').attr('class', 'g-knowledge-map-link')
    //     .selectAll('line').data(links).join('line')
    //     .attr('stroke', 'lightgray')
    //     .attr('opacity', 1)
    //     .attr('class', d => 'knowledge-map-item knowledge-map-line knowledge-map-set-' + d.source + ' knowledge-map-set-' + d.target)
    //     .attr('id', d => 'knowledge-map-link-' + d.source + '-' + d.target)
    //     .attr('data-source', d => d.source)
    //     .attr('data-target', d => d.target);
    let arcs = g_knowledgemap.append('g').attr('class', 'g-knowledge-map-link')
        .selectAll('path').data(links).join('path')
        // .attr('stroke', 'lightgray')
        .attr('stroke', current_mode_color.knowledge_map_line)
        // .attr('stroke', 'gray')
        .attr('fill', 'transparent')
        .attr('opacity', 1)
        .attr('class', d => 'knowledge-map-item knowledge-map-line knowledge-map-set-' + d.source + ' knowledge-map-set-' + d.target)
        .attr('id', d => 'knowledge-map-link-' + d.source + '-' + d.target)
        .attr('data-source', d => d.source)
        .attr('data-target', d => d.target)
        .style('display', 'none');
    let node_g = g_knowledgemap.selectAll('.g-knowledge-map-node').data(nodes).join('g')
        .attr('class', d => `g-knowledge-map-node g-knowledge-map-node-dynasty-id-${d.dynasty_id}`)
        .attr('data-id', d => d.id)
        .attr('id', d => 'knowledge-map-node-' + d.id)
        .style('cursor', d => {
            if(d.type == 'location'){
                return 'default';
            }else{
                return 'pointer';
            }
        })
        .attr('opacity', 1)
        .style('display', 'none')
        .on('click', (e, d) => {
            if(d.type != 'location'){
                if(cur_click_id == null){
                    mouseover_enable = false;
                    cur_click_id = d.id;
                    d3.select('#knowledge-map-node-' + cur_click_id).select('image').attr('transform', `translate(${-circle_r[d.type]-circle_r_clicked_extend}, ${-circle_r[d.type]-circle_r_clicked_extend})`);
                    d3.select('#knowledge-map-node-' + cur_click_id).select('image').attr('width', 2 * (circle_r[d.type] + circle_r_clicked_extend)).attr('height', 2 * (circle_r[d.type] + circle_r_clicked_extend));
                    // d3.select('#knowledge-map-node-' + cur_click_id).select('circle').transition().duration(highlight_transition_duration).attr('stroke-width', 2.5);
                    // d3.selectAll('.g-knowledge-map-node').transition().duration(highlight_transition_duration).attr('opacity', 0.15);
                    // d3.selectAll('.knowledge-map-line').transition().duration(highlight_transition_duration).attr('opacity', 0.15);
                    // d3.selectAll('.knowledge-map-set-' + cur_click_id).transition().duration(highlight_transition_duration).attr('opacity', 1);
                    // draw_knowledge_map_tip(d);
                }else{
                    if(cur_click_id != d.id){
                        // 取消上次选定的内容
                        // d3.select('#knowledge-map-node-' + cur_click_id).select('circle').transition().duration(highlight_transition_duration).attr('stroke-width', 1);
                        d3.selectAll('.g-knowledge-map-node').transition().duration(highlight_transition_duration).attr('opacity', 1);
                        d3.selectAll('.knowledge-map-line').transition().duration(highlight_transition_duration).attr('opacity', 1);
                        let tmp_type = cur_click_id.slice(0, cur_click_id.indexOf('-'));
                        d3.select('#knowledge-map-node-' + cur_click_id).select('image').attr('transform', `translate(${-circle_r[tmp_type]}, ${-circle_r[tmp_type]})`);
                        d3.select('#knowledge-map-node-' + cur_click_id).select('image').attr('width', 2 * (circle_r[tmp_type])).attr('height', 2 * (circle_r[tmp_type]));
                        // 删除tip面板
                        remove_knowledge_map_tip();
                        // 选择本次的内容
                        mouseover_enable = false;
                        cur_click_id = d.id;
                        // d3.select('#knowledge-map-node-' + cur_click_id).select('circle').transition().duration(highlight_transition_duration).attr('stroke-width', 2.5);
                        d3.selectAll('.g-knowledge-map-node').transition().duration(highlight_transition_duration).attr('opacity', 0.15);
                        d3.selectAll('.knowledge-map-line').transition().duration(highlight_transition_duration).attr('opacity', 0.15);
                        d3.selectAll('.knowledge-map-set-' + cur_click_id).transition().duration(highlight_transition_duration).attr('opacity', 1);
                        d3.select('#knowledge-map-node-' + cur_click_id).select('image').attr('transform', `translate(${-circle_r[d.type]-circle_r_clicked_extend}, ${-circle_r[d.type]-circle_r_clicked_extend})`);
                        d3.select('#knowledge-map-node-' + cur_click_id).select('image').attr('width', 2 * (circle_r[d.type] + circle_r_clicked_extend)).attr('height', 2 * (circle_r[d.type] + circle_r_clicked_extend));
                        draw_knowledge_map_tip(d);
                    }else{
                        // 取消上次选定的内容
                        // d3.select('#knowledge-map-node-' + cur_click_id).select('circle').transition().duration(highlight_transition_duration).attr('stroke-width', 1);
                        d3.selectAll('.g-knowledge-map-node').transition().duration(highlight_transition_duration).attr('opacity', 1);
                        d3.selectAll('.knowledge-map-line').transition().duration(highlight_transition_duration).attr('opacity', 1);
                        let tmp_type = cur_click_id.slice(0, cur_click_id.indexOf('-'));
                        d3.select('#knowledge-map-node-' + cur_click_id).select('image').attr('transform', `translate(${-circle_r[tmp_type]}, ${-circle_r[tmp_type]})`);
                        d3.select('#knowledge-map-node-' + cur_click_id).select('image').attr('width', 2 * (circle_r[tmp_type])).attr('height', 2 * (circle_r[tmp_type]));
                        // 删除tip面板
                        remove_knowledge_map_tip();
                        mouseover_enable = true;
                        cur_click_id = null;
                    }
                }
            }
        })
        .on('mouseover', (e, d) => {
            if(d.type != 'location'){
                // 从外部进来才有特效，避免内部的cirle和text之间的进出干扰
                if(mouseover_enable && d3.select(e.fromElement).attr('data-id') != d.id){
                    // // console.log(e)
                    // d3.select('#knowledge-map-node-' + d.id).select('circle').transition().duration(highlight_transition_duration).attr('stroke-width', 2.5);
                    d3.selectAll('.g-knowledge-map-node').transition().duration(highlight_transition_duration).attr('opacity', 0.15);
                    d3.selectAll('.knowledge-map-line').transition().duration(highlight_transition_duration).attr('opacity', 0.15);
                    d3.selectAll('.knowledge-map-set-' + d.id).transition().duration(highlight_transition_duration).attr('opacity', 1);
                    // 画出tip面板
                    draw_knowledge_map_tip(d);
                }
            }
        })
        .on('mouseout', (e, d) => {
            if(d.type != 'location'){
                // out到画布上才有特效，避免内部的cirle和text之间的进出干扰
                if(mouseover_enable && d3.select(e.toElement).attr('data-id') != d.id){
                    // // console.log(e)
                    // d3.select('#knowledge-map-node-' + d.id).select('circle').transition().duration(highlight_transition_duration).attr('stroke-width', 1);
                    d3.selectAll('.g-knowledge-map-node').transition().duration(highlight_transition_duration).attr('opacity', 1);
                    d3.selectAll('.knowledge-map-line').transition().duration(highlight_transition_duration).attr('opacity', 1);
                    // 删除tip面板
                    remove_knowledge_map_tip();
                }
            }
        });
    let images = node_g.append('image')
        .attr('class', 'knowledge-map-item knowledge-map-node-circle').attr('data-id', d => d.id)
        .attr('height', d => {
            if(d.id === cur_click_id){
                return 2 * (circle_r[d.type] + circle_r_clicked_extend);
            }else{
                return 2 * circle_r[d.type];
            }
        })
        .attr('width', d => {
            if(d.id === cur_click_id){
                return 2 * (circle_r[d.type] + circle_r_clicked_extend);
            }else{
                return 2 * circle_r[d.type];
            }
        })
        .attr('transform', d => {
            if(d.id === cur_click_id){
                return `translate(${-circle_r[d.type]-circle_r_clicked_extend}, ${-circle_r[d.type]-circle_r_clicked_extend})`;
            }else{
                return `translate(${-circle_r[d.type]}, ${-circle_r[d.type]})`;
            }
        })
        .attr('xlink:href', d => {
            if(d.type == 'person' && node_type_image_list.indexOf(knowledge_map[d.type][d.id].person_type) != -1){
                return current_mode_image.knowledge_map_person_type_image[knowledge_map[d.type][d.id].person_type];
            }else if(d.type == 'event'){
                return current_mode_image.knowledge_map_event;
            }else if(d.type == 'location'){
                return current_mode_image.knowledge_map_location;
            }else{
                return current_mode_image.knowledge_map_work;
            }
        });
    let text_length = {'person': 4, 'event': 4, 'work': 2, 'poem': 2, 'location': 99};
    let texts = g_knowledgemap.selectAll('.g-knowledge-map-node').data(nodes).join('g')
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('width', d => 2 * circle_r[d.type])
        .style('font-family', 'QKBYSJW')
        // .style('fill', 'white')
        .style('fill', current_mode_color.knowledge_map_text)
        .attr('class', 'knowledge-map-item knowledge-map-node-text').attr('data-id', d => d.id)
        .text(d => {
            let text = '';
            if(d.type === 'work'){
                text = d.name.slice(1, -1);
            }else{
                text = d.name;
            }
            if(text.length > text_length[d.type]){
                return text.slice(0, text_length[d.type]) + '...';
            }else{
                return text;
            }
        })
        // .style('visibility', 'hidden');
    // 为节点添加class信息，用以设置悬停特效
    links.forEach(d => {
        let source = d.source;
        let target = d.target;
        d3.select('#knowledge-map-node-' + source).classed('knowledge-map-set-' + source, true);
        d3.select('#knowledge-map-node-' + source).classed('knowledge-map-set-' + target, true);
        d3.select('#knowledge-map-node-' + target).classed('knowledge-map-set-' + source, true);
        d3.select('#knowledge-map-node-' + target).classed('knowledge-map-set-' + target, true);
    })
    nodes.forEach(d => {
        let id = d.id;
        d3.select('#knowledge-map-node-' + id).classed('knowledge-map-set-' + id, true);
    })
    // 为节点和边添加朝代信息和事件重要性得分信息
    nodes.forEach(d => {
        let id = d.id;
        let dynasty_id = knowledge_map[d.type][id].dynasty_id;
        d3.select('#knowledge-map-node-' + id).attr('data-dynasty-id', dynasty_id);
        if(d.type === 'event'){
            d3.select('#knowledge-map-node-' + id).attr('data-event-score', knowledge_map[d.type][id].importance_score);
        }
    })
    links.forEach(d => {
        let source = d.source;
        let target = d.target;
        let source_dynasty_id = knowledge_map[source.slice(0, source.indexOf('-'))][source].dynasty_id;
        let target_dynasty_id = knowledge_map[target.slice(0, target.indexOf('-'))][target].dynasty_id;
        let source_type = knowledge_map[source.slice(0, source.indexOf('-'))][source].type;
        let target_type = knowledge_map[target.slice(0, target.indexOf('-'))][target].type;
        d3.select('#knowledge-map-link-' + source + '-' + target).attr('data-dynasty-id-source', source_dynasty_id);
        d3.select('#knowledge-map-link-' + source + '-' + target).attr('data-dynasty-id-target', target_dynasty_id);
        if(source_type === 'event'){
            d3.select('#knowledge-map-link-' + source + '-' + target).attr('data-event-score-source', knowledge_map[source_type][source].importance_score);
        }
        if(target_type === 'event'){
            d3.select('#knowledge-map-link-' + source + '-' + target).attr('data-event-score-target', knowledge_map[target_type][target].importance_score);
        }
    })
    // 根据朝代更新图谱
    update_knowledge_map_by_dynasty_event_score();
    simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody().strength(() => {
            if(location_mode_version == 1){
                return -130;
            }else{
                return 0;
            }
        }))
        .force('center', d3.forceCenter(svg_width_knowledgemap/2, svg_height_knowledgemap/2))
        .force('link', d3.forceLink(links).id(d => d.id).strength(link => {
            if(location_mode_version == 1){
                return 0.3;
            }else{
                return 0.1;
            }
            // return 8 / (link_count(link.source) + link_count(link.target));
        }).distance(link => {
            // return 120;
            if(link.source.type === 'work' || link.target.type === 'work'){
                return 70;
            }else{
                return 60;
            }
        }))
        .force('collide', d3.forceCollide(nodes).radius(d => circle_r[d.type] + 2).iterations(3).strength(0.1))
        .force('dynasty', dynastyForce(svg_width_knowledgemap/2, svg_height_knowledgemap/2, delta_dynasty_r, 0.15)) // 0.08
        // .force('x', d3.forceX().x(200).strength(0.2))
        // .force('radial', d3.forceRadial().x(0).y(0).radius(100).strength(0.5))
        .on('tick', function(){
            // lines
            // .attr('x1', d=> d.source.x)
            // .attr('y1', d=> d.source.y)
            // .attr('x2', d=> d.target.x)
            // .attr('y2', d=> d.target.y);
            arcs.attr('d', d => {
                return get_arc_d({x: d.source.x, y: d.source.y}, {x: d.target.x, y: d.target.y}, 20);
            })

            // circles
            // .attr('cx', d => d.x)
            // .attr('cy', d => d.y);
            images
            // .attr('x', d => d.x - circle_r[d.type])
            // .attr('y', d => d.y - circle_r[d.type]);
            .attr('x', d => d.x)
            .attr('y', d => d.y);
            texts
            .attr('x', d => d.x)
            .attr('y', d => d.y);
        });
    // 添加拖拽效果
    svg_knowledgemap.selectAll('.g-knowledge-map-node').call(drag_knowledgemap_node(simulation));
};


// 拖拽效果
function drag_knowledgemap_node(simulation) {    
    function dragstarted(e) {
        if (!e.active) simulation.alphaTarget(0.25).restart();
        e.subject.fx = e.subject.x;
        e.subject.fy = e.subject.y;
    }

    function dragged(e) {
        e.subject.fx = e.x;
        e.subject.fy = e.y;
    }

    function dragended(e) {
        if (!e.active) simulation.alphaTarget(0);
        e.subject.fx = null;
        e.subject.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}

// 外部点击节点调用该函数进行knowledge_map的绘制
const draw_knowledge_map_by = async function(by_type, id_selected, dynasty_selected = 'default'){
    // 参数id是数字
    // 参数by_type 是 location, event, work, person, poem
    if(dynasty_selected != 'default'){
        knowledge_map_dynasty_id = knowledge_map_dynasty_list.indexOf(dynasty_selected);
    }
    id_selected = by_type + '-' + id_selected.toString();
    nodes = [];
    links = [];
    is_whole_map = false;
    has_extend_id = new Map();
    has_extend_id.set(id_selected, 1);
    has_included_link = new Map();
    cur_click_id = null;
    if(knowledge_map == null){
        let json = await new Promise(resolve => {
            resolve(d3.json('json/en/knowledge_map_v2.json'));
        })
        knowledge_map = json;
    }
    let cur_object = knowledge_map[by_type][id_selected];
    if(by_type == 'location'){
        if(location_mode_version == 1){
            update_nodes_links(cur_object);
            // nodes_copy = JSON.parse(JSON.stringify(nodes));
            // nodes_copy.forEach(d => {
            //     if(d.type == 'event'){
            //         update_nodes_links(knowledge_map.event[d.id]);
            //     }
            // })
            draw_knowledge_map_by_nodes_links();
        }else{
            // knowledge_map_info_text.text('地点：' + cur_object['name']);
            nodes = JSON.parse(JSON.stringify(knowledge_map.location_graph[id_selected].nodes));
            links = JSON.parse(JSON.stringify(knowledge_map.location_graph[id_selected].links));
            nodes = unique_nodes(nodes);
            links = unique_links(links);
            draw_knowledge_map_by_nodes_links();
        }
    }else{
        location_mode_version = 1;
        update_nodes_links(cur_object);
        draw_knowledge_map_by_nodes_links();
    }
}

// init map
// draw_knowledge_map_by('location', 404, '东吴');

// export utils function
const find_location_eventwork_num = async function(location_id){
    // location_id 是数字
    location_id = 'location-' + location_id;
    if(knowledge_map == null){
        let json = await new Promise(resolve => {
            resolve(d3.json('json/en/knowledge_map_v2.json'));
        })
        knowledge_map = json;
    }
    let location_obj = knowledge_map.location[location_id];
    let num_list = new Array(10).fill(0);
    let relative_type_list = ['event', 'work', 'poem'];
    relative_type_list.forEach((relative_type) =>{
        location_obj[relative_type].forEach(node => {
            num_list[node.dynasty_id] += 1;
        })
    })
    return num_list;
}

// 收起/展开 图谱
let knowledge_map_is_hide = false;
d3.select('.chart3-control-btn').on('click', ()=>{
    if(!knowledge_map_is_hide){
        knowledge_map_is_hide = true;
        d3.select('.chart3-control-btn').text('<Open');
        d3.select('.chart3').style('animation', 'hide_knowledgemap 0.5s linear 0s 1 normal forwards running');
    }else{
        knowledge_map_is_hide = false;
        d3.select('.chart3-control-btn').text('>Close');
        d3.select('.chart3').style('animation', 'show_knowledgemap 0.5s linear 0s 1 reverse forwards running');
    }
})
