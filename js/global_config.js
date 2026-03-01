// get mode id
let current_mode = 0; // default: 0
if(sessionStorage.getItem('pattern_mode') != null){
    current_mode = parseInt(sessionStorage.getItem('pattern_mode'));
}
sessionStorage.setItem('pattern_mode', '0');

var colormode1 = 'rgb(200, 169, 181)';
// var colormode1 = getRandomColor();
console.log(colormode1)
function rgbStringToHex(rgbString) {
    // 删除字符串中的"rgb("和")"，然后根据逗号分割
    var rgbValues = rgbString.replace(/rgb\(|\)/g, "").split(",");
    var r = parseInt(rgbValues[0]);
    var g = parseInt(rgbValues[1]);
    var b = parseInt(rgbValues[2]);

    // 转换为十六进制
    var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
}
colormode1_ciyun = rgbStringToHex(colormode1)
console.log(colormode1_ciyun); // 输出：#ff0000
let pattern_modes = [
    // mode 0: default
    {
        color: {
            background_color: 'white',
            header_backgroundcolor: '#6c948c',                      // header 的背景颜色
            header_textcolor: 'white',                              // header 标题的文字颜色
            emotion_positive: 'RGB(255, 40, 0)',                    // 积极情感的颜色
            emotion_negative: 'RGB(0, 65, 255)',                    // 消极情感的颜色
            event: 'RGB(203, 242, 102)',                            // 事件点的颜色
            event_score_slider: 'rgb(106, 159, 147)',               // 事件重要性得分的滑动条的颜色
            wenti_pie_scale_low: 'rgba(106 ,159 ,147, .4)',         // 文体扇形图的 colorScale low
            wenti_pie_scale_high: 'rgba(106 ,159 ,147 ,1)',         // 文体扇形图的 colorScale high
            wenti_pie_central_ring: 'green',                        // 文体扇形图中间的小圆环的颜色
            timeline_river: 'rgba(106 ,159 ,147)',             // 时间河流图的颜色, ！！必须是rgb格式，不带透明度！！
            timeline_river_rect: '#6a7985',             //时间河流图的高亮rect的颜色
            ciyun_color0: '#669d8a',                                // 词云的颜色0
            ciyun_color1: '#6495bb',                                // 词云的颜色0
            ciyun_color2: '#a1a1cb',                                // 词云的颜色0
            person_type_color: {                                    // 不同人物的颜色 （用在知识图谱的tooltip里）
                '将': '#6b8f8b',            
                '曲': '#bbbaad',
                '伶': '#e3b9ae',
                '艺': '#438c99',
                '文': '#9cc9cb',
                '术': '#5290bf',
                '僧': '#d6e4d1',
                'none': '#BEC8CF'
            },
            knowledge_map_line: '#8c8c8c',                          // 知识图谱线条的颜色
            knowledge_map_ring: '#d9d9d9',                      // 知识图谱辅助环的颜色
            knowledge_map_text: '#2f5e5e',                      // 知识图谱字体的颜色
            map_location: 'gray'                                    // 无情感值的地点的圆环颜色
        },
        image: {
            header_icon: 'images/梅花白.png',                       // header中的icon
            knowledge_map_person_type_image:{                       // 知识图谱中各种人物的icon
                '将': 'images/将.png',
                '曲': 'images/曲.png',
                '伶': 'images/伶.png',
                '艺': 'images/艺.png',
                '文': 'images/文.png',
                '术': 'images/术.png',
                '僧': 'images/僧.png',
                'none': 'images/none.png',
            },
            category_icon: [                                        // 地点类别icon
                "images/mountain.png",
                "images/water.png",
                "images/palace.png",
                "images/temple.png",
                "images/building.png",
                "images/garden.png",
                "images/facility.png",
                "images/remains.png"
            ],
            knowledge_map_event: 'images/事件.png',                 // 知识图谱中事件点的icon
            knowledge_map_location: 'images/事件1.png',             // 知识图谱中地点的icon （现在的知识图谱中没有地点了
            knowledge_map_work: 'images/作品.png',                  // 知识图谱中作品的icon
            timeline_river_stop_icon : 'images/梅花.png'            // 时间河流图的stop按钮icon
        }
    },
    // mode 1 
    {
        color: { // 随机设置颜色用于测试
            background_color: '#f2f2f2',
            header_backgroundcolor: colormode1,                      // header 的背景颜色
            header_textcolor: 'white',                              // header 标题的文字颜色
            emotion_positive: 'RGB(255, 40, 0)',                    // 积极情感的颜色 'RGB(255, 153, 160)'  'RGB(255, 153, 0)'
            emotion_negative: 'RGB(0, 65, 255)',                    // 消极情感的颜色 
            event: colormode1,                            // 事件点的颜色
            event_score_slider: colormode1,               // 事件重要性得分的滑动条的颜色
            wenti_pie_scale_low: 'rgba(206, 189, 163, .1)',         // 文体扇形图的 colorScale low
            wenti_pie_scale_high: 'rgba(206, 189, 163, 1)',         // 文体扇形图的 colorScale high
            wenti_pie_central_ring: colormode1,                        // 文体扇形图中间的小圆环的颜色
            timeline_river: colormode1,                              // 时间河流图的颜色 ！！必须是rgb格式！！
            timeline_river_rect: '#6a7985',         //时间河流图的高亮rect的颜色
            ciyun_color0: colormode1_ciyun,                                // 词云的颜色0
            ciyun_color1: colormode1_ciyun,                                // 词云的颜色0
            ciyun_color2: colormode1_ciyun,                                // 词云的颜色0
            person_type_color: {                                    // 不同人物的颜色 （用在知识图谱的tooltip里）
                '将': '#6b8f8b',            
                '曲': '#bbbaad',
                '伶': '#e3b9ae',
                '艺': '#438c99',
                '文': '#9cc9cb',
                '术': '#5290bf',
                '僧': '#d6e4d1',
                'none': '#BEC8CF'
            },
            knowledge_map_line: '#8c8c8c',                          // 知识图谱线条的颜色
            knowledge_map_ring: '#d9d9d9',                      // 知识图谱辅助环的颜色
            knowledge_map_text: '#2f5e5e',                      // 知识图谱字体的颜色
            map_location: 'gray'                                    // 无情感值的地点的圆环颜色
        },
        image: {
            header_icon: 'images/梅花白.png',                       // header中的icon
            background_image: 'none',
            knowledge_map_person_type_image:{                       // 知识图谱中各种人物的icon
                '将': 'images/将.png',
                '曲': 'images/曲.png',
                '伶': 'images/伶.png',
                '艺': 'images/艺.png',
                '文': 'images/文.png',
                '术': 'images/术.png',
                '僧': 'images/僧.png',
                'none': 'images/none.png',
            },
            category_icon: [                                        // 地点类别icon
                "images/mountain.png",
                "images/water.png",
                "images/palace.png",
                "images/temple.png",
                "images/building.png",
                "images/garden.png",
                "images/facility.png",
                "images/remains.png"
            ],
            knowledge_map_event: 'images/事件.png',                 // 知识图谱中事件点的icon
            knowledge_map_location: 'images/事件1.png',             // 知识图谱中地点的icon （现在的知识图谱中没有地点了
            knowledge_map_work: 'images/作品.png',                  // 知识图谱中作品的icon
            timeline_river_stop_icon : 'images/梅花.png'            // 时间河流图的stop按钮icon
        }
    },
]

//pattern config
let current_mode_color = pattern_modes[current_mode].color;
let current_mode_image = pattern_modes[current_mode].image;

$(document).ready(function () {
    $('#move-btn').attr('src', current_mode_image.header_icon);
    $('#header-text').css('color', current_mode_color.header_textcolor);
    $('header').css('background-color', current_mode_color.header_backgroundcolor);
    $('body').css('background-image', current_mode_image.background_image);
    $('body').css('background-color', current_mode_color.background_color);
    $('.back-bar .selected-bar').css('background-color', current_mode_color.event_score_slider);
    $('.back-bar .pointer').css('border-color', current_mode_color.event_score_slider);
});

function getRandomColor(){    
    let r = Math.floor(Math.random() * 256); 
    let g = Math.floor(Math.random() * 256); 
    let b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}
function convertRGBtoRGBA(rgbString, alpha) {
    let rgbValues = rgbString.match(/\d+/g);
    let [r, g, b] = rgbValues;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

$('#switchmode-btn').click(function(e) {
    let next_mode = current_mode + 1;
    next_mode %= 2;
    sessionStorage.setItem('pattern_mode', next_mode.toString());
    location.reload();
})