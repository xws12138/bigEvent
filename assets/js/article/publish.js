$(function() {
    // 在全局定义一个变量 state  用于后面获取按钮自定义属性
    let state = ''

    // 提取组件
    const { form } = layui

    // 1,从服务器获取文章分类数据
    getCateList()

    function getCateList() {
        // 1.2发送请求
        axios.get('/my/article/cates').then(res => {
            //1.3 判断是否请求失败
            if (res.status !== 0) {
                return layer.msg('获取失败!')
            }
            //1.4遍历数组 渲染下拉组件的选项

            res.data.forEach(item => {
                // 每遍历一次向下拉选择框中追加一条 option 
                // ${item.Id}  选择框  option 的 value 值 (索引)
                // ${item.name} option 的内容(文章类别)
                $('#cate-sel').append(`<option value="${item.Id}">${item.name}</option>`)
            })


            //坑： 动态创建的表单元素需要手动更新表单
            //插件提供的方法  可以单独指定渲染某一项
            form.render(); //1.更新全部
            //form.render(select) 2.只刷新 select 选择框的渲染
        })

    }

    // ------------------------------------
    // 2.先调用富文本编辑器的初始化方法 渲染出一个富文本编辑器
    initEditor();
    // ------------------------------------

    // 3.先获取要裁剪的图片
    var $image = $('#image')

    // 3.1. 初始化图片裁剪器
    var options = {
        // 裁剪选项
        // 指定纵横比 (宽高)
        aspectRatio: 400 / 280,
        // 指定预览区元素
        preview: '.img-preview',


    }

    // // 3. 初始化裁剪区域
    $image.cropper(options)

    // 3.2 为 '选择封面' 按钮绑定点击事件
    $('#choose-btn').click(function() {
        // 点击 选择封面 按钮时，自动触发文件选择框的点击事件，打开文件选择框
        $('#file').click()
    })

    // 3.3 给文件选择框绑定 change 事件 (状态改变事件)
    $('#file').change(function() {
        // 3.4获取文件列表 files 伪数组，这个伪数组的第0项就是我们需要的文件
        const file = this.files[0]
            // console.log(this.files[0]);

        // 3.5把文件转成 blob 格式的 URL 地址
        const imgUrl = URL.createObjectURL(file)

        // 3.6 替换掉裁剪区的图片
        $image.cropper('replace', imgUrl)

    })


    //4 监听表单的提交事件(点击发布或者存为草稿)

    $('.publish-form').submit(function(e) {
        e.preventDefault();

        // 4.1 new FormData(原生表单元素) 用于获取表单中所有的内容(formdata格式)
        const fd = new FormData(this);
        // formdata 新增方法：oppend() set() get() forEach()

        // 4.2 检测 formdata 中的数据项是否获取成功
        fd.forEach(item => {
            // console.log(item);
        })


        // 4.3 向 fd 中新增 state 数据
        fd.append('state', state) // 'state' 是自定义属性 state 的值

        // 4.4 获取裁剪封面图片的 二进制数据
        $image.cropper('getCroppedCanvas', {
            // 指定裁剪后图片的大小
            width: 400,
            htight: 280
        }).toBlob(blob => {
            // console.log(blob); //二进制图片数据
            //4.5 把获取的图片数据 添加到 formdata 中
            fd.append('cover_img', blob)


            //4.6调用函数 发送请求 提交数据到服务器
            publishArticle(fd)
        })
    })




    // 5.点击发布或者存为草稿，改变 state 状态值
    $('.last-row button').click(function() {
        // 5.1 获取点击的那个按钮的 自定义属性 state 的值
        state = $(this).data('state')
            // console.log(state);
    })


    // 在外层封装好一个发布文章到服务器的函数，参数就是 组装好的 formdata 数据 fd 也就是 =>  const fd = new FormData(this);
    function publishArticle(fd) {

        // 发送请求
        axios.post('/my/article/add', fd).then(res => {
            // console.log(res);
            // 校验失败
            if (res.status !== 0) {
                // 智能提醒，检测当前按钮的自定义属性值，如果值为 已发布，说明用户点击的是 发布文章按钮，那么就提醒发布文章失败，否则提醒存为草稿失败
                return layer.msg(state == '已发布' ? '发布文章失败!' : '存为草稿失败！')
            }
            // 如果成功
            // 智能提醒，检测当前按钮的自定义属性值，如果值为 已发布，说明用户点击的是 发布文章按钮，那么就提醒发布文章成功，否则提醒存为草稿成功
            layer.msg(state == '已发布' ? '发布文章成功!' : '存为草稿成功！')

            // 成功并跳转到文章列表页面

        })
    }









})