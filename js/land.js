// 使用d3.json方法加载JSON文件
d3.json("json/en/location_category.json").then(function (json) {
    // 使用解析后的数据替换原来的types数组和data数组
    let types = Object.keys(json);
    let data = [];
    types.forEach(function (type) {
        json[type].forEach(function (item) {
            data.push({
                type: type,
                id: item["地名id"],
                name: item["地名"],
                value: item["作品数量"],
                info: item["地名描述"],
                dys: item["朝代"],
                related: item["相关地点"]
            });
        });
    });
    // console.log(data);


    /*
        定义常量
    */
    // let width = 1000;

    let width = document.querySelector('.chart').clientWidth;
    let height = document.querySelector('.chart').clientHeight;
    let squareWidth = width * 0.1;
    let squareHeight = height * 0.1;
    // height = 1000;
    let square_color = ["#909f9c", "#6a7985", "#c8d8d4"];
    let location_id = -1;
    let colorMap = {
        "山脉": "#70896d",
        "水体": "#6496bc",
        "官方建筑": "#669e8b",
        "寺观祠庙": "#839968",
        "建筑": "#7eaa82",
        "园林": "#7db29a",
        "生活设施": "#aacec0",
        "古迹": "#b5caa0"
    };

    // 添加正方形编码
    types = ["山脉", "水体", "官方建筑", "寺观祠庙", "建筑", "园林", "生活设施", "古迹"];

    // 创建 SVG 元素
    let svg = d3.select(".chart")
        .append("svg")
        //   .style("overflow", "scroll")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "graph-svg-component")
        ;

    let temp_height = (height - squareHeight - 60) / 10
    // 创建比例尺
    let scale = d3.scaleOrdinal()
        .domain(["Eastern Wu", "Tang", "Song", "Yuan", "Ming", "Qing", "Modern"])
        // .range([0, height - squareHeight - 60]);
        .range([0, temp_height * 3.5, temp_height * 4.5, temp_height * 5.5, temp_height * 6, temp_height * 8, temp_height * 9.5, temp_height * 10]);

    // 创建纵轴生成器
    let axis = d3.axisRight(scale);  //axisLeft  axisRight

    // 绘制纵轴
    svg.append("g")
        .attr("class", "axis yAxis")
        .attr("transform", `translate(5, ${squareHeight + 40})`)  //40   ${width - 200}
        .call(axis)
        .selectAll("text")
        .style("font-family", "JinlingXi")
        // .style("fill", "black") // 更改文本颜色
        .style("opacity", 0.6); // 更改文本透明度

    svg.selectAll(".yAxis path")
        .style("stroke", "black") // 更改轴线颜色 square_color[0]
        .style("opacity", 0.1); // 更改轴线透明度

    svg.selectAll(".yAxis line")
        .style("stroke", "black") // 更改刻度线颜色 square_color[0]
        .style("opacity", 0.1); // 更改刻度线透明度

    //     .style("opacity", function(d) {
    //         let opacity = opacityScale(keywords_2_workId_land['现当代'][d.data.name]['until_average_score']);
    //         return opacity;
    // })

    let square_action = (selected, square, d) => {
        // d3.selectAll(".square rect").style("fill", square_color[0]);
        // d3.select(square).style("fill", selected ? square_color[0] : square_color[1]);
        // // console.log(d3.selectAll(".node circle"));;
        // d3.selectAll(".node circle").style("opacity", selected ? 0.8 : function(e) {
        //     if(e.data === undefined){
        //         return e === d ? 0.8 : 0.2;
        //     } else {
        //         return e.data.type === d ? 0.8 : 0.2;
        //     }
        // });
        d3.selectAll(".node text").style("opacity", selected ? 0.8 : function (e) {
            if (e.data === undefined) {
                return e === d ? 0.8 : 0.2;
            } else {
                return e.data.type === d ? 0.8 : 0.2;
            }
        });
    }

    /*
        右边
        创建气泡布局
    */
    let bubble = d3.pack()
        .size([width, height])
        .padding(width * 0.1);
    let nodes = d3.hierarchy({ children: data })
        .sum(function (d) { return d.value; });

    let transY = [0, 0, 0, 0, 0, 0, 0, 0];
    let timer = true;
    let ratio = 20;
    let row = svg.selectAll(".row")
        .data(types)
        .enter()
        .append("g")
        .attr("class", "row")
        .attr('id', function (d, i) {
            return `row${i}`;
        })
        .attr('name', 0)
        .style("overflow", "scroll") // 设置div元素的overflow属性为scroll
        .attr("transform", function (d, i) {
            return `translate(${20 + (i * (width / types.length))}, 0)`;  //i * (width / types.length)* 0.8 + 20
        })
        .on('mousewheel', function (e, d) {
            let i = types.indexOf(d);
            let { deltaY } = e;
            let id = this.id.split('row')[1];
            transY[id] += deltaY / ratio;
            transY[id] = transY[id] < 0 ? transY[id] : 0;
            transY[id] = transY[id] > -width / 2 ? transY[id] : -width / 2;
            ratio = ratio > 6 ? ratio - 2 : 10;
            if (timer) {
                timer = false;
                setTimeout(function () {
                    ratio = 20;
                    timer = true;
                }, 3000);
            }
            d3.select(this)
                .attr('transform', function () {
                    return `translate(${(i * (height / types.length))}, ${transY[id]})`
                });
        });
    /*
        row上面的方块
        用于滑动触发
    */
    // let row_rect = row
    //     .append('rect')
    //     .attr("x", 0)
    //     .attr("y", 0)
    //     .attr('height', 50)
    //     .attr('width', width*2)
    //     .attr('fill', '#c8d8d4')
    //     .attr("transform", function(d, i) {
    //         return `translate(120, 10)`;
    //     });;
    /*
        左边
        添加正方形
        包括一个大长方形用于遮挡，和多个长方形标注地点
    */
    // let top_square = svg
    //     .append('rect')
    //     .attr("x", 0)
    //     .attr("y", 0)
    //     .attr('height', 120)
    //     .attr('width', width)
    //     // .attr('fill', '#c8d8d4');


    // let imageUrl = "./images/yuanlin.png"
    // let imageUrlArray = ["./images/山脉.png", "./images/水体.png", "./images/官方建筑.png", "./images/寺观祠庙.png", "./images/建筑.png", "./images/园林.png", "./images/生活设施.png", "./images/古迹.png"];
    let imageUrlArray = current_mode_image.category_icon;

    let square = svg.selectAll(".square")
        .data(types)
        .enter()
        .append("g")
        .attr("class", "square")
        .attr('id', function (d, i) {
            return `square${i}`;
        })
        .attr("transform", function (d, i) {
            return "translate(" + (i * (width / types.length) + 20) + ", 0)";
        });

    let selected = true;

    square.append("image")
        .attr("xlink:href", function (d, i) { return imageUrlArray[i]; })
        .attr("width", squareWidth)
        .attr("height", squareHeight)
        // .attr("opacity", 0.1)
        .attr("name", function (d, i) {
            return types[i];
        })
        .style("cursor", "pointer")
        .on("click", function (e, d) {
            selected = !selected;
            square_action(selected, this, d)
            cat = selected ? "" : d;
            location_points(dyn, cat);
        })
        .on("mouseover", function (e, d) {
            if (selected) {
                square_action(false, this, d)
            }
        })
        .on("mouseout", function (e, d) {
            if (selected) {
                square_action(true, this, d)
            }
        });
    // square.append("text")
    //     .attr("x", 10)
    //     .attr("y", -5)
    //     .style("text-anchor", "middle")
    //     .text(function(d) { return d; });

    /*
        row里面的node
     */
    let prevDys = null;
    let offset = 0;

    let node = row.selectAll(".node")
        .data(function (d) {
            // 对数据进行排序
            var sortedData = bubble(nodes).descendants().filter(function (e) {
                return !e.children && e.data.type === d;
            }).sort(function (a, b) {
                if (a.data.dys === b.data.dys) {
                    return b.data.value - a.data.value;
                } else {
                    return scale(a.data.dys) - scale(b.data.dys);
                }
            });
            return sortedData;
        })
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function (d, i) {
            // return `translate(${width*0.1-35}, ${160 + i * 35})`;  //排列方式1:从大到小
            // let y = scale(d.data.dys) + squareHeight + 40;  //排列方式2: 朝代（重合）
            if (prevDys !== d.data.dys) {
                offset = 0;
            }
            let y = scale(d.data.dys) + squareHeight + 40 + offset;  //排列方式3: 朝代+从大到小
            prevDys = d.data.dys;
            offset += 15;
            return `translate(${width * 0.1 - 35}, ${y})`;
        });



    /*
        添加圆形
        node_text_show 显示下拉框
        node_text_hide 隐藏下拉框
    */
    // 创建比例尺
    let radiusScale = d3.scaleSqrt()
        .domain([0, d3.max(data, function (d) { return d.value; })])
        .range([0, 20]);

    let locationInfo = svg.append("g"); // 创建一个分组元素来容纳所有的文本元素
    let lastImage = d3.select("image[name='古迹']"); // 选择最后一个image元素
    let ctm1 = lastImage.node().getCTM();
    // let y1 = ctm1.f;
    let bbox = lastImage.node().getBBox(); // 获取image元素的边界框
    let x1 = ctm1.e + bbox.width * 2.3; // 计算x坐标为最后一个image元素向右半个image元素宽度
    let domain = scale.domain(); // 获取比例尺的定义域
    let minY = squareHeight; // 获取定义域中的最小值，并将其映射到坐标轴上
    let maxY = height; // 获取定义域中的最大值，并将其映射到坐标轴上
    let y1 = minY; // 初始化y坐标为坐标轴的最低y值

    // let colorMap = {
    //     "山脉": "#70896d",
    //     "水体": "#6496bc",
    //     "官方建筑": "#669e8b",
    //     "寺观祠庙": "#839968",
    //     "建筑": "#7eaa82",
    //     "园林": "#7db29a",
    //     "生活设施": "#aacec0",
    //     "古迹": "#b5caa0"
    // };


    let colorScale = d3.scaleThreshold()
        .domain([0.00001, 0.5])
        .range(["blue", "blue", "red"]); //#70896d

    let opacityScale = d3.scaleLinear()
        .domain([0, 0.00001, 0.5, 1])
        .range([0.05, 0.5, 0.2, 0.5]);

    let keywords_2_workId_land;

    let clicked = false;

    d3.json("json/en/dynasty_keywords.json").then(function (data) {
        keywords_2_workId_land = data;

        node.append("circle")
            .attr("name", function (d) { return d.data.name; })
            // .attr("r", function(d) { return d.r; })
            .attr("r", function (d) { return radiusScale(d.data.value) * 0.8; })
            // .style("fill", function(d) { return colorMap[d.data.type]; })
            .style("fill", function (d) {
                let color = colorScale(keywords_2_workId_land['Modern'][d.data.name]['until_average_score']);
                return color;
            })
            // .style("stroke", square_color[1])
            // .style("opacity", 0.8)
            .style("opacity", function (d) {
                let opacity = opacityScale(keywords_2_workId_land['Modern'][d.data.name]['until_average_score']);
                return opacity;
            })
            .each(function (d) {
                this.setAttribute("data-row", d.data.row);
            });
        node.on("mouseover", function (e, d) {
            // 线和名字
            // 删除已有的线和文本
            svg.selectAll(".line").remove();
            svg.selectAll(".text").remove();

            // 获取圆的圆心坐标
            let ctm = this.getCTM();
            let cx = ctm.e;
            let cy = ctm.f;

            // 定义竖线的数据
            let lineData1 = [[cx, cy], [cx + 10, cy - 10]];

            // 定义横线的数据
            let lineData2 = [[cx + 10, cy - 10], [cx + 50, cy - 10]];

            // 定义line生成器
            let lineGenerator = d3.line();

            // 绘制竖线
            svg.append("path")
                .attr("class", "line")
                .attr("d", lineGenerator(lineData1))
                .attr("stroke", square_color[0])
                .attr("fill", "none");

            // 绘制横线
            svg.append("path")
                .attr("class", "line")
                .attr("d", lineGenerator(lineData2))
                .attr("stroke", square_color[0])
                .attr("fill", "none");

            // 添加文本
            svg.append("text")
                .attr("class", "text")
                .attr("x", cx + (60 / 2))
                .attr("y", cy - 15)
                .style("text-anchor", "middle")
                .text(d.data.name)
                .style("font-size", "14")
                ;
        })
        node.on("mouseout", function (e, d) {
            // 删除已有的线和文本
            if (!clicked) {
                svg.selectAll(".line").remove();
                svg.selectAll(".text").remove();
            }
        });
        // 在点击事件处理函数中更新文本内容
        node.on("click", function (e, d) {
            // console.log(d)
            //在view右侧显示
            // clicked = true;
            // // 内容介绍
            // // console.log('x1');
            // // console.log(minY)
            // // console.log(maxY)
            // locationInfo.selectAll("text").remove(); // 删除分组元素中已有的文本元素
            // let infoArray = (d.data.name+"："+d.data.info).replace(/“/g, '「').replace(/”/g, '」').split(""); // 将地点简介拆分为单个字符
            // infoArray.forEach((char, i) => { // 遍历每个字符
            //     let text = locationInfo.append("text") // 在分组元素中添加一个新的文本元素
            //         .attr("x", x1)
            //         .attr("y", y1)
            //         .text(char)
            //         .style("opacity", 0)
            //         .style("font-size", "13")
            //         ; // 初始时将透明度设置为0
            //     text.transition() // 添加过渡动画
            //         .delay(i * 100) // 设置延迟时间，使每个字符依次出现
            //         .style("opacity", 1)
            //         .style("font-size", "13")
            //         ; // 将透明度设置为1，使文本可见
            //     y1 += 18; // 更新y坐标，使文本纵向排列
            //     if (y1 > maxY) { // 如果y坐标超过了坐标轴的最高y值
            //         y1 = minY; // 重置y坐标为坐标轴的最低y值
            //         x1 -= 20; // 更新x坐标，使文本转到左上继续向下写
            //     }
            // });

            //在info横向显示（英文适用）

            clicked = true;
            generate_info_container(d.data.name);

            let location_id = d.data.id;
            draw_knowledge_map_by('location', location_id);






            x1 = ctm1.e + bbox.width * 2.3;
            y1 = minY;

            // 线和名字
            // 删除已有的线和文本
            svg.selectAll(".line").remove();
            svg.selectAll(".text").remove();

            // 获取圆的圆心坐标
            let ctm = this.getCTM();
            let cx = ctm.e;
            let cy = ctm.f;

            // 定义竖线的数据
            let lineData1 = [[cx, cy], [cx + 10, cy - 10]];

            // 定义横线的数据
            let lineData2 = [[cx + 10, cy - 10], [cx + 50, cy - 10]];

            // 定义line生成器
            let lineGenerator = d3.line();

            // 绘制竖线
            svg.append("path")
                .attr("class", "line")
                .attr("d", lineGenerator(lineData1))
                .attr("stroke", square_color[0])
                .attr("fill", "none");

            // 绘制横线
            svg.append("path")
                .attr("class", "line")
                .attr("d", lineGenerator(lineData2))
                .attr("stroke", square_color[0])
                .attr("fill", "none");

            // 添加文本
            svg.append("text")
                .attr("class", "text")
                .attr("x", cx + (60 / 2))
                .attr("y", cy - 15)
                .style("text-anchor", "middle")
                .text(d.data.name)
                .style("font-size", "14")
                ;


            /*
                地点关联连线
            */
            // 删除已有的线
            svg.selectAll(".related-line").remove();
            // 获取当前点击的地点的相关地点
            let relatedLocations = d.data.related;
            // console.log(relatedLocations)
            // 遍历每个相关地点
            relatedLocations.forEach(function (location) {
                // 获取当前相关地点对应的圆
                let relatedCircle = d3.select("circle[name='" + location + "']");
                // console.log(relatedCircle)
                // console.log(this)
                // console.log(d)

                // 获取当前相关地点对应的圆的圆心坐标
                let ctm3 = relatedCircle.node().getCTM();
                let x3 = ctm3.e;
                let y3 = ctm3.f;

                // 定义线的数据
                let lineData = [[x3, y3], [cx, cy]];
                // 定义line生成器
                let lineGenerator = d3.line();
                // 绘制线
                svg.append("path")
                    .attr("class", "related-line")
                    .attr("d", lineGenerator(lineData))
                    .attr("stroke", square_color[0])
                    .attr("opacity", 0.7)
                    .attr("stroke-width", 0.5)
                    .attr("fill", "none");
            });

            // 获取当前点击的圆形元素对应的地点名称或 ID
            let locationName = d.data.name;
            // 使用 window.postMessage 方法向 map.js 发送数据
            window.postMessage({ type: "HIGHLIGHT_LOCATION", locationName: locationName }, "*");
        });



        // .on("click", function(d, i) {
        //     let dropdown = d3.select("#dropdown");
        //     let row_id = parseInt(this.parentNode.parentNode.id.split('row')[1]);
        //     // console.log(row_id);
        //     if (location_id !== d.data.id) {
        //         node_text_hide(d, i, dropdown, row_id);
        //         node_text_show(d, i, dropdown, row_id);
        //     } else {
        //         node_text_hide(d, i, dropdown, row_id);
        //     }
        // });
        // 在页面加载完成后立即执行添加文本的代码
        // let infoArray = "金陵是中国历史悠久的古城之一。这座城市以其丰富的历史文化和令人惊叹的自然景观而享有盛誉。本视图将金陵地点分为八大类：山脉、水体、官方建筑、寺观祠庙、建筑、园林、生活设施、古迹；代表了金陵不同方面的独特之处。请点击地点获得具体信息。".split(""); // 将文本拆分为单个字符
        // infoArray.forEach((char, i) => { // 遍历每个字符
        //     let text = locationInfo.append("text") // 在分组元素中添加一个新的文本元素
        //         .attr("x", x1)
        //         .attr("y", y1)
        //         .text(char)
        //         .style("font-size", "13")
        //         ;

        //     y1 += 18; // 更新y坐标，使文本纵向排列
        //     if (y1 > maxY) { // 如果y坐标超过了坐标轴的最高y值
        //         y1 = minY; // 重置y坐标为坐标轴的最低y值
        //         x1 -= 20; // 更新x坐标，使文本转到左上继续向下写
        //     }
        // });
        x1 = ctm1.e + bbox.width * 2.3;
        y1 = minY;


        let node_text_show = (d, i, dropdown, row_id) => {
            location_id = d.data.id;
            dropdown
                .style("display", "block")
                .style("left", "600px")
                .style("top", `${(row_id * (height / types.length) + 100)}px`);

            /*
                更改下拉框中的文本内容
                更改长方形和气泡图的位置
            */
            dropdown.select("p").text(d.data.name + "：" + d.data.info);
            let dropdown_height = parseInt(dropdown.style('height').split('px')[0]) + 20;

            // square.attr("transform", function(d2, i2) {
            //     let y = i2 * (height / types.length) + 20;
            //     if (i2 > row_id) {
            //         y += dropdown_height;
            //     }
            //     return `translate(${y}, 20)`;
            // });
            // row.attr("transform", function(d2, i2) {
            //     let y = (i2 * (height / types.length));
            //     if (i2 > row_id) {
            //         y += dropdown_height;
            //     }
            //     return `translate(${y}, 0)`;
            // });
        }

        let node_text_hide = (d, i, dropdown, row_id) => {
            dropdown.style("display", "none");

            /*
                恢复长方形和气泡图的原始位置
            */
            // square.attr("transform", function(d, i) {
            //     return "translate("+ (i * (width / types.length) + 20) + ", 20)";
            // });

            // row.attr("transform", function(d, i) {
            //     let y = (i * (width / types.length));
            //     return `translate(${y}, 0)`
            // });
            location_id = -1;
        }



        // 更新 SVG 元素的宽度
        // svg.attr("width", xScale.range()[1] + 100);

        // 添加文本
        // node.append("text")
        //     .attr("dy", ".3em")
        //     .style("text-anchor", "middle")
        //     .text(function(d) { return d.data.name; });


        // // 获取每个row中所有circle的圆心坐标
        // let lineData = [];
        // row.each(function(d, i) {
        //     let rowLineData = [];
        //     d3.select(this).selectAll("circle").each(function(d) {
        //         let ctm = this.getCTM();
        //         let cx = ctm.e;
        //         let cy = ctm.f;
        //         rowLineData.push([cx, cy]);
        //     });
        //     lineData.push(rowLineData);
        // });


        // // 定义line生成器
        // let lineGenerator = d3.line()
        //     // .x(function(d) { return d; })
        //     // .y(function(d, i) { return ticks[i]; });

        // // 在每个row中绘制一条线
        // row.each(function(d, i) {
        //     d3.select(this).append("path")
        //         .attr("d", "M 79 130 L 79 1000")
        //         // .attr("d", lineGenerator(lineData[i]))
        //         .attr("stroke", "#c8d8d4")
        //         .attr("opacity", "0.6")
        //         .attr("fill", "none");
        // });

        // // 横线
        // row.each(function(d, i) {
        //     if (i<7){
        //         d3.select(this).append("path")
        //         .attr("d", "M 79 130 L 195 130")
        //         // .attr("d", lineGenerator(lineData[i]))
        //         .attr("stroke", "#c8d8d4")
        //         .attr("opacity", "0.6")
        //         .attr("fill", "none");
        //     }

        // });

        let circle3 = d3.select("circle[name='石头城']");
        let circle4 = d3.select("circle[name='佛国寺']");
        // 获取石头城的圆心坐标
        let ctm5 = circle3.node().getCTM();
        let x5 = ctm5.e;
        let y5 = ctm5.f;

        // 获取谢公墩的圆心坐标
        let ctm6 = circle4.node().getCTM();
        let x6 = ctm6.e;
        let y6 = ctm6.f;

        // 初始化一个数组来存储每个row中选中的圆的坐标
        let coords = [];

        // 定义line生成器
        let lineGenerator = d3.line();


        // 遍历每个row元素
        d3.selectAll(".row").each(function () {
            // 获取当前row元素中的一个圆
            let circle = d3.select(this).select("circle");

            // 获取圆的圆心坐标
            let ctm5 = circle.node().getCTM();
            let x = ctm5.e;
            let y = ctm5.f;

            // 记录当前圆的坐标
            coords.push([x, y]);

            // 定义线的数据
            let lineData = [[x, y5], [x, y6]];

            // 绘制线
            svg.append("path")
                .attr("d", lineGenerator(lineData))
                .attr("stroke", '#c8d8d4')
                .attr("fill", "none")
                .attr("opacity", 0.8)
                ;
        });
        // 输出每个row中选中的圆的坐标
        // console.log('coords');
        // console.log(coords);
        // 绘制横线
        svg.append("line")
            .attr("x1", coords[0][0])
            .attr("y1", y5)
            .attr("x2", coords[7][0])
            .attr("y2", y5)
            .attr("stroke", '#c8d8d4')
            .attr("opacity", 0.8)
            ;

    })
})

// 问题1:加了线image就无法点选 let circle = d3.select(this).select("circle");
// 问题2:加了线圆悬浮时就不会显示名称 let circle2 = d3.select("circle[name='秦淮']");
