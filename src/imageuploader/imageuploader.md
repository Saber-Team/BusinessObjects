# 概要
简单包装Webuploader实现统一样式的图片上传功能。并提供图片预览，图片重新上传，图片删除功能。如果是LOGO上传的话，提供图片尺寸过滤,图片剪裁功能。

# 实现
区分LOGO上传和普通上传，通过创建上传实例的配置参数来实现。

## 普通图片上传



# 参数列表
除(webuploader默认参数)[http://fex.baidu.com/webuploader/doc/index.html#WebUploader_Uploader]之外，还扩展了一下参数：
- `fileNumExist` {int} [可选] [默认值：0] 已经存在的图片数量，图片上传后，再次编辑需要提供。
- `errImgPath` {String} [可选] [默认值：'./uploader-error.png'] 图片上传失败的占位符。
- `logo` {Boolean} [可选] [默认值: false] 是否是LOGO上传，默认情况不是logo上传。


# 事件说明
使用者可以直接监听WebUploader提供的(事件)[http://fex.baidu.com/webuploader/doc/index.html#WebUploader_Uploader_events]。监听方式是：
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
