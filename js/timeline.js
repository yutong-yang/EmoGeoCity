
var data = {};

// 获取所有的时间点元素
var points = document.querySelectorAll('#timeline div');

// 当前显示的索引
var currentIndex = 0;

// 时间轴播放状态
var playing = false;


// 获取所有数据
function getData() {
    // 定义要获取的文件列表
    var files = ['./json/en/dynasty_location_2_events.json', './json/en/dynasty_location_2_works.json'];
  
    // 同时获取所有文件的数据
    Promise.all(files.map(file => fetch(file).then(response => response.json())))
      .then(jsonDataArray => {
        // 获取第一个文件的数据
        var eventsData = jsonDataArray[0];
        // 获取第二个文件的数据
        var worksData = jsonDataArray[1];
  
        // 定义朝代顺序
        var dynasties = ['Eastern Wu', 'Jin', 'Southern Dynasties', 'Tang', 'Southern Tang', 'Song', 'Yuan', 'Ming', 'Qing', 'Modern'];
  
        // 定义转换后的数据
        var convertedData = {};
  
        // 遍历所有朝代
        for (var i = 0; i < dynasties.length; i++) {
          // 获取当前朝代
          var dynasty = dynasties[i];
          // 获取当前朝代对应的事件信息
          var eventsInfo = eventsData[dynasty];
          // 获取当前朝代对应的作品信息
          var worksInfo = worksData[dynasty];
  
          // 将信息添加到转换后的数据中
          convertedData[dynasty] = {
            events: eventsInfo,
            works: worksInfo
          };
        }
  
        // 更新data对象
        data = convertedData;
        // console.log(data)
      });
  }
  

// 时间轴播放函数
var play = function() {
  if (playing) {
    // 获取当前时间点对应的朝代
    var dynasty = points[currentIndex].getAttribute('data-dynasty');
    // 获取当前时间点对应的信息
    var info = data[dynasty];
    // 在页面上显示信息
    document.getElementById('info').innerHTML = info;

    // 更新时间点样式
    for (var i = 0; i < points.length; i++) {
      points[i].classList.remove('active');
    }
    points[currentIndex].classList.add('active');

    // 更新索引
    currentIndex = (currentIndex + 1) % points.length;
  }
};

// 开始/暂停按钮点击事件
document.getElementById('play-pause').addEventListener('click', function() {
  playing = !playing;

  // 更新按钮图标
  if (playing) {
    this.innerHTML = '<i class="fa fa-pause"></i>';
  } else {
    this.innerHTML = '<i class="fa fa-play"></i>';
  }



});

// 自动播放时间轴
setInterval(play, 1000);

// 调用getData函数来获取数据
getData();

// 获取所有的时间点元素
var points = document.querySelectorAll('#timeline div');

// 遍历所有时间点元素
for (var i = 0; i < points.length; i++) {
    // 获取当前时间点元素
    var point = points[i];
    // 为当前时间点元素添加点击事件监听器
    point.addEventListener('click', function() {
        // 获取当前时间点对应的朝代
        var dynasty = this.getAttribute('data-dynasty');
        // 获取当前时间点对应的信息
        var info = data[dynasty];
        // console.log(dynasty)
        // console.log(info)
        // 在页面上显示信息
        document.getElementById('info').innerHTML = info;

        // 更新时间点样式
        for (var i = 0; i < points.length; i++) {
            points[i].classList.remove('active');
            }
            this.classList.add('active');
        });
}
