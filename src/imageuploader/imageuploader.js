/**
 * @fileoverview 简单封装webuploader,使用之前保证已经加载了webuploader.js
 * @email xiongchengbin@baidu.com
 */


(function( global, factory ) {

    if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = factory( global, true );
    }
    else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(['./cropper', './imageviewer'], function() { return factory( global, true ); });
    }
    else {
        factory( global );
    }
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

    var $ = jQuery,
        defaultOpts = {
            swf: '/dist/imageuploader/uploader.swf',
            auto: true,
            resize: false,
            //runtimeOrder: 'flash,html5',
            fileVal: 'ufile',
            fileNumLimit: 5,
            count: 0,
            fileSingleSizeLimit: 10 * 1024 * 1024,
            accept: {
                title: 'Images',
                extensions: 'jpg,jpeg,png,gif',
                mimeTypes: 'image/*'
            },
            thumb: {
                width: 120,
                height: 90,
                type: 'image/jpeg'
            },
            logoSize: { // 图片裁切的最小尺寸 和 长宽比例
                minWidth: 200,
                minHeight: 200,
                aspectRatio: 1
            },
            duplicate: true,
            errImgPath: './uploader-error.png',
            formData: {}
        };


    /**
     * LOGO裁切弹窗的类包装
     * @constructor LOGO裁切弹窗的构造函数
     */
    function ImageCropper (opts) {
        if (opts.minWidth / opts.minHeight > opts.aspectRatio) {
            opts.minWidth = opts.minHeight * opts.aspectRatio;
        }
        if (opts.minWidth / opts.minHeight < opts.aspectRatio) {
            opts.minHeight = opts.minWidth / opts.aspectRatio;
        }
        this.opts = opts;
        this.init();
    }

    $.extend(ImageCropper.prototype, {
        init: function (src) {
            var that = this;
            if (!this.instance) {
                var tpl = [
                    '<div class="o-imagepopup">',
                        '<div class="popup-container">',
                            '<div class="popup-title">图片上传 <span class="popup-close cancel"></span></div>',
                            '<div class="popup-body">',
                                '<img class="popup-img">',
                            '</div>',
                            '<div class="popup-footer">',
                                '<button class="btn-blue btn-38 btn-upload">确认</button>',
                                '<button class="btn-gray btn-38 btn-cancel cancel">取消</button>',
                            '</div>',
                        '</div>',
                    '</div>'
                ].join('');
                this.$popup = $(tpl).appendTo(document.body);
                this.$image = this.$popup.find('img');
                this.$image.cropper({
                    aspectRatio: that.opts.aspectRatio,
                    minHeight: that.opts.minHeight,
                    minWidth: that.opts.minWidth,
                    done: function (data) {
                        //console.log(data);
                    }
                });
                this.bind();
            }
            src && this.setSrc(src);
            return this;
        },
        setSrc: function (src) {
            this.$image.cropper('setImgSrc', src);
            return this;
        },
        getImageSize: function () {
            var img = this.$image.get(0);
            return {
                width: img.naturalWidth,
                height: img.naturalHeight
            }
        },
        setCallback: function (confirm, cancel) {
            var noop = function () {};
            this.callback = {
                confirm: typeof confirm === 'function' ? confirm : noop,
                cancel: typeof cancel === 'function' ? cancel : noop
            };
            return this;
        },
        bind: function () {
            var that = this;
            var $popup = this.$popup;
            $popup.on('click', '.cancel', function (e) {
                that.callback.cancel();
                $popup.hide();
            });
            $popup.on('click', '.btn-upload', function (e) {
                that.callback.confirm(that.$image.cropper("getData"));
                $popup.hide();
            });
            that.$image.on('ready.cropper', function (e) {
                $popup.css('visibility', 'visible'); // cropper ready时 触发该事件 此时图片已经渲染完成,显示弹窗
            }).on('ready.duplicate', function (e) {
                setTimeout(function () {
                    that.show();
                }, 0);
            });
        },
        show: function (isHidden) {
            var that = this;
            isHidden ? that.$popup.css({'visibility': 'hidden', 'display': 'block'}) :
                that.$popup.css({'visibility': 'visible', 'display': 'block'}); // 防止渲染图片 弹窗抖动
            return this;
        },
        hide: function () {
            this.$popup.hide();
            return this;
        }
    });

    function ImageUploader(opts) {
        if (opts.logo) {
            this.opts = $.extend(true, {}, defaultOpts, opts, {
                fileNumLimit: 1,
                pick: {
                    multiple: false
                },
                compress: false,
                chunked: false,
                auto: false,
                thumb: {
                    width: 1,
                    height: 1
                }
            });
        }
        else {
            this.opts = $.extend(true, {}, defaultOpts, opts);
        }

        //记录绑定webuploader的按钮
        this.ele = $(opts.pick && opts.pick.id || opts.pick);
        // 记录图片上传之后，服务器的返回值，
        this.response = {};

        //上传文件的WebUploader实例,支持多选
        this.uploader = '';
        //this.init();
    }

    $.extend(ImageUploader.prototype, {
        init: function () {
            if (this.uploader) {
                return this;
            }
            if (this.opts.logo) { //logo 上传, 只支持单个文件.
                //$.extend(true, this.opts, );
                this.registerCrop();
                this.imageCropper = new ImageCropper(this.opts.logoSize);
            }
            this.uploader = new WebUploader.Uploader(this.opts);
            //fix 查看态变为编辑态 总数达到限额,则不显示新增图片上传按钮
            //this.trigger('toggleUploaderBtn');
            //注册Webuploader提供的中介者，使ImageUploader具备事件行为，降低耦合度。
            WebUploader.Mediator.installTo(ImageUploader.prototype);
            this.bindUploadEvents();
        },
        initImage: function (image, noTrigger) {
            if (!image) {
                return;
            }
            // imageId作为已有图片的ID, 为了防止重复,使用初始化的时间作为ID;
            !this.imageId && (this.imageId = new Date().getTime());
            var $item = $('<div id="init' + (this.imageId++) + '" class="o-thumb o-upload-success"> <img> </div>');
            var $img = $item.children('img');
            var idx = this.addImageData(image);
            $img.attr('src', image);
            this.render($item);
            this.bindThumbEvents($item, idx);
            !noTrigger && this.trigger('toggleUploader');
        },
        initImages: function (images) {
            if (!Array.isArray(images)) {
                return;
            }
            var len = images.length;
            if (len > this.opts.fileNumLimit || this.opts.count >= this.opts.fileNumLimit) {
                this.showError('初始化的图片不能大于设置最大上传图片数t: ' + this.opts.fileNumLimit);
                return ;
            }
            this.init();
            for(var i = 0; i < len; i++) {
                this.initImage(images[i], true);
            }
            this.trigger('toggleUploader')
        },

        registerCrop: function () {
            if (WebUploader.Uploader.regCropImage) {
                //this.trigger('register.crop.duplicate');
                return this;
            }
            //this.trigger('register.crop.image');
            WebUploader.Uploader.regCropImage = true;
            WebUploader.Uploader.register({
                'before-send-file': 'cropImage'
            }, {
                cropImage: function (file) {
                    if (!this.options.logo) {
                        return;
                    }

                    var data = file._cropData,
                        image, deferred;

                    file = this.request('get-file', file);
                    deferred = WebUploader.Deferred();

                    image = new WebUploader.Lib.Image();

                    deferred.always(function () {
                        image.destroy();
                        image = null;
                    });
                    image.once('error', deferred.reject);
                    image.once('load', function () {
                        image.crop(data.x, data.y, data.width, data.height, data.scale);
                    });

                    image.once('complete', function () {
                        var blob, size;

                        // 展示缩略图
                        var $item = file._uploaderData.target;
                        var ctx = file._uploaderData.ctx;
                        var isReupload = file._uploaderData.isReupload;
                        $item.children('img').attr('src', image.getAsDataUrl(ctx.opts.thumb.type));
                        !isReupload && ctx.render($item);
                        !isReupload && ctx.trigger('toggleUploader');
                        ctx.bindThumbEvents($item, file, isReupload);
                        ctx.trigger('makethumb.end', file, $item);

                        try {
                            blob = image.getAsBlob();
                            size = file.size;
                            file.source = blob;
                            file.size = blob.size;

                            file.trigger('resize', blob.size, size);

                            deferred.resolve();
                        } catch (e) {
                            console.log(e);
                            // 出错了直接继续，让其上传原始图片
                            deferred.resolve();
                        }
                    });

                    file._info && image.info(file._info);
                    file._meta && image.meta(file._meta);
                    image.loadFromBlob(file.source);
                    return deferred.promise();
                }
            });
        },

        render: function ($item) {
            /**
             * @param $item {Selector}: 需要添加元素的dom选择器
             *         isNew {boolean}: 是否是完成新增,还是部分,主要针对的场景是, 图片由查看状态变为编辑状态
             * @type {string}
             */
            var tpl = [
                '<div class="o-mask">',
                '<div class="progress-text">等待上传</div>',
                '<div class="progress-bar"></div>',
                '</div>',
                '<div class="o-rm-thumb"></div>',
                '<div class="o-edit-thumb">',
                '<div class="view"></div>',
                '<div class="re-upload"></div>',
                '</div>'
            ].join('');

            $item.append(tpl);
            $item.insertBefore($(this.ele));
        },

        makeThumb: function (file) {
            var that = this,
                $refer = file.source._refer,
                isReupload = $refer.hasClass('re-upload'),
                $item,
                $img;
            //调用WebUploader的makeThumb函数,  逻辑判断都在回调函数中进行
            that.trigger('makethumb.start', file);
            if (isReupload) {
                $item = $refer.parents('.o-thumb');
                $item.attr('id', file.id).find('.o-mask .progress-bar').width(0);
            }
            else {
                $item = $('<div id="' + file.id + '" class="o-thumb"> <img> </div>');
            }
            $img = $item.children('img');
            that.uploader.makeThumb(file, function (err, src) {
                if (err) {
                    $img.replaceWith('<div class="no-preview">不能预览</div>');
                    return;
                }

                if (that.opts.logo) { // logo upload
                    if (!that.validateLogoSize(file._info)) {
                        that.removeQueueFile(file);
                        return false;
                    }
                    that.imageCropper.init(src);
                    that.imageCropper.setCallback(function (data) {
                        isReupload && $item.removeClass('o-upload-success o-upload-fail');
                        file._cropData = {
                            x: data.x1,
                            y: data.y1,
                            width: data.width,
                            height: data.height,
                            scale: that.imageCropper.getImageSize().width / file._info.width
                        };

                        file._uploaderData = {
                            ctx: that,
                            isReupload: isReupload,
                            target: $item
                        };
                        that.uploader.upload(file);
                    }, function () {
                        that.restoreQueueFile();
                        that.removeQueueFile(file);
                    });
                    that.imageCropper.show(true);
                }
                else {
                    isReupload ? $item.removeClass('o-upload-success o-upload-fail') : that.render($item);
                    $img.attr('src', src);
                    that.trigger('toggleUploader');
                    that.bindThumbEvents($item, file, isReupload);
                    that.trigger('makethumb.end', file, $item);
                }
            });
        },

        bindThumbEvents: function ($item, file, isReUpload) {
            var that = this;
            //删除事件
            $item.children('.o-rm-thumb').off().on('click', function (e) {
                $item.remove();
                that.removeQueueFile(file, true);
                that.trigger('toggleUploader', true);
            });
            //重新上传事件
            if (that.isFlash()) {
                $item.find('.re-upload').off().on('mouseup', function (e) {
                    console.log('re-upload');
                });
            }
            else {
                $item.find('.re-upload').off().on('click', function (e) {
                    // fix上传按钮点击事件被触发两次, 一次label 一次 input
                    e.target.tagName === 'INPUT' && that.removeQueueFile(file);
                });
            }

            that.bindThumbViewEvent($item, file);

            !isReUpload && that.uploader.addButton({
                id: $item.find('.re-upload'),
                multiple: false
            });
        },
        bindThumbViewEvent: function ($item, file) {
            var that = this;
            //查看大图
            $item.find('.view').off().on('click', function (e) {
                var $img = $(this).parents('.o-thumb').children('img');
                var originUrl = (file && typeof file === 'object') ?
                    that.getOriginImageUrl(file) :
                $img.data('origin') || $img.attr('src');
                window.ImageViewer.open(originUrl);
            });
        },
        switchToEditor: function ($item) {
            var that = this;
            if (that.duplicateSwitch) {
                $item.removeClass('o-thumb-viewer').addClass('o-upload-success');
            }
            else {
                var data = [];
                that.init();
                $item.each(function (idx, ele) {
                    var $ele = $(ele);
                    data.push($ele.children('img').attr('src'));
                    $ele.removeClass('o-thumb-viewer').addClass('o-upload-success');
                    that.bindThumbEvents($ele, idx, $ele.find('.webuploader-container').length);
                });
                if (that.existData && that.existData.length) {
                    that.existData = that.existData.concat(data);
                    that.opts.count += data.length;
                }
                else {
                    that.existData = data;
                    that.opts.count = data.length;
                }
            }
            that.trigger('toggleUploader');
        },
        switchToViewer: function ($item) {
            $item.removeClass('o-upload-success').addClass('o-thumb-viewer');
            this.duplicateSwitch = true; //防止重复切换编辑 查看状态
            this.hideUploader();
        },
        bindUploadEvents: function () {
            var that = this;
            var max = that.opts.fileNumLimit;
            var flag = true;

            //文件加入队列前,判断文件总是是否超过限制,超过则不加入队列
            that.uploader.on('beforeFileQueued', function (file) {
                var count = that.opts.count;
                if (count >= max && flag) {
                    flag = false;
                    that.uploader.trigger('error', 'Q_EXCEED_NUM_LIMIT', max, file);
                    setTimeout(function () {
                        flag = true;
                    }, 1);
                }
                that.trigger('beforeFileQueued', file);
                return count < max;
            });

            //文件加入队列,生成缩略图,
            that.uploader.on('fileQueued', function (file) {
                that.opts.count++;
                file.setStatus('queued'); //文件被加入queue时, webuploader没有触发入队列相关事件,手动设置一下.
                that.makeThumb(file);
                that.trigger('fileQueued', file);
            });
            that.uploader.on('fileDequeued', function () {
                that.opts.count--;
                that.trigger('fileDequeued');
            });
            //上传进行中,显示相关的进度
            that.uploader.on('uploadProgress', function (file, percentage) {
                var $item = $('#' + file.id),
                    $text = $item.find('.o-mask .progress-text'),
                    $bar = $item.find('.o-mask .progress-bar');

                $text.text(percentage * 100 + '%');
                $bar.css('width', percentage * 100 + '%');
                that.trigger('uploadProgress', file, percentage);
            });

            //文件上传成功,显示相关的样式,并将服务器返回给的数据保存到 response中,
            that.uploader.on('uploadSuccess', function (file, response) {
                var $item = $('#' + file.id);
                var reason = '';

                if (typeof that.opts.errCallback === 'function' && (reason = that.opts.errCallback(file, response))) {
                    that.uploader.trigger('uploadError', file, reason);
                    return ;
                }

                (typeof that.opts.successCallback === 'function') && that.opts.successCallback(file, response);

                $item.addClass('o-upload-done').find('.progress-text').text('');

                setTimeout(function () {
                    $item.addClass('o-upload-success').removeClass('o-upload-done');
                }, 1000);

                //保存数据
                that.response[file.id] = {origin: response, status: 'complete'};

                /*

                if (response.data && response.data.filehash) {

                    $item.addClass('o-upload-done').find('.progress-text').text('');

                    setTimeout(function () {
                        $item.addClass('o-upload-success').removeClass('o-upload-done');
                    }, 1000);

                    //保存数据
                    that.response[file.id] = {origin: response, status: 'complete'};
                }
                else {
                    if (typeof that.opts.errCallback === 'function') {
                        that.uploader.trigger('uploadError', file, that.opts.errCallback(response));
                    }
                    else {
                        that.uploader.trigger('uploadError', file, "未知错误");
                    }
                }
                */
                that.trigger('uploadSuccess', file, response);
            });

            that.uploader.on('uploadError', function (file, reason) {
                var $item = $('#' + file.id);
                that.showError('文件上传错误: ' + reason);
                $item.addClass('o-upload-fail')
                    .children('img').attr('src', that.opts.errImgPath);
                that.uploader.refresh(); //重新计算 上传按钮 的尺寸
                that.trigger('uploadError', file, reason);
            });

            //文件上传相关的错误,
            that.uploader.on('error', function (type) {
                switch (type) {
                    case 'Q_EXCEED_NUM_LIMIT':
                    {
                        that.showError('选择的图片过多，超出部分自动忽略');
                        break;
                    }

                    case 'Q_EXCEED_SIZE_LIMIT':
                    {
                        that.showError('选择的图片尺寸过大，自动忽略');
                        break;
                    }

                    case 'Q_TYPE_DENIED':
                    {
                        that.showError('选择的文件格式不符合要求，请确认后选择');
                        break;
                    }

                    case 'Q_FILE_SIZE_WRONG':
                    {
                        that.showError('图片尺寸不符合要求，请重新选择');
                        break;
                    }

                    case 'Q_LOGO_SIZE_WRONG':
                    {
                        that.showError('上传LOGO尺寸长宽均不能小于200px，请确认后重试');
                        break;
                    }
                }
                that.trigger('error', type);
            });

            //所有图片都上传完成
            that.uploader.on('uploadFinished', function () {
                //that.tempRemove = {}; //上传之后将其初始化为空
                that.trigger('uploadFinished');
            });

            //隐藏或者显示新增按钮
            that.on('toggleUploader', function (show, hide) {
                if (show) {
                    that.showUploader();
                }
                else if (hide) {
                    that.hideUploader();
                }
                else {
                    //var stats = that.uploader.getStats();
                    //var count = stats.successNum + stats.uploadFailNum + stats.queueNum + stats.progressNum
                    //  - stats.cancelNum - stats.invalidNum;
                    var count = that.opts.count;
                    count >= that.opts.fileNumLimit ? that.hideUploader() : that.showUploader();
                }
            });
        },

        removeQueueFile: function (file, rmLast) {
            if (this.response[file.id] && this.response[file.id].status === 'complete') {
                this.response[file.id].status = 'delete';
                this.response.lastRemove = this.response[file.id];
            }
            rmLast && (this.response.lastRemove = null);
            // 判断是否是初始化已经存在的图片, 已经存在的图片 file 为已经存在图片数组的下标
            if (typeof file === 'object') {
                this.uploader.removeFile(file);
            }
            else {
                this.response.lastRemove = this.existData[file];
                this.existData.splice(file, 1);
                this.opts.count--;
            }
        },
        addImageData: function (src) {
            // 添加已有图片, 同时返回添加图片的下标
            !this.existData && (this.existData = []);
            var len = this.existData.length;
            this.existData[len] = src;
            // 已有图片的数量
            this.opts.count += 1;
            return len;
        },
        restoreQueueFile: function () {
            if (!this.response.lastRemove) {
                return ;
            }
            if (typeof this.response.lastRemove === 'string') {
                this.existData.push(this.response.lastRemove);
                this.opts.count++;
            }
            else if (typeof this.response.lastRemove === 'object') {
                this.response.lastRemove.status = 'complete';
                this.opts.count++;
            }
        },

        validateLogoSize: function (info) {
            if (info.width < 200 || info.height < 200) {
                this.uploader.trigger('error', 'Q_LOGO_SIZE_WRONG');
                return false;
            }
            return true;
        },

        showError: function (text) {
            var $err = this.errorContainer || (this.errorContainer = $('<div class="o-error"></div>').appendTo(document.body));

            $err.text(text).show();

            setTimeout(function () {
                $err.hide();
            }, 2 * 1000);
        },

        option: function (key, value) {
            if (!key) {
                return this.opts;
            }
            if (value) {
                this.opts[key] = value;
            }
            else {
                return this.opts[key];
            }
        },

        showUploader: function () {
            var that = this;
            if (that.isFlash() && that.isIE(9)) {
                this.ele.css({
                    'position': 'relative',
                    'left': 'auto'
                }).show();
            }
            else {
                this.ele.show();
            }
        },

        hideUploader: function () {
            var that = this;
            if (that.isFlash() && that.isIE(9)) {
                this.ele.css({
                    'position': 'absolute',
                    'left': '2000px'
                }).show();
            }
            else {
                this.ele.hide();
            }
        },

        isIE: function (version) {
            return WebUploader.browser.ie === version;
        },

        isFlash: (function () {
            var result = '';
            return function () {
                if (result !== '') {
                    return result;
                }
                return (result = $('.o-webuploader').find('object').length);
            };
        })(),

        getResponse: function (origin) {
            var that = this,
                res = [];

            if (origin) {
                return that.response;
            }

            $.each(that.response, function (idx, ele) {
                if (ele && ele.status === 'complete') {
                    res.push(ele.origin);
                }
            });

            //获取现有的数据
            $.each(that.existData||[], function (idx, ele) {
                res.push(ele);
             });
            return res;
        },
        getOriginImageUrl: function (file) {
            if (!file) {
                throw new Error('参数file不能为空');
            }
            if (typeof  this.opts.originImage === 'function') {
                return this.opts.originImage(file);
            }
            else if (this.response[file.id].origin.data && this.response[file.id].origin.data.filehash) {
                return this.response[file.id].origin.data.filehash;
            }
            else {
                throw new Error('未找到原图的url,请提供originImage参数');
            }
        }
    });

    if (!noGlobal) {
        window.ImageUploader = ImageUploader;
    }

    return ImageUploader;
}));
