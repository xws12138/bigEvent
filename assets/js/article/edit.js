$(function() {
    // 在全局定义一个变量 state  用于后面获取按钮自定义属性
    let state = ''

    // 提取组件
    const { form } = layui

    // 接收列表页传来的查询参数
    // console.log(location.search); // ?id=1729当前编辑按钮所对应的文章id的键值对字符串地址
    // 获取查询参数中的 id 值
    // 1.字符串截取
    const arr = location.search.slice(1).split('=') //从索引1(从i开始)的位置开始截取得到的是 id=1729 再对 id=1729 进行等号分割 得到数组 [id,1729]
    console.log(arr[1]); //取出数组的 索引2 也就是后面的数字 1729 (这个1729是编辑文章的文章索引，不是固定的，这里举例)
    const id = arr[1] //取出数组的 索引2 也就是后面的数字 赋值给  id

    // 发送请求到服务器，获取当前这条 id 的文章详情
    function getArtDetail(id) { //接收参数
        // 发送请求 把文章的自定义 id 传过去，告诉服务器我们要这个id对应的文章
        axios.get(`/my/article/${id}`).then(res => {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取失败!')
            }


            // 给 form 表单赋值数据   用 layui 提供的 form.val()方法，可以给整个 form  表单赋值
            //要赋值的表单必须有  lay-filter="" 属性 名称自己取 edit-form ==>  lay-filter="edit-form"要赋的值为 服务器返回的 res 的 data对象
            form.val('edit-form', res.data) //data对象里面就是要请求的文章的内容(标题，类别，内容，封面) 会依次填入相应的位置

            //给form 表单赋值完成后 调用富文本编辑器的初始化方法 渲染出一个富文本编辑器(连同该文章的内容一起渲染出来) 这样就可以获取到该文章的内容
            initEditor();

            // 替换裁剪区的封面图片  根路径 拼上 图片的 地址res.data.cover_img
            $image.cropper('replace', 'http://api-breakingnews-web.itheima.net' + res.data.cover_img)
        })
    }
    getArtDetail(id) //调用函数，传入 id 这个 id 也就是 取出arr数组的 索引2 后面的数字

    // -----------------------------------------------------
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
            // form.render(); //1.更新全部
            form.render('select') //2. 只刷新 select 选择框的渲染

            // 1.6 在获取分类列表成功后，再去调用获取文章详情的函数
            getArtDetail(id)
        })

    }

    // ------------------------------------

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

        // 4.1 获取裁剪封面图片的 二进制数据
        $image.cropper('getCroppedCanvas', {
            // 指定裁剪后图片的大小
            width: 400,
            htight: 280
        }).toBlob(blob => { //toBlo方法 获取二进制图片数据
            // console.log(blob); //二进制图片数据

            // 坑 获取富文本编辑器中最新内容的操作，要放在异步回调函数中(也就是不一开始就获取，而是放在toBlob箭头函数中,变成函数执行是获取)，否则拿不到最新的内容
            // 4.2 new FormData(原生表单元素) 用于获取表单中所有的内容(formdata格式)
            const fd = new FormData(this);
            // formdata 新增方法：oppend() set() get() forEach()

            // 4.3 检测 formdata 中的数据项是否获取成功
            fd.forEach(item => {
                // console.log(item);
            })


            // 4.4 向 fd 中新增 state 数据
            fd.append('state', state) // 'state' 是自定义属性 state 的值


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
        // 发送请求之前 向 formdata 数据中添加一条 id 数据(接口要求的)为了发送编辑(修改了内容)后，对应id的文章列表会随之修改
        fd.append('Id', id) //为了告诉服务器，我们要修改的是那一条数据

        // 发送请求
        axios.post('/my/article/edit', fd).then(res => {
            // console.log(res);
            // 校验失败
            if (res.status !== 0) {
                // 智能提醒，检测当前按钮的自定义属性值，如果值为 已发布，说明用户点击的是 发布文章按钮，那么就提醒发布文章失败，否则提醒存为草稿失败
                return layer.msg(state == '已发布' ? '编辑文章失败!' : '存为草稿失败！')
            }
            // 如果成功
            // 智能提醒，检测当前按钮的自定义属性值，如果值为 已发布，说明用户点击的是 发布文章按钮，那么就提醒发布文章成功，否则提醒存为草稿成功
            layer.msg(state == '已发布' ? '编辑文章成功!' : '存为草稿成功！')

            // 发表或者存为草稿成功并跳转到文章列表页面
            location.href = './list.html'


            // 点击发布或者存为草稿的时候
            // 同时左边的高亮绿色导航条要同时进行更新
            // 外部元素的 layui-this(发表文章按钮) 的相邻的前一个元素 prev()(也就是文章列表) 里面的 a 链接自动触发点击事件(利用这个方式使其高亮)
            window.parent.$('.layui-this').prev().find('a').click()
        })
    }









})