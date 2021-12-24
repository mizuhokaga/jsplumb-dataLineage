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
        });
    };

    // 设置起源表每一列的锚点为了后面连线
    function setOriginPoint(id, position) {
        var config = getBaseNodeConfig()

        config.isSource = true
        //一个起源表的字段可能是多个RS字段的来源 这里-1不限制连线数
        config.maxConnections = -1
        jsPlumb.addEndpoint(id, {
            anchors: [position || 'Right',],
            uuid: id + '-Right'
        }, config)
    };

    // 设置中间表的锚点为了后面连线
    function setMiddlePoint(id, position) {
        var config = getBaseNodeConfig()
        config.maxConnections = -1
        jsPlumb.addEndpoint(id, {
            anchors: ['Left'],
            uuid: id + '-Left'
        }, config)

        jsPlumb.addEndpoint(id, {
            anchors: ['Right'],
            uuid: id + '-Right'
        }, config)
    }

    // 设置RS结果表每一个列的锚点为了后面连线
    function setRSPoint(id, position) {
        var config = getBaseNodeConfig()

        config.isTarget = true
        //RS表一个字段可能是来自多个起源表字段 这里-1不限制连线数
        config.maxConnections = -1;
        jsPlumb.addEndpoint(id, {
            anchors: position || 'Left',
            uuid: id + '-Left'
        }, config);

    };

///////////////////////////////////////////////////
    function main() {
        jsPlumb.setContainer('bg');

        // 请求接口血缘json
        // $.get(requestURL, function (res, status) {
        //     if (status === "success") {
        //         jsonData = res;
        //         DataDraw.draw(jsonData)
        //     }
        // }, 'json');

        // 或使用本地数据
        DataDraw.draw(json);
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
                    name: item.name,
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
                    //这里li标签的id应该和 addEndpointOfXXX方法里的保持一致 col-group-item
                    var li = $("<li id='id-col' class='panel-node-list' >col_replace</li>");

                    //修改每个列名所在li标签的id使其独一无二
                    li[0].id = item.name + '.' + col.name
                    //填充列名
                    li[0].innerText = col.name;

                    li.onmouseover=function (){
                        li.css("background-color", "#faebd7");
                    }
                    ul.append(li);
                });
                //根据节点类型找到不同模板各自的 添加端点 方法
                if (that['addEndpointOf' + item.type]) {
                    that['addEndpointOf' + item.type](item)
                }
            });
            //模板渲染好了、锚点也设置好了，最后根据关系连线
            this.finalConnect(json.nodes, json.relations)
        },

        //根据关系连线
        finalConnect: function (nodes, relations) {
            var that = this;
            nodes.forEach(function (node) {
                //RS表要排除，
                if (node.id != 'RS' && node.type != 'RS') {
                    //遍历的每个表的每个列（除了RS表，血缘关系是个有向无环图啦）
                    node.columns.forEach(col => {
                        relations.forEach(relation => {
                            var relName = relation.source.parentName + '.' + relation.source.column;
                            var nodeName = node.name + '.' + col.name;
                            //如果关系中的起始关系等于当前表节点的列，就连接
                            if (relName === nodeName) {
                                //这里sourceUUID、targetUUID应该和addEndpointOfXXX方法里设置的uuid一致
                                //sourceUUID尾端的'-Right'应该和setRSPoint等方法uuid那里设置的一致
                                var sourceUUID = nodeName + '-Right';
                                var targetUUID = relation.target.parentName + '.' + relation.target.column + '-Left';

                                //终于连线了！
                                that.connectEndpoint(sourceUUID, targetUUID);


                                //鼠标移动到连接线上后，两边的列高亮的效果利用jsPlumb事件实现
                                //jsPlumb的事件doc https://github.com/jsplumb/jsplumb/blob/da6688b86fbfba621bf3685e4431a4d9be7213b4/doc/wiki/events.md
                                jsPlumb.unbind('mouseover')
                                jsPlumb.bind("mouseover", function (conn, originalEvent) {
                                    var tar_name = conn.targetId.split(".");
                                    //找到所有需要高亮的列
                                    var activeNodes = that.findActiveNode(relations, tar_name[0], tar_name[1]);
                                    //将所有相关列和线高亮显示
                                    activeNodes.forEach(node=>{
                                        var  targetColumn = node.parentName + '.' + node.column
                                        jsPlumb.selectEndpoints({ source: targetColumn }).each(function (endpoint) {
                                            endpoint.connectorStyle.strokeStyle = 'black'
                                            jsPlumb.repaint(targetColumn);
                                        });
                                        //注意 . 的转义，参考 https://blog.csdn.net/qq_44831907/article/details/120899676
                                        $("#"+node.parentName+"-cols").find("#"+node.parentName+"\\."+node.column).css("background-color", "#faebd7");
                                    });
                                });
                                jsPlumb.unbind('mouseout')
                                jsPlumb.bind("mouseout", function (conn, originalEvent) {
                                    var tar_name = conn.targetId.split(".");
                                    var activeNodes = that.findActiveNode(relations,tar_name[0],tar_name[1])

                                    //将所有相关字段恢复默认显示
                                    activeNodes.forEach(node=>{
                                        var  targetColumn = node.parentName + '.' + node.column
                                        jsPlumb.selectEndpoints({ source: targetColumn }).each(function (endpoint) {
                                            endpoint.connectorStyle.strokeStyle = '#c4c4c4'
                                            jsPlumb.repaint(targetColumn);
                                        });
                                        $("#"+node.parentName+"-cols").find("#"+node.parentName+"\\."+node.column).css("background-color", "#fff");
                                    })
                                });
                            }
                        });
                    });
                }
            })
        },

        findActiveNode: function (relations, parentName, column) {
            return this.findChildNode(relations, parentName, column).concat(this.findParentNode(relations, parentName, column))
        },
        findChildNode: function (relations, parentName, column) {
            var result = [{parentName, column}]
            relations.forEach(relation => {
                if (relation.target.parentName == parentName && relation.target.column == column) {
                    result = result.concat(this.findChildNode(relations, relation.source.parentName, relation.source.column))
                }
            })
            return result
        },
        findParentNode: function (relations, parentName, column) {
            var result = [{parentName, column}]
            relations.forEach(relation => {
                if (relation.source.parentName == parentName && relation.source.column == column) {
                    result = result.concat(this.findParentNode(relations, relation.target.parentName, relation.target.column))
                }
            })
            return result
        },

        addEndpointOfOrigin: function (node) {
            //节点设置可拖拽
            addDraggable(node.id);
            node.columns = Array.from(node.columns);
            node.columns.forEach(function (col) {
                //这里的id应该和draw方法里设置的id保持一致
                setOriginPoint(node.id + '.' + col.name, 'Right')
            })
        },

        addEndpointOfMiddle: function (node) {
            addDraggable(node.id)
            node.columns = Array.from(node.columns);
            node.columns.forEach(function (col) {
                setMiddlePoint(node.id + '.' + col.name, 'Middle')
            })
        },

        addEndpointOfUNION: function (node) {
            addDraggable(node.id)
            node.columns = Array.from(node.columns);
            node.columns.forEach(function (col) {
                setMiddlePoint(node.id + '.' + col.name, 'UNION')
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
            jsPlumb.connect(
                {
                    uuids: [from, to],
                    //StateMachine Bezier Flowchart Straight
                    connector: ['StateMachine']
                });
        },

        getTemplate: function (node) {
            return $('#tpl-' + node.type).html();
        },
    }
})()
