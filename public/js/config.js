var visoConfig = {
    visoTemplate: {}
}

// 基本连接线样式
visoConfig.connectorPaintStyle = {
    lineWidth: 2,
    strokeStyle: '#c4c4c4',
    // joinstyle: 'round',
    // fill: 'pink',
    outlineColor: '',
    outlineWidth: ''
}

// 鼠标悬浮在连接线上的样式
visoConfig.connectorHoverStyle = {
    lineWidth: 3,
    strokeStyle: 'black',
    outlineWidth: 10,
    outlineColor: ''
}

visoConfig.baseStyle = {
    endpoint: ['Dot', {
        radius: 2,
    }], // 端点的形状
    connectorStyle: visoConfig.connectorPaintStyle, // 连接线的颜色，大小样式
    connectorHoverStyle: visoConfig.connectorHoverStyle,
    paintStyle: {
        // strokeStyle: '#1e8151',
        // stroke: '#7AB02C',
        // fill: 'pink',
        // fillStyle: '#1e8151',
        lineWidth: 2
    }, // 端点的颜色样式
    hoverPaintStyle: {stroke: 'blue'},
    isSource: true, // 是否可以拖动（作为连线起点）
    isTarget: true, // 是否可以放置（连线终点）
    // maxConnections: -1, // 设置连接点最多可以连接几条线 -1不限
    connectorOverlays: [
        ['Arrow', {
            width: 10,
            length: 13,
            location: 1
        }],
    ]
}
visoConfig.baseArchors = ['RightMiddle', 'LeftMiddle']
