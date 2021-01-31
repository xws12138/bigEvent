$(function() {

    // 拿到 layer 属性
    const { layer } = layui
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比 这个是用来设置裁剪框的形状 1 就是 1比1 正方形
        aspectRatio: 1,
        // 指定预览区域 哪个div有这个类名 就会成为预览区
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)



    // 上面不是我写的
    // 给上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function() {
        // 点击上传按钮时
        // 自动点击文件选择框
        $('#file').click()
    })

    // 为文件选择框绑定 change 事件

    $('#file').on('change', function(e) {
        // 获取用户选择的文件
        var filelist = e.target.files
        console.log(filelist);
        // filelist 伪数组的 0 号索引可就是用户选择的文件
        // 判断是否获取失败
        if (filelist.length === 0) { //如果伪数组长度为 0 说明没有选择文件
            return layer.msg('请选择照片！') //那就提示
        }
        // 如果没有获取失败，那么就拿新的照片替换原来裁剪区的照片
        var file = e.target.files[0] //伪数组的  0 号索引可就是用户选择的文件

        // 根据选择的文件，创建一个对应的 URL 地址：也就是将文件转换为路径
        // 先调用 URL.createObjectURL(file) 方法，把用户当前选择的照片 file 传过去
        // 返回值 用 image 保存
        var image = URL.createObjectURL(file)

        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
          $image .cropper('destroy')   // 销毁旧的裁剪区域 
             .attr('src', image) // 重新设置图片路径 
             .cropper(options)    // 重新初始化裁剪区域
    })


















})