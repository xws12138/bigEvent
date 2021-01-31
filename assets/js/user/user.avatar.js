// 更换头像区域的 js 
$(function() {

    // 拿到 layer 属性
    const { layer } = layui
    // 1.1 获取裁剪区域的 DOM 元素(也就是获取要裁剪的图片)
    var $image = $('#image')

    // 1.2 配置选项
    const options = {
        // 纵横比(长宽比) 这个是用来设置裁剪框的形状 1 就是 1比1 正方形
        aspectRatio: 1,
        // 裁剪事件  这个 crop事件 里面包含了很多 裁剪区的信息，包括位置，裁剪框的大小等等。
        crop: function(event) {
            // 裁剪区的位置坐标
            // console.log(event.detail.x);
            // console.log(event.detail.y);
        },
        // 指定预览区域 哪个div有这个类名 就会成为预览区
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域 cropper()方法 传入 options options是初始裁剪区的配置项，也就是裁剪区的纵横比，指定预览区域等等
    $image.cropper(options)



    // 上面不是我写的
    // 给上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function() {
        // 点击上传按钮时
        // 自动点击文件选择框
        $('#file').click()
    })

    // 为文件选择框绑定 change 事件   change 事件是监听文件框状态改变事件 change：file(选择文件), checkbox(复选框), select(下拉菜单)

    $('#file').on('change', function(e) {
        // 使用文件框监听事件来获取用户选择的文件 files
        var filelist = e.target.files //这个 files 伪数组 0 号就是用户选择的文件
            // filelist 伪数组的 0 号索引可就是用户选择的文件
            // 判断是否获取失败 也就是用户取消了选择，那么选择文件的伪数组的长度就为 0
        if (filelist.length === 0) { //如果伪数组长度为 0 说明没有选择文件
            return layer.msg('请选择照片！') //那就提示
        }
        // 如果没有获取失败，那么就拿新的照片替换原来裁剪区的照片
        var file = e.target.files[0] //伪数组的  0 号索引可就是用户选择的文件

        // 根据选择的文件，创建一个对应的 URL 地址：也就是将文件转换为路径
        // 先调用 URL.createObjectURL() 方法，这个方法可以把图片 转化为路径的形式，再把用户当前选择的照片 file 传过去
        // 返回值 用 image 保存
        var image = URL.createObjectURL(file)

        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        // cropper 方法
          $image .cropper('destroy')   // 销毁旧的裁剪区域 
             .attr('src', image) // 重新设置图片路径 
             .cropper(options)    // 重新初始化一下裁剪区域  重复一下1.3的步骤即可 1.3 创建裁剪区域 .cropper(options)
    })



    // 5. 点击确定， 上传图片到服务器
    $('#save-btn').click(function() {
        // ★5.1获取裁剪后图片的bose64格式 bose64格式(就是纯字符串格式)
        // 用 $image.cropper('getCroppedCanvas').toDataURL('image/png'); 这个方法可以把图片转成 bose64格式 (因为服务器要求我们传这种格式)
        // 如果图片太大接收困难，可以优化,优化方法 getCroppedCanvas 这个方法可以接收参数,修改一下图片的大小并且采用有损压缩的编码方式 jpeg
        const dataUrl = $image.cropper('getCroppedCanvas', {
            // 修改传入图片的大小    优化过后可以传入稍大一些的图片
            width: 100,
            height: 100
        }).toDataURL('image/png,jpeg'); //传入要转的图片(编码方式image/png,jpeg) jpeg：有损压缩
        // ★5.2 手动构建查询参数  new URLSearchParams()
        const search = new URLSearchParams();
        // 传入键值对 键:文档要求名字统一为 avatar 值:是之前获取的 dataUrl bose64格式图片
        search.append('avatar', dataUrl);
        // 5.3发送请求，把 bose64格式字符串提交到服务器
        axios.post('/my/update/avatar', search).then(res => {
            // 5.4判断是否失败
            if (res.status != 0) {
                // 失败提醒
                return layer.msg('上传失败！')
            }
            // 成功提醒
            layer.msg('上传成功！')

            // 5.5 更新首页导航的头像图片    window.parent 可以获取到外层的dom元素对象
            window.parent.getUserInfo() //调用外层容器 传入渲染头像函数 getUserInfo()重新渲染头像

        })
    })















})