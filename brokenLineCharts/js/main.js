// 线条颜色
var lineColor = '#0000FF';
// 线条线型
var lineType = "solid";
// 线条宽度
var lineWidth = 1;
// 点击线条圆点变量
var clickPoint = null;
var myChart = null;
var option = null;
var Info = "";
$(function () {
	function showProject(Info){
		var Info= `{"name": "剂量评估","type": "质点/包围盒/体素","警戒值": "2","路径":"路径1","dosevalue": [{"name": "心脏","value": [{"x": 4,"y": 5,"z": 6,"瞬时值": 7,"累计值": 8,"时间点": 1},{"x": 7,"y": 12,"z": 22,"瞬时值": 4,"累计值": 6,"时间点": "2"}]},{"name": "肺","value": [{"x": 13,"y": 11,"z": 17,"瞬时值": 19,"累计值": 25,"时间点": "1"},{"x": 23,"y": 27,"z": 28,"瞬时值": 7,"累计值": 27,"时间点": "24"}]}]}`;
		var jsonData = eval('('+ Info+')');
		// 数据展示内容
		var dataTool = [];
		// 名称
		var name = [];
		// 瞬时值
		var instant = [];
		// 累计值
		var total = [];
		// 时间点
		var timing = [];
		// x坐标
		var xAxis = [];
		// y坐标
		var yAxis = [];
		// z坐标
		var zAxis = [];
		// table拼接
		var html="<table><thead><tr><th>"+"器官部位(OrganParts)"+"</th><th>"+"瞬时值(instant)"+"</th><th>"+"累计值(total)"+"</th><th>"+"时间点(S)"+"</th><th>"+"x坐标(X)"+"</th><th>"+"y坐标(Y)"+"</th><th>"+"z坐标(Z)"+"</th></tr></thead>";
		for(var i=0;i<jsonData.dosevalue.length;i++){
			for (var j = 0; j < jsonData.dosevalue[i].value.length; j++) {
				var obj = {};
				// 器官部位
				obj.name = jsonData.dosevalue[i].name;
				// 瞬时值
				obj.instant = jsonData.dosevalue[i].value[j].瞬时值;
				// 累计值
				obj.total = jsonData.dosevalue[i].value[j].累计值;
				// 时间点
				obj.timing = jsonData.dosevalue[i].value[j].时间点;
				// x坐标
				obj.xAxis = jsonData.dosevalue[i].value[j].x;
				// y坐标
				obj.yAxis = jsonData.dosevalue[i].value[j].y;
				// z坐标
				obj.zAxis = jsonData.dosevalue[i].value[j].z;
				
				name.push(obj.name);
				instant.push(obj.instant);
				total.push(obj.total);
				timing.push(obj.timing);
				xAxis.push(obj.xAxis);
				yAxis.push(obj.yAxis);
				zAxis.push(obj.zAxis);
				dataTool.push(obj);
				html+="<tbody><tr><td>"+obj.name+"</td><td>"+obj.instant+"</td><td>"+obj.total+"</td><td>"+obj.timing+"</td><td>"+obj.xAxis+"</td><td>"+obj.yAxis+"</td><td>"+obj.zAxis+"</td></tr></tbody>";
			}
		}
		html+="</table>";
		document.getElementById('main-table').innerHTML=html;
		// 剂量评估折线图
		function callbackJson( Info ){
			// 初始化图表
			myChart = echarts.init(document.getElementById("main-bar"));
			option = {
				title : {
					text: jsonData.name,
					left: 'center',
					top: 10,
					textStyle: {
						color: "red",
						fontSize: 18,
		            },
				},
				legend: {
					data: ["瞬时值","累计值"],
					right: 30,
					top: 7,
					// 图例列表的布局朝向
					orient: "vertical",
					itemWidth: 20,
					itemHeight: 7,
				},
				tooltip:{
					// 图例配置
					trigger: 'item',
				},
				// 鼠标hover时高亮样式
				emphasis : {
					itemStyle : {
						// 高亮时点的颜色。
						color : "blue"
					},
					label : {
						show: true,
					}
				},
				xAxis : [
					{
						type : 'category',
						boundaryGap: false,
						data: ['周一','周二','周三','周四','周五','周六','周日'],
						splitLine:{show: false},//去除网格线
					}
				],
				yAxis : [
					{
						type : 'value',
						name : '剂量值/mSv',
						nameLocation : 'center',
						nameGap:23,
						splitLine:{show: false},//去除网格线
					}
				],
				series : [
					{
						name:"瞬时值",
						type:'line',
						itemStyle: {
							normal: {
								color:  lineColor, //改变折线点的颜色
								borderWidth: 5,
								lineStyle: {
									color: lineColor, //改变折线颜色
									type: lineType,
									width:  Number(lineWidth),
								}
							}
						},
						// symbol:'none', //去掉折线标识圆点
						data:instant,
						markLine: {
							silent: true,
							data: [{
								yAxis: 5
							}, {
								yAxis: 10
							}, {
								yAxis: 15
							}, {
								yAxis: 20
							}, {
								yAxis: 25
							}]
						},
						barWidth: '30px', 
						barGap: '0',
						// 图例配置
						tooltip:{
							trigger: 'item',
							formatter: function (params) {             
								var datas = dataTool;
								// console.log(datas);
								var relVal = `${params.name}<hr/>
											${datas[params.dataIndex].name}<br/>
											x : ${datas[params.dataIndex].xAxis}<br/>
											y : ${datas[params.dataIndex].yAxis}<br/>
											z : ${datas[params.dataIndex].zAxis}<br/>
											瞬时值 : ${params.value} mSv`;
								return relVal;
							}
						}
					},
					{
						name:"累计值",
						type:'line',
						itemStyle: {
							normal: {
								color:  lineColor, //改变折线点的颜色
								borderWidth: 5,
								lineStyle: {
									color: lineColor, //改变折线颜色
									type: lineType,
									width:  Number(lineWidth),
								}
							}
						},
						data:total,
						barWidth: '30px', 
						barGap: '0',
						// 图例配置
						tooltip:{
							trigger: 'item',
							formatter: function (params) {             
								var datas = dataTool;
								// console.log(datas);
								var relVal = `${params.name}<hr/>
											${datas[params.dataIndex].name}<br/>
											x : ${datas[params.dataIndex].xAxis}<br/>
											y : ${datas[params.dataIndex].yAxis}<br/>
											z : ${datas[params.dataIndex].zAxis}<br/>
											累计值 : ${params.value} mSv`;
								return relVal;
							}
						}
					}
				],
				// 数据区域缩放组件dataZoom
				dataZoom: [
					{
						type: 'slider',
						xAxisIndex: 0,
						start: 0,
						end: 100
					},
					{
						type: 'inside',
						xAxisIndex: 0,
						start: 0,
						end: 100
					},
					{
						type: 'slider',
						yAxisIndex: 0,
						start: 0,
						end: 100
					},
					{
						type: 'inside',
						yAxisIndex: 0,
						start: 0,
						end: 100
					}
				],
				visualMap: {
					top: 7,
					right: 100,
					pieces: [{
						gt: 0,
						lte: 10,
						color: '#096'
					}, {
						gt: 10,
						lte: 20,
						color: '#ffde33'
					}, {
						gt: 20,
						lte: 30,
						color: '#ff9933'
					}],
					outOfRange: {
						color: '#999'
					}
				},
			};
			myChart.setOption(option);
		}
		callbackJson( Info );
	}
	showProject(Info);

	// 线条点击事件
	myChart.on('click', function (params) {
		// 设置面板显示
		$(".main-set").show();
		// 获取线条名称
		clickPoint = params.seriesName;
		// 累计值线颜色改变
		$('#color-div').colpick({
			colorScheme: 'light',
			color: 'ff8800',
			layout: 'hex',
			livePreview: false,
			flat: true,
			onChange: function (hsb, hex, rgb, el) {
				lineColor = `#${hex}`;
				if (clickPoint === "累计值") {
					// 设置线圆点颜色
					option.series[1].itemStyle.normal.color = lineColor;
					// 设置线颜色
					option.series[1].itemStyle.normal.lineStyle.color = lineColor;
				} else {
					// 设置线圆点颜色
					option.series[0].itemStyle.normal.color = lineColor;
					// 设置线颜色
					option.series[0].itemStyle.normal.lineStyle.color = lineColor;
				}
				// 刷新数据
				myChart.setOption(option);
			},
		})
	})

	// 设置关闭调色板弹窗
	$(".close").click(function (e) {
		e.preventDefault();
		// 面板隐藏
		$(".main-set").hide();
	});

	// 原生方法设置曲线线型
	$("#change-dialog-type").change(function () {
		var text = $("#change-dialog-type option:selected").text();
		if (clickPoint === "累计值") {
			switch (text) {
				case "实线":
					option.series[1].itemStyle.normal.lineStyle.type = "solid";
					break;
				case "虚线":
					option.series[1].itemStyle.normal.lineStyle.type = "dashed";
					break;
				case "点划线":
					option.series[1].itemStyle.normal.lineStyle.type = "dotted";
					break;
				default:
					break;
			}
		} else {
			switch (text) {
				case "实线":
					option.series[0].itemStyle.normal.lineStyle.type = "solid";
					break;
				case "虚线":
					option.series[0].itemStyle.normal.lineStyle.type = "dashed";
					break;
				case "点划线":
					option.series[0].itemStyle.normal.lineStyle.type = "dotted";
					break;
				default:
					break;
			}
		}
		// 刷新数据
		myChart.setOption(option);
		console.log(text);
	})
	
	// 设置曲线宽度
	$("#change-dialog-width").on("input", function () {
		var lineWidth = $(this).val();
		if (clickPoint === "累计值") {
			option.series[1].itemStyle.normal.lineStyle.width = lineWidth;
		} else {
			option.series[0].itemStyle.normal.lineStyle.width = lineWidth;
		}
		// 刷新数据
		myChart.setOption(option);
		console.log(lineWidth);
	});

	// 设置曲线线型
	$('#icon').combo({
		value: "请选择线型",
		selected:true,
		getValue:true,
		editable:false,
		onChange:function(lineType){
			if (clickPoint === "累计值") {
				switch (lineType) {
					case "实线":
						option.series[1].itemStyle.normal.lineStyle.type = "solid";
						break;
					case "虚线":
						option.series[1].itemStyle.normal.lineStyle.type = "dashed";
						break;
					case "点划线":
						option.series[1].itemStyle.normal.lineStyle.type = "dotted";
						break;
					default:
						break;
				}
			} else {
				switch (lineType) {
					case "实线":
						option.series[0].itemStyle.normal.lineStyle.type = "solid";
						break;
					case "虚线":
						option.series[0].itemStyle.normal.lineStyle.type = "dashed";
						break;
					case "点划线":
						option.series[0].itemStyle.normal.lineStyle.type = "dotted";
						break;
					default:
						break;
				}
			}
			// 刷新数据
			myChart.setOption(option);
			console.log(lineType);
		},
	});
})