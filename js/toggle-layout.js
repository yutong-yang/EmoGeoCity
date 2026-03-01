document.querySelector('#toggle-layout-btn').addEventListener('click', function() {
    // 获取所有类名为chart的元素
    let elements = document.querySelectorAll('.chart');
    // 获取ID为map-svg的元素
    let mapElement = document.querySelector('#map-svg');
    // 获取按钮元素
    let button = document.querySelector('#toggle-layout-btn');

    // 判断当前显示的是哪种视图
    if (button.textContent === "Map") {
        // 如果当前显示的是地图，则切换到散点图
        elements.forEach(function(element) {
            element.style.visibility = "visible";
        });
        mapElement.style.display = "none";
        button.textContent = "Scatter";
    } else {
        // 如果当前显示的是散点图，则切换到地图
        elements.forEach(function(element) {
            element.style.visibility = "hidden";
        });
        mapElement.style.display = "block";
        button.textContent = "Map";
    }
});

let imageElements = document.querySelectorAll(".square"); // 获取所有图像元素
imageElements.forEach(function(imageElement) {
        imageElement.style.visibility = "visible";
});