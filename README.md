# 基于jsPlumb的、模仿sqlFlow前端的数据血缘前端展示页面

## 需求：
后端给定sql的数据血缘json信息，**前端需要实现类似sqlFlow的表和列的连线展示数据血缘关系**。
![](./imgs/sqlflow.png)
上图是sqlflow的示例图
****
## 展示：
![](./imgs/myflow.png)
****
## 如何使用：
在浏览器中打开index.html即可。

本项目只实现了根据json渲染图表的功能，其他功能如删除表和连线由于业务不需要没有编写或保留。
***
## 碎碎念
参考 https://github.com/wangduanduan/visual-ivr 这个项目改写的！

由于本人写前端时间不多并且有些代码写法是根据业务来写的，一些奇怪的写法不要在意！

使用的 jsPlumb.js 版本是 1.7.6

其中：
- config.js :放置jsPlumb.js全局配置信息
- json.js :放置案例json数据
- index.js :完成渲染绘制的核心js

