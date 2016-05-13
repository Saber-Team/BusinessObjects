# 概要
简单包装Webuploader实现统一样式的图片上传功能。并提供图片预览，图片重新上传，图片删除功能。如果是LOGO上传的话，提供图片尺寸过滤,图片剪裁功能。
支持全局方式调用或者AMD形式使用.

通过全局方式时,需要保证在加载 `imageuploader`时,已经加载了`jquery` , `WebUploader`, `cropper.js`, `imageviewer.js`.

通过AMD方式加载时, 需要保证已经加载了`jquery` , `WebUploader`. 

# 查看示例
1. 在项目目录下打开终端

2. 切换路径到 `sample/imageuploader` 下.
   
    ```
   cd sample/imageuploader
   ```

3. 执行 

    ```
   python server.py
   ```
   
4. 打开浏览器, 输入 `127.0.0.1:8080/imageuploader.html`, 全局方式使用imageuploaer;
   输入 `http://127.0.0.1:8080/imageuploader-async.html`, 通过AMD方式加载imageuploader

# 使用说明
### 全局方式加载imageuploader
1. 引入静态资源

    ```
        <link rel="stylesheet" href="../../dist/imageuploader/imageuploader.css">
        <link rel="stylesheet" href="../../dist/imageuploader/imageviewer.css">
        <link rel="stylesheet" href="../../dist/imageuploader/cropper.css">
    
        <script src="../../lib/jquery.js"></script>
        <script src="../../dist/imageuploader/webuploader.js"></script>
        <script src="../../dist/imageuploader/cropper.js"></script>
        <script src="../../dist/imageuploader/imageviewer.js"></script>
        <script src="../../dist/imageuploader/imageuploader.js"></script>
    ```
    
2. 在html页面添加上传组件DOM元素

    ```
    <div class="o-webuploader o-webuploader-logo">
        <div id="logo" class="o-filepicker"></div>
    </div>
    ```
    如果是LOGO上传, 则需要添加类`o-webuploader-logo`, 如果不是则不需要添加.
    
    
3. 初始化上传组件

    ```
    var uploader = new ImageUploader({
        server: '/upload',
        fileVal: 'ufile',
        pick: {
            id: '#logo',
            multiple: false
        },
        errImgPath: '../../dist/imageuploader/uploader-error.png',
        logo: true,
        originImage: function (file) {
            // 预览图片时使用,  当后端的数据格式和示例的不一致时使用
            console.log('get origin image url');
            var result = logoUploader.getResponse(true);
            return result[file.id].origin.data.filehash;
        },
        errCallback: function (response) { 
             // 上传错误回调, 返回错误原因
            if (response['error_code'] === 100) {
                return "测试错误情况";
            }
            return response["error_msg"];
        },
        successCallback: function (response) { 
            // 上传成功回调,
            console.log('success callback');
            console.dir(response);
        }
    });
    uploader.init();
    ```
    
4. 初始化已上传的图片
   
   ```
   var images = ['./images/avatar_1.jpg', './images/avatar_1.jpg'];
   uploader.initImages(images);
   ```
   
   或者初始化单个文件
   
   ```
   uploader.initImages('./images/avatar_1.jpg');
   ```
   以上两种方式初始化后图片均可查看, 删除, 重新上传.
   
5. 获取上传结果

   ```
   // 返回上传结果,并且合并已有的图片.
   uploader.getResponse();
   ```
详细请查看 `sample/imageuploader/imageuploader.html`文件
   
### AMD方式加载
1. 加载静态资源
    
    ```
        <link rel="stylesheet" href="../../dist/imageuploader/imageuploader.css">
        <link rel="stylesheet" href="../../dist/imageuploader/imageviewer.css">
        <link rel="stylesheet" href="../../dist/imageuploader/cropper.css">
    
        <script src="../../lib/jquery.js"></script>
        <script src="//cdn.bootcss.com/require.js/2.1.22/require.js"></script>
        <script src="../../dist/imageuploader/webuploader.js"></script>
    ```
2. 在html页面添加上传组件DOM元素

    ```
    <div class="o-webuploader o-webuploader-logo">
        <div id="logo" class="o-filepicker"></div>
    </div>
    ```
    如果是LOGO上传, 则需要添加类`o-webuploader-logo`, 如果不是则不需要添加.
    
    
3. 初始化上传组件

   ```
   require([
           '../../dist/imageuploader/imageuploader'
   ], function (ImageUploader ) {
       var logoUploader = new ImageUploader({
           server: '/upload',
           fileVal: 'ufile',
           pick: {
               id: '#logo',
               multiple: false
           },
           errImgPath: '../../dist/imageuploader/uploader-error.png',
           logo: true,
           logoSize: {  // 保证logo的最小尺寸,
               minWidth: 200,
               minHeight: 100,
               aspectRatio: 2 // 裁切区域长和宽的比率
           },
           originImage: function (file) {
               console.log('get origin image url');
               var result = logoUploader.getResponse(true);
               return result[file.id].origin.data.filehash;
           },
           errCallback: function (file, response) { //上传错误回调, 返回错误原因
               if (response['error_code'] === 100) {
                   return "测试错误情况";
               }
               return response["error_msg"];
           },
           successCallback: function (file, response) { // 上传成功回调,
               console.log('success callback');
               console.dir(response);
           }
       });
   logoUploader.init();
   ```
 后续和全局方式加载的方式一致.

# 参数列表
除[webuploader默认参数](http://fex.baidu.com/webuploader/doc/index.html#WebUploader_Uploader)之外，还扩展了一下参数：

- `fileNumExist` {int} [可选] [默认值：0] 已经存在的图片数量，图片上传后，再次编辑需要提供。

- `errImgPath` {String} [可选] [默认值：'./uploader-error.png'] 图片上传失败的占位符。

- `logo` {Boolean} [可选] [默认值: false] 是否是LOGO上传，默认情况不是logo上传。

- `logoSize` {Object} [可选] [默认最小宽度和高度为200px, 比例为1] 裁切图片时,可选区域的大小已经长宽比例.
  
  ```
  {
      minWidth: 200, 
      minHeight: 200,
      aspectRatio: 1 // 长宽比例值
  }
  ```

- `originImage` {Function} [可选] 用于提供上传图片之后的原图url, 参数 `file`.

- `errCallback` {Function} [可选] 只要设置了该参数,在图片上传之后都会执行, 该回调函数的参数为`file` 和 `response`(后端返回的数据). 
  如果有错误（例如图片尺寸不满足要求）该函数应该返回错误原因, 如果返回值为`false`或者`undefined`则说明图片上传成功且满足要求,则会执行其余的默认操作.
  
- `successCallback` {Function} [可选] 图片上传成功后执行,参数为 `file` 和 `response`, 当然也可以用监听`uploadSuccess`事件的方式,当回调会优先于事件执行.


# 事件说明
使用者可以直接监听WebUploader提供的[事件](http://fex.baidu.com/webuploader/doc/index.html#WebUploader_Uploader_events)。监听方式是：

```
var imageUploader = new ImageUpload(opts);
imageUploader.uploader.on('beforeFileQueued', function(){
    // TODO xxx
}).on('fileQueued', function(){
    // TODO xxx
});
```

当然在封装的组件也会监听这些事件，以便完成一些基本的逻辑。在处理完一下基本逻辑之后，也会触发对应的事件。目前提供的事件有：

1. `beforeFileQueued`;

2. `fileQueued`;

3. `uploadSuccess`;

4. `uploadError`;

5. `error`;

外部监听方式类似上述所说：

```
var imageUploader = new ImageUpload(opts);
// 注意这次监听的是 ImageUploader触发的事件，而不是WebUploader触发的。
imageUploader.on('beforeFileQueued', function(){
    // TODO xxx
}).on('fileQueued', function(){
    // TODO xxx
});
```

# API介绍

1. getResponse

   getResponse(origin) => obj || array
   
   获得上传图片的结果, 如果参数`origin`为true, 返回未处理过的数据, 类型为Object, 否则返回新上传图片的结果和已经存在图片（图片url）
