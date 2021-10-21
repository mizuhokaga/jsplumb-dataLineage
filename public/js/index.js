/* global $, visoConfig, uuid,Mustache, jsPlumb,  */
requestURL = 'http://localhost:3000/columnsLineage';
jsonData = null;
(function () {
    var area = 'bg'
    var areaId = '#' + area
    var fixedNodeId = {
        begin: 'begin-node',
        end: 'end-node'
    }
    var firstInstance = jsPlumb.getInstance();
    jsPlumb.ready(main)
    jsPlumb.importDefaults({
        ConnectionsDetachable: false
    });

    // 获取基本配置
    function getBaseNodeConfig() {
        return Object.assign({}, visoConfig.baseStyle)
    };

    // 让元素可拖动
    function addDraggable(id) {
        jsPlumb.draggable(id, {
            containment: '#bg'
        })
    };

    // 设置起源表每一列的端点
    function setOriginPoint(id, position) {
        var config = getBaseNodeConfig()

        config.isSource = true
        //一个起源表的字段可能是多个RS字段的来源 这里-1不限制连线数
        config.maxConnections = -1
        jsPlumb.addEndpoint(id, {
            anchors: [position || 'Right',],
            uuid: id + '-OriginTable'
        }, config)
    };

    // 设置RS端点
    function setRSPoint(id, position) {
        var config = getBaseNodeConfig()

        config.isTarget = true
        //RS表一个字段可能是来自多个起源表字段 这里-1不限制连线数
        config.maxConnections = -1
        jsPlumb.addEndpoint(id, {
            anchors: position || 'Left',
            uuid: id + '-RSTable'
        }, config)
    };

///////////////////////////////////////////////////
    function main() {
        jsPlumb.setContainer('bg');

        // 请求接口血缘json
        $.get(requestURL, function (res, status) {
            if (status === "success") {
                jsonData = res;
                DataDraw.draw(jsonData)
            }
        }, 'json');
        // 或使用本地数据
        // DataDraw.draw(json)
    }

///////////////////////////////////////////////
    var DataDraw = {
        // 核心方法
        draw: function (json) {
            var $container = $(areaId)
            var that = this
            //遍历渲染所有节点
            json.nodes.forEach(function (item, key) {
                var data = {
                    id: item.id,
                    name: item.id,
                    top: item.top,
                    left: item.left,
                };
                //根据不同类型的表获取各自的模板并填充数据
                var template = that.getTemplate(item);
                $container.append(Mustache.render(template, data));
                //根据json数据添加表的每个列
                //将类数组对象转换为真正数组避免前端报错 XX.forEach is not a function
                item.columns = Array.from(item.columns);
                //将该表的所有列
                item.columns.forEach(col => {
                    var ul = $('#' + item.id + '-cols');
                    //这里li标签的id应该和 addEndpointOfXXX方法里的保持一致
                    var li = $("<li id='id-col'  class='col-group-item panel-node-list'>col</li>");
                    // console.log(li[0])
                    //修改每个列名所在li标签的id使其独一无二
                    li[0].id = item.name + '.' + col.name
                    //填充列名
                    li[0].innerText = col.name;
                    ul.append(li);
                });
                //根据节点类型找到不同模板各自的 添加端点 方法
                if (that['addEndpointOf' + item.type]) {
                    that['addEndpointOf' + item.type](item)
                }
            });
            //最后连线
            this.finalConnect(json.nodes, json.relations)
        },
        //根据节点类型找到对应的渲染方法
        finalConnect: function (nodes, relations) {
            var that = this;
            nodes.forEach(function (node) {
                //RS表要排除，
                if (node.id != 'RS' && node.type != 'RS') {
                    //遍历每个表的每个列
                    node.columns.forEach(col => {
                        relations.forEach(relation => {
                            var relName = relation.source.parentName + '.' + relation.source.column;
                            var nodeName = node.name + '.' + col.name;
                            //如果关系中的起始关系等于当前表节点的列，就构建连接
                            if (relName === nodeName) {
                                //这里sourceUUID、targetUUID应该和addEndpoint里设置的uuid一致
                                var sourceUUID = nodeName + "-OriginTable";
                                var targetUUID = relation.target.parentName + '.' + relation.target.column + '-RSTable';
                                that.connectEndpoint(sourceUUID, targetUUID);
                            }
                        });
                    });
                }
            })
        },
        addEndpointOfOrigin: function (node) {
            //节点设置可拖拽
            addDraggable(node.id);
            // initOriginTable(node.id);
            node.columns = Array.from(node.columns);
            node.columns.forEach(function (col) {
                //这里的id应该和draw方法里设置的id保持一致
                setOriginPoint(node.id + '.' + col.name, 'Right')
            })
        },
        addEndpointOfRS: function (node) {
            addDraggable(node.id)
            node.columns = Array.from(node.columns);
            node.columns.forEach(function (col) {
                setRSPoint(node.id + '.' + col.name, 'Left')
            })
        },

        connectEndpoint: function (from, to) {
            // 通过编码连接endPoint需要用到uuid
            jsPlumb.connect({uuids: [from, to]})
        },

        getTemplate: function (node) {
            return $('#tpl-' + node.type).html();
        },
    }
})()
