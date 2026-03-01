$('.chart5').html('<div id="river"><button id="play-pause-btn">Play/Pause</button></div>')
let myChart = echarts.init(document.getElementById('river'),
    style="position:'absolute';width: '100%';height:'100%';");
// 定义朝代顺序
let dynasties = ['Eastern Wu', 'Jin', 'Southern Dynasties', 'Tang','Southern Tang', 'Song', 'Yuan', 'Ming', 'Qing', 'Modern'];
// 创建一个空对象来存储数据
let dynasty_data = {};
let isPlaying = true;
let playCount = 0; // 添加一个计数器
let dynastyTexts = {
    'Eastern Wu': '建业',
    'Jin': '建康',
    'Southern Dynasties': '建康',
    'Tang': '金陵',
    'Southern Tang': '江宁',
    'Song': '白下',
    'Yuan': '集庆',
    'Ming': '应天',
    'Qing': '江宁',
    'Modern': '南京'
  };
  let dynastyBackgrounds = {
    'Eastern Wu': "./images/建业.png", 
    'Jin': "./images/建康.png",
    'Southern Dynasties': "./images/建康.png", 
    'Tang': "./images/金陵.png",
    'Southern Tang': "./images/江宁.png", 
    'Song': "./images/白下.png",
    'Yuan': "./images/集庆.png", 
    'Ming': "./images/应天.png",
    'Qing': "./images/江宁.png", 
    'Modern': "./images/南京.png",
  }
  
// 获取所有数据
async function getData() {
    // 定义要获取的文件列表
    let files = ['./json/en/dynasty_location_2_events.json', './json/en/dynasty_location_2_works.json','./json/en/location_category.json'];
 
    // 同时获取所有文件的数据
    let jsonDataArray = await Promise.all(files.map(file => fetch(file).then(response => response.json())));
 
    // 获取第一个文件的数据
    let eventsData = jsonDataArray[0];
    // 获取第二个文件的数据
    let worksData = jsonDataArray[1];
    // 获取第三个文件的数据
    let locationData = jsonDataArray[2];
    // 定义转换后的数据
    let convertedData = {};
 
    // 遍历所有朝代
    for (let i = 0; i < dynasties.length; i++) {
        // 获取当前朝代
        let dynasty = dynasties[i];
        // 获取当前朝代对应的事件信息
        let eventsInfo = eventsData[dynasty];
        // 获取当前朝代对应的作品信息
        let worksInfo = worksData[dynasty];
        // 获取当前朝代对应的地点信息
        let locationInfo = [];
        for (let key in locationData) {
            locationInfo.push(...locationData[key].filter(location => location["朝代"] === dynasty));
        }
        // 将信息添加到转换后的数据中
        convertedData[dynasty] = {
            events: eventsInfo,
            works: worksInfo,
            location: locationInfo
        };
    }
 
    // 更新data对象
    data = convertedData;
    // console.log(data)
 
    // 创建一个空对象来存储数据
    let dynasty_data = {};
 
    // 遍历所有朝代
    for (let i = 0; i < dynasties.length; i++) {
        // 获取当前朝代
        let dynasty = dynasties[i];
        // 获取当前朝代对应的信息
        let info = data[dynasty];
        // console.log(info);
        // console.log(info.events)
        let len1 = 0
        let len2 = 0
        let len3 = 0
        if (info.events !== undefined && info.events !== null) {
            // len1 = Object.values(info.events).length;
            len1 = 0;
            for(let location in info.events){
                len1 += info.events[location]['events'].length;
            }
        }else{
            len1 = 0;
        }
        if (info.works !== undefined && info.works !== null) {
            // len2 = Object.values(info.works).length;
            len2 = 0;
            for(let location in info.works){
                len2 += info.works[location]['works'].length;
            }
        }else{
            len2 = 0;
        }
        if (info.location !== undefined && info.location !== null) {
            len3 = info.location.length;
        } else {
            len3 = 0;
        }
        // 计算当前时间点元素的高度
        let number = (len1 + len2);
      
        // 将数据存储到对象中
        dynasty_data[dynasty] = {
            "事件+作品": {
                "all": number
            },
            "事件": {
                "all": len1
            },
            "作品": {
                "all": len2
            },
            "地点": {
                "all": len3
            }
        };
    }
 
    // console.log(dynasty_data);
 
    return dynasty_data;
}
 
 // 调用getData函数来获取数据，并处理返回值
getData().then(dynasty_data => {
    // console.log(dynasty_data);

    let loc = [];
    let work = [];
    let event = []
  
    for (let dynasty in dynasties) {
        // console.log(dynasty)
        loc.push(dynasty_data[dynasties[dynasty]]["地点"]["all"]);
        loc.push(0);
    }
    for (let dynasty in dynasties) {
        work.push(dynasty_data[dynasties[dynasty]]["作品"]["all"]);
        work.push(0);
    }
    for (let dynasty in dynasties) {
        event.push(dynasty_data[dynasties[dynasty]]["事件"]["all"]);
        event.push(0);
    }
    
    let sentiment = [0, 0.378, 0, 0.618, 0, 0.618, 0, 0.364, 0, 0.397, 0, 0.458, 0, 0.331, 0, 0.360, 0, 0.397, 0, 0.459, 0 ];
    let sentiment_dyn = [0, 0.271, 0, 0.343,0, 0.249, 0, 0.344, 0, 0.356, 0, 0.318, 0, 0.392, 0, 0.316, 0, 0.370, 0, 0.248, 0 ];
    // let sentiment_dyn = [0, 0.27, 0, 晋：暂时用0.5代替, 0, 0.50, 0, 0.34, 0, 0.36, 0, 0.28, 0, 0.39, 0, 0.32, 0, 0.40, 0, 0.88, 0 ]
    // 现当代 0.8825
    // 东吴 0.27398235294117634
    // 南朝 0.5026666666666667
    // 明 0.31554526748971184
    // 南唐 0.3642895161290322
    // 清 0.3963026315789474
    // 宋 0.27691875
    // 唐 0.3407631799163178
    // 元 0.3930031249999999

    let option_dys;

    option_dys = {
        title: {
            text: '',//地点+作品+事件
            textStyle: {
                fontFamily: 'JinlingCu'
            }
        },
        label: {
            show: true,
            position: 'bottom',
            color: 'black',
            formatter: function (params) {
                return params.value;
            }
        },
        textStyle: {
            fontFamily: 'JinlingCu',
        },
        tooltip: {
            trigger: 'axis',
            triggerOn: 'click',
            alwaysShowContent: true,
            axisPointer: {
                type: 'none',
                label: {
                    show: true,
                    backgroundColor: '#6a7985'
                }
            },
            formatter: function (params) {
                // console.log(params)
                // return params[0].axisValueLabel;
                return "";
            },
            backgroundColor: 'transparent',
            textStyle: {
                color: 'black',
                fontFamily: 'JinlingXi'
            },
            borderWidth: 0,
        },        
        legend: {
            data: ['地点','作品','事件','别称情感', '朝代情感'],
            show: false
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            height: "80%",
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: ['', 'Eastern Wu', '', 'Jin', '', 'Southern Dynasties', '', 'Tang', '', 'Southern Tang', '', 'Song', '',
                    'Yuan', '', 'Ming', '', 'Qing', '', 'Modern', ''],
                triggerEvent:true,
                axisLine: {
                    lineStyle: {
                        color: '#70896d',
                        width: 1,
                        opacity: 0
                    }
                },
                axisLabel: {
                    textStyle: {
                        // color: 'black',
                        color: 'rgba(0, 0, 0, 0.7)',
                        fontFamily: 'JinlingXi',
                        // fontSize: 12,
                    },
                    interval:0,
                },
                axisTick: {
                    lineStyle: {
                        color: '#70896d',
                        width: 1,
                        opacity: 0
                    }
                }
                
            }
        ],
        yAxis: [
            {
                type: 'value',
                show: false,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                }
            }
        ],
        
        series: [
            // {
            //     name: '地点',
            //     type: 'line',
            //     stack: 'Total',
            //     smooth: true,
            //     label: {
            //         fontFamily: 'JinlingXi',
            //         color: 'rgba(0, 0, 0, 0.5)',
            //     },
            //     itemStyle: {
            //         color: 'blue',
            //         borderColor: '#70896d',
            //         borderWidth: 0.5
            //     },
            //     lineStyle: {
            //         width: 0
            //     },
            //     showSymbol: false,
            //     areaStyle: {
            //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //             {
            //                 offset: 1,
            //                 color: 'rgba(106 ,159 ,147 ,.4)' //a9f93 a2ccc2 c7e5da
            //             },
            //             {
            //                 offset: 0,
            //                 color: 'rgba(106 ,159 ,147 ,1)'
            //             }
            //         ])
            //     },
            //     emphasis: {
            //         focus: 'series'
            //     },
            //     data: loc,
            // },
            // {
            //     name: '事件',
            //     type: 'line',
            //     stack: 'Total',
            //     smooth: true,
            //     label: {
            //         fontFamily: 'JinlingXi',
            //         color: 'rgba(0, 0, 0, 0.5)',
            //     },
            //     itemStyle: {
            //         color: 'red',
            //         borderColor: '#70896d',
            //         borderWidth: 0.5
            //     },
            //     lineStyle: {
            //         width: 0
            //     },
            //     showSymbol: false,
            //     areaStyle: {
            //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //             {
            //                 offset: 1,
            //                 color: 'rgba(162, 204, 194, 0.4)'
            //             },
            //             {
            //                 offset: 0,
            //                 color: 'rgba(162, 204, 194, 1)'
            //             }
            //         ])
            //     },
            //     emphasis: {
            //         focus: 'series'
            //     },
            //     data: event,
            // },
            // {
            //     name: '作品',
            //     type: 'line',
            //     stack: 'Total',
            //     smooth:true,
            //     label:{
            //         fontFamily:'JinlingXi',
            //         color:'rgba(0,0,0,.5)',
            //      },
            //      itemStyle:{
            //          color:'green',
            //          borderColor:'#70896d',
            //          borderWidth:.5
            //      },
            //      lineStyle:{
            //          width :0
            //      },
            //      showSymbol:false,
            //      areaStyle:{
            //          color:new echarts.graphic.LinearGradient(0 ,0 ,0 ,1 ,[
            //             {offset :1 ,color :'rgba(199, 229, 218, 0.4)'},
            //             {offset :0 ,color :'rgba(199, 229, 218, 1)'}
            //          ])
            //      },
            //      emphasis:{
            //          focus:'series'
            //      },
            //      data :work
            // },
            {
                name: '别称情感',
                type: 'line',
                // stack: 'Total',
                smooth:true,
                label:{
                    fontFamily:'JinlingXi',
                    color:'rgba(0,0,0,.5)',
                 },
                 itemStyle:{
                     color:'green',
                     borderColor:'#70896d',
                     borderWidth:.5
                 },
                 lineStyle:{
                     width :0
                 },
                 showSymbol:false,
                 areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {offset :1 ,color : convertRGBtoRGBA(current_mode_color.timeline_river, 0)}, // rgba(162, 204, 194, 0.4) rgba(199, 229, 218, 0.4)
                        {offset :0 ,color : convertRGBtoRGBA(current_mode_color.timeline_river, 0.8)} //  rgba(81,110,188, .1)  RGBA(147, 181, 207, 1)  RGBA(243, 136, 127, 1)  RGBA(199, 210, 212, 1)
                        // {offset :1 ,color :'RGBA(53, 161, 107, .1)'}, 
                        // {offset :0 ,color :'RGBA(53, 161, 107, .4)'} 
                    ])
                 },
                 emphasis:{
                     focus:'series'
                 },
                 data :sentiment
            },
            // {
            //     name: '朝代情感',
            //     type: 'line',
            //     // stack: 'Total',
            //     smooth:true,
            //     label:{
            //         fontFamily:'JinlingXi',
            //         color:'rgba(0,0,0,.5)',
            //      },
            //      itemStyle:{
            //          color:'green',
            //          borderColor:'#70896d',
            //          borderWidth:.5
            //      },
            //      lineStyle:{
            //          width :0
            //      },
            //      showSymbol:false,
            //     // areaStyle: {
            //     //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //     //         {
            //     //             offset: 1,
            //     //             color: 'rgba(162, 204, 194, 0.4)'
            //     //         },
            //     //         {
            //     //             offset: 0,
            //     //             color: 'rgba(162, 204, 194, 1)'
            //     //         }
            //     //     ])
            //     // },
            //      areaStyle:{
            //          color:new echarts.graphic.LinearGradient(0 ,0 ,0 ,1 ,[
            //             {
            //                 offset: 1,
            //                 color: 'rgba(106 ,159 ,147 ,.4)' //a9f93 a2ccc2 c7e5da
            //             },
            //             {
            //                 offset: 0,
            //                 color: 'rgba(106 ,159 ,147 ,1)'
            //             }
            //          ])
            //      },
            //      emphasis:{
            //          focus:'series'
            //      },
            //      data :sentiment_dyn,
            //      tooltip: {
            //         show: false  // 在这个系列上不显示提示框
            //     }
            // }
        ],        
        
        graphic: [{
            type: 'image',
            id: 'play-pause-btn',
            right: 0,
            top: '25%',
            z: 100,
            shape: {
                width: 80,
                height: 30
            },
            style: {
                image: current_mode_image.timeline_river_stop_icon,
                width: 30,
                height: 30,
                opacity: 0.6,
                // fill: '#fff',
                // stroke: '#333',
                // lineWidth: 2,
                // shadowBlur: 8,
                // shadowOffsetX: 3,
                // shadowOffsetY: 3,
                // shadowColor: 'rgba(0,0,0,0.3)'
            },
            onclick: function () {
                isPlaying = !isPlaying;
                playCount = 0; // 重置计数器
            }
        },
        {
            type: 'text',
            id: 'play-pause',
            right: 50,
            top: 27,
            z: 100,
            style: {
                fill: '#333',
                text: '',
                font: '18px JinlingXi'
            },
            onclick: function () {
                isPlaying = !isPlaying;
                playCount = 0; // 重置计数器
            }
        },
        {
            type: 'text',
            id: 'dynasty-text',
            left: 'center',
            top: 'middle',
            z: 100,
            style: {
              fill: '#333',
              text: '',
              font: '180px JinlingXi',
              opacity: 0,
              color:'#c8d8d4'
            }
        }
    
    ]
    };
    

    if (option_dys && typeof option_dys === 'object') {
        myChart.setOption(option_dys);
        let currentIndex = 1;

        let timer = setInterval(function () {
            if (isPlaying) {
                myChart.dispatchAction({
                    type: 'showTip',
                    seriesIndex: 0,
                    dataIndex: currentIndex
                });
                let currentDynasty = dynasties[(currentIndex-1) / 2];
                // console.log(currentDynasty)
                // console.log(currentIndex)
                // 更新知识图谱 add by 白骐硕
                update_knowledge_map_by_dynasty_event_score(currentDynasty);

                // // 获取 img 元素
                // let imgElement = document.querySelector('.bg-image');
                // // 获取当前朝代对应的背景图片URL
                // let backgroundImage = dynastyBackgrounds[currentDynasty];
                // // 更新 img 元素的 src 属性
                // imgElement.src = backgroundImage;
                // 获取 img 元素
                let imgElement = document.querySelector('.bg-image');
                // 将 img 元素的 opacity 设置为 0
                imgElement.style.opacity = 0;
                // 延迟一段时间后再更新 src 属性
                setTimeout(() => {
                    // 获取当前朝代对应的背景图片URL
                    let backgroundImage = dynastyBackgrounds[currentDynasty];
                    // 更新 img 元素的 src 属性
                    imgElement.src = backgroundImage;
                    // 将 img 元素的 opacity 设置回 1
                    imgElement.style.opacity = 0.8;
                }, 500);




                myChart.setOption({
                    graphic: {
                      id: 'dynasty-text',
                      style: {
                        opacity: 0
                      }
                    },
                  });
                // d3.selectAll(".location_circle").transition().duration(500).style("opacity", 0); // 隐藏地图上的点
                // d3.selectAll(".event_circle").transition().duration(500).style("opacity", 0); // 隐藏地图上的点
                // d3.selectAll(".lines").transition().duration(500).style("opacity", 0); // 隐藏地图上的点
                setTimeout(() => { // 添加延时函数
                    // myChart.setOption({
                    //     graphic: {
                    //       id: 'dynasty-text',
                    //       style: {
                    //         text: dynastyTexts[currentDynasty],
                    //         opacity: 0.5
                    //       }
                    //     }
                    //   });
                    
                    works_points(currentDynasty); // 更新数据
                    location_points(currentDynasty, ""); // 传递第二个参数
                    event_points(currentDynasty);
                    
                    

                    /*
                        交互总览图
                    */
                    location_bar(currentDynasty)
                    // drawPieChart(currentDynasty, false)
                    set_litform_selectBox(currentDynasty);
                    d3.selectAll(".location_circle").transition().duration(500); // 显示新的点  .style("opacity", 0.5)
                    d3.selectAll(".event_circle").transition().duration(500); // 显示新的点  0.2
                    d3.selectAll(".lines").transition().duration(500); // 显示新的点  0.8
                }, 500);
                currentIndex = (currentIndex + 2) % 20;
                playCount++; // 每次播放时增加计数器
                if (playCount >= 10) { // 如果播放次数达到10次（即一轮）
                    isPlaying = false; // 停止播放
                    // // 更新地图上的点
                    // works_points("");
                    // location_points("", "");
                    // event_points("");
                    // 延迟一段时间后再触发点击事件
                    setTimeout(() => {
                        // document.querySelector('#move-btn').click();
                    }, 1000);
                }
            }
        }, 2000);

        // let timer = setInterval(function () {
        //     if (isPlaying) {
        //         myChart.dispatchAction({
        //             type: 'showTip',
        //             seriesIndex: 0,
        //             dataIndex: currentIndex
        //         });
        //         let currentDynasty = dynasties[currentIndex / 2];
        //         works_points(currentDynasty); // 更新数据
        //         location_points(currentDynasty, ""); // 传递第二个参数
        //         event_points(currentDynasty);
        //         currentIndex = (currentIndex + 2) % 20;
        //         playCount++; // 每次播放时增加计数器
        //         if (playCount >= 10) { // 如果播放次数达到10次（即一轮）
        //             clearInterval(timer); // 停止定时器
        //             isPlaying = false; // 停止播放
        //             works_points(""); // 更新地图上的点为全部数据点
        //             location_points("", ""); // 更新地图上的点为全部数据点
        //             event_points(""); // 更新地图上的点为全部数据点
        //             setTimeout(() => { // 延迟一段时间后再触发点击事件
        //             document.querySelector('#move-btn').click();
        //             }, 1000);
        //         }
        //     }
        // }, 2000);

        // 先把timer停掉了 ----from 白骐硕
        // clearInterval(timer);


        myChart.on("click", function (params){
            if (params.componentType === 'xAxis') {
                isPlaying = false;
                currentIndex = dynasties.indexOf(params.value)*2+1;
                // console.log(params.value)
                // console.log(currentIndex)
            }
            // 高亮显示当前朝代
            myChart.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: currentIndex,
            });
            if (params.componentType === 'xAxis') {
                /*
                    交互map
                 */
                dyn = params.value;

                works_points( params.value);
                location_points(dyn, "");
                event_points(dyn);
                
                

                /*
                    交互总览图
                */
                location_bar(dyn);
                // drawPieChart(dyn, false)
                set_litform_selectBox(dyn);
                /*
                    南京别称
                 */
                let currentDynasty = params.value;
                // console.log(currentDynasty)
                // 更新知识图谱 add by 白骐硕
                update_knowledge_map_by_dynasty_event_score(currentDynasty);
                
                // myChart.setOption({
                //     graphic: {
                //     id: 'dynasty-text',
                //     style: {
                //         text: dynastyTexts[currentDynasty]
                //     }
                //     }
                // });
                // 获取 img 元素
                let imgElement = document.querySelector('.bg-image');
                // 获取当前朝代对应的背景图片URL
                let backgroundImage = dynastyBackgrounds[currentDynasty];
                // 更新 img 元素的 src 属性
                imgElement.src = backgroundImage;

            }
        })
    }
});



// // 获取所有按钮元素
// let btns_dys = document.querySelectorAll('.navi_btn');

// // 为第一个按钮添加点击事件监听器
// btns_dys[0].addEventListener('click', function() {
//     // 调用getData函数来获取数据
//     getData().then(dynasty_data => {
//         // 处理获取到的数据
//         let river_data = [];
        
//         for (let dynasty in dynasties) {
//         river_data.push(dynasty_data[dynasties[dynasty]]["地点"]["all"]);
//         river_data.push(0);
//         }
        
//         // 更新图表
//         myChart.setOption({
//             legend: {
//                 selected: {
//                     '地点': true,
//                     '事件': false,
//                     '作品': false
//                 }
//             },
//             title: {
//                 text: ''//地点
//             },
//             series: [{
//                 name: '地点',
//                 data: river_data
//             }]
//         });
//     });
// });


// // 为第二个按钮添加点击事件监听器
// btns_dys[1].addEventListener('click', function() {
//     // 调用getData函数来获取数据
//     getData().then(dynasty_data => {
//         // 处理获取到的数据
//         let river_data = [];
        
//         for (let dynasty in dynasties) {
//         river_data.push(dynasty_data[dynasties[dynasty]]["作品"]["all"]);
//         river_data.push(0);
//         }
        
//         // 更新图表
//         myChart.setOption({
//             legend: {
//                 selected: {
//                     '地点': false,
//                     '事件': true,
//                     '作品': false
//                 }
//             },
//             title: {
//                 text: ''//作品
//             },
//             series: [{
//                 data: river_data
//             }]
//         });
//     });
// });

// // 为第三个按钮添加点击事件监听器
// btns_dys[2].addEventListener('click', function() {
//      // 调用getData函数来获取数据
//      getData().then(dynasty_data => {
//         // 处理获取到的数据
//         let river_data = [];
        
//         for (let dynasty in dynasties) {
//         river_data.push(dynasty_data[dynasties[dynasty]]["事件"]["all"]);
//         river_data.push(0);
//         }
        
//         // 更新图表
//         myChart.setOption({
//             legend: {
//                 selected: {
//                     '地点': false,
//                     '事件': false,
//                     '作品': true
//                 }
//             },
//             title: {
//                 text: ''//事件
//             },
//             series: [{
//                 data: river_data
//             }]
//             });
//     });
// });


