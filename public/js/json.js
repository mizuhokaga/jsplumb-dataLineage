// 注意，对于node的id不能是 id.table1 这种带 "."的形式，否则会引起报错。
var json = {
    'relations':[
        {
            'source':{
                "column":"name",
                "parentName":"data2"
            },
            'target':{
                "column":"name",
                "parentName":"middle1"
            }
        },
        {
            'source':{
                "column":"name",
                "parentName":"data1"
            },
            'target':{
                "column":"name",
                "parentName":"middle2"
            }
        },
        {
            'source':{
                "column":"age",
                "parentName":"data1"
            },
            'target':{
                "column":"age",
                "parentName":"middle1"
            }
        },
        {
            'source':{
                "column":"age",
                "parentName":"data2"
            },
            'target':{
                "column":"age",
                "parentName":"middle2"
            }
        },
        {
            'source':{
                "column":"class",
                "parentName":"data1"
            },
            'target':{
                "column":"class",
                "parentName":"middle2"
            }
        },
        {
            'source':{
                "column":"grade",
                "parentName":"data2"
            },
            'target':{
                "column":"grade",
                "parentName":"middle2"
            }
        },
        {
            'source':{
                "column":"age",
                "parentName":"middle1"
            },
            'target':{
                "column":"age",
                "parentName":"middle3"
            }
        },
        {
            'source':{
                "column":"name",
                "parentName":"middle2"
            },
            'target':{
                "column":"name",
                "parentName":"middle3"
            }
        },
        {
            'source':{
                "column":"class",
                "parentName":"middle2"
            },
            'target':{
                "column":"class",
                "parentName":"middle3"
            }
        },
        {
            'source':{
                "column":"grade",
                "parentName":"middle2"
            },
            'target':{
                "column":"grade",
                "parentName":"middle3"
            }
        },
        {
            'source':{
                "column":"name",
                "parentName":"middle3"
            },
            'target':{
                "column":"name",
                "parentName":"RS"
            }
        },
        {
            'source':{
                "column":"age",
                "parentName":"middle3"
            },
            'target':{
                "column":"age",
                "parentName":"RS"
            }
        },
        {
            'source':{
                "column":"grade",
                "parentName":"middle3"
            },
            'target':{
                "column":"grade",
                "parentName":"RS"
            }
        },
        {
            'source':{
                "column":"class",
                "parentName":"middle3"
            },
            'target':{
                "column":"class",
                "parentName":"RS"
            }
        },
    ],
    'nodes': [
        {
            'id': 'data1',
            'name': 'data1',
            'type': 'Origin',
            'columns': [
                {
                    'name': 'age',
                }, {
                    'name': 'name',
                }, {
                    'name': 'class',
                },],
            'top': 155,
            'left': 50
        },
        {
            'id': 'data2',
            'name': 'data2',
            'type': 'Origin',
            'columns': [
                {
                    'name': 'age',
                },
                {
                    'name': 'name',
                },{
                    'name': 'grade',
                } ],
            'top': 255,
            'left': 50
        },
        {
            'id': 'middle1',
            'name': 'middle1',
            'type': 'Middle',
            'columns': [
                {
                    'name': 'age',
                }, {
                    'name': 'name',
                },],
            'top': 139,
            'left': 233
        },
        {
            'id': 'middle2',
            'name': 'middle2',
            'type': 'Middle',
            'columns': [
                {
                    'name': 'age',
                }, {
                    'name': 'name',
                },
                {
                    'name': 'class',
                },
                {
                    'name': 'grade',
                },
            ],
            'top': 309,
            'left': 281
        },
        {
            'id': 'middle3',
            'name': 'middle3',
            'type': 'Middle',
            'columns': [
                {
                    'name': 'age',
                }, {
                    'name': 'name',
                },
                {
                    'name': 'class',
                },
                {
                    'name': 'grade',
                },
            ],
            'top': 222,
            'left': 388
        },
        {
            'id': 'RS',
            'name': 'RS',
            'type': 'RS',
            'columns': [
                {
                    'name': 'age',
                }, {
                    'name': 'name',
                },{
                    'name': 'class',
                },{
                    'name': 'grade',
                },
            ],
            'top': 280,
            'left': 571
        },
    ]
}
