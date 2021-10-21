var json = {
    'relations':[
        {
            'source':{
                "column":"name",
                "parentName":"data2"
            },
            'target':{
                "column":"name",
                "parentName":"RS"
            }
        },
        {
            'source':{
                "column":"name",
                "parentName":"data1"
            },
            'target':{
                "column":"name",
                "parentName":"RS"
            }
        },
        {
            'source':{
                "column":"age",
                "parentName":"data1"
            },
            'target':{
                "column":"age",
                "parentName":"RS"
            }
        }

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
                },],
            'top': 55,
            'left': 125
        },
        {
            'id': 'data2',
            'name': 'data2',
            'type': 'Origin',
            'columns': [
                {
                    'name': 'name',
                }, ],
            'top': 255,
            'left': 25
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
                },],
            'top': 209,
            'left': 281
        },
    ]
}
