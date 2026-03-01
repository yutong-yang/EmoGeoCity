// let btns = document.getElementsByClassName('navi_btn');
// let btn2_ready = false;
// for(let i=0; i<btns.length; i++){
//     let btn_name = btns[i].textContent;
//     btns[i].addEventListener('click', function(){
//         let chartClassName;
//         if (i === 1) {
//             chartClassName = 'chart3';
//         } else if (i === 2) {
//             chartClassName = 'chart2';
//         } else {
//             chartClassName = 'chart';
//         }
//         for(let i=0; i<btns.length; i++){
//             let chartClassName2 = 'chart'+(i===0?'':(i+1));
//             if(chartClassName !== chartClassName2){
//                 document.getElementsByClassName(chartClassName2)[0].style.display = 'none';
//             }
//         }
//         document.getElementsByClassName(chartClassName)[0].style.display = 'inline';
//         if(i === 2 && !btn2_ready){
//             chart2_show();
//             btn2_ready = true;
//         }

//         // for chart3
//         if(i === 1){
//             d3.selectAll('.knowledgemap-tip').style('display', 'inline');
//         }else{
//             d3.selectAll('.knowledgemap-tip').style('display', 'none');
//         }
        
//     }, false);
//     btns[2].addEventListener('dblclick', function(){
//         chart2_init();
//     }, false);
// }

let btns = document.getElementsByClassName('navi_btn');
let btn2_ready = false;
for(let i=0; i<btns.length; i++){
    let btn_name = btns[i].textContent;
    btns[i].addEventListener('click', function(){
        // 获取chart2和chart3元素
        let chart4 = document.getElementsByClassName('chart4')[0];
        let chart3 = document.getElementsByClassName('chart3')[0];
        // 设置chart2和chart3的display属性为inline
        chart4.style.display = 'inline';
        chart3.style.display = 'inline';
        if(i === 2 && !btn2_ready){
            chart2_show();
            btn2_ready = true;
        }

        // for chart3
        if(i === 1){
            d3.selectAll('.knowledgemap-tip').style('display', 'inline');
        }else{
            d3.selectAll('.knowledgemap-tip').style('display', 'none');
        }
        
    }, false);
    btns[2].addEventListener('dblclick', function(){
        chart2_init();
    }, false);
}
