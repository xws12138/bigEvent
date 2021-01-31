$(function() {

    const { form } = layui
    // 定义弹出层的 id (编号) 全局变量 index
    let index

    //1.定义一个函数，从服务器获取文章列表数据，并渲染到页面
    // 页面一加载就先调用一次函数来渲染页面
    getCateList()

    function getCateList() {
        // 1.1发送请求
        axios.get('/my/article/cates').then(res => {
            // 1.2判断请求失败
            if (res.status !== 0) {
                return layer.msg('获取分类列表失败！')
            }

            // 1.4 请求成功 
            // ★使用模板引擎来渲染我们的页面 1.引入插件 2. 准备一个模板 3.调用一个模板函数 teplate 传入 (id,数据对象) 这个函数会帮我们拼接好内容数据
            const htmlStr = template('tpl', res)

            // 1.5把拼接好的 html 字符串渲染到 tbody 表格主体中
            $('tbody').html(htmlStr)
        })
    }

    // -------------------------------------------------------------------------------------------------------------------------

    // 2.点击添加按钮，添加一个文章分类
    $('.add-btn').click(function() {
        // 使用 layui 里面的弹出层来制作模态框 并把这个弹出层赋值给全局变量 index 后面关闭弹出层要用
        index = layer.open({
            //层类型
            type: 1,
            // 标题
            title: '添加文章分类',
            // 内容 这个弹框里面的内容是名为 .add-form-container 的表单结构
            content: $('.add-form-container').html(), //html()表示把所有的 html 标签结构添加进去 text()表示纯文本内容
            // 宽高 也就是模态框的大小
            area: ['500px', '250px']
        })
    })

    // -------------------------------------------------------------------------------------------------------------------------

    // 3.监听添加模态框里的添加表单的提交事件 
    // 注意： 这个表单是我们点击 "添加类别" 之后才添加的，所以不能直接绑定事件，要用事件委托
    $(document).on('submit', '.add-form', function(e) {
        e.preventDefault()

        // 3.1发送请求，把表单的数据提交到服务器中
        axios.post('/my/article/addcates', $(this).serialize()).then(res => {
            // 3.2判断失败
            if (res.status !== 0) {
                return layer.msg('提交失败!')
            }
            layer.msg('提交成功！！！');

            // 3.3 提交成功，关闭弹出层 插件自带的关闭弹出层方法  layer.close(); index为全局变量，里面是整个弹出层
            layer.close(index);

            //3.4 提交成功，重新渲染一下页面 更新外层的分类表格数据
            getCateList();

        })
    })

    // -------------------------------------------------------------------------------------------------------------------------

    // 4.点击编辑按钮，弹出编辑的模态框
    $(document).on('click', '.edit-btn', function() {
        // 4.1 点击编辑按钮后 显示弹出层
        // 使用 layui 里面的弹出层来制作模态框 并把这个弹出层赋值给全局变量 index 后面关闭弹出层要用
        index = layer.open({
            //层类型
            type: 1,
            // 标题
            title: '修改文章分类',
            // 内容 这个弹框里面的内容是名为 .add-form-container 的表单结构
            content: $('.edit-form-container').html(), //html()表示把所有的 html 标签结构添加进去 text()表示纯文本内容
            // 宽高 也就是模态框的大小
            area: ['500px', '250px']
        })



        // 4.2，获取自定义属性的值， 以data 开头的
        const id = $(this).data('id')

        // 4.3 发送请求，获取当前的分类数据 也就是当前id的编辑按钮所对应的内容(分类名称，分类别名)
        axios.get(`/my/article/cates/${id}`).then(res => {

            if (res.status !== 0) {
                return layer.msg('获取失败!')
            }

            //4.4把数据渲染到修改输入框中
            // 这个方法可以获取  有这个 lay-filter="edit-form" 名称的表单里的内容 (edit-form是自己取的名字)
            form.val('edit-form', res.data)



        })

    })

    // ------------------------------------------------------------------------------------------------------------------、

    // 5 发送请求到服务器，提交修改表单的数据
    $(document).on('submit', '.edit-form', function(e) {
        e.preventDefault()

        // 5.1发送请求，把表单的数据提交到服务器中
        axios.post('/my/article/updatecate', $(this).serialize()).then(res => {
            // console.log(res);
            // 5.2判断失败
            if (res.status !== 0) {
                return layer.msg('修改失败!')
            }

            //5.3 修改成功提示
            layer.msg('修改成功！！！');

            //5.4 提交成功，关闭弹出层 插件自带的关闭弹出层方法  layer.close(); index为全局变量，里面是整个弹出层
            layer.close(index);

            //5.5 提交成功，重新渲染一下页面 更新外层的分类表格数据
            getCateList();

        })
    })

    // ------------------------------------------------------------------------------------------------------------------、
    // 6 删除按钮
    // 6.1 点击删除,弹出删除模态框
    $(document).on('click', '.delete-btn', function(e) {
        // 6.2，获取自定义属性的值， 以data 开头的
        const id = $(this).data('id');
        layer.open({
            title: '提示',
            content: $('.delete-form-container').html(), //html()表示把所有的 html 标签结构添加进去 text()表示纯文本内容
            btn: ['确定', '取消'],
            // 按钮1 的回调函数 也就是点击了 按钮1(确定) 之后会触发的函数
            yes: function(index, layero) {
                // console.log(index);
                // console.log(layero);
                // 6.3 发送请求，获取当前的分类数据 也就是当前id的编辑按钮所对应的内容(分类名称，分类别名)
                axios.get(`/my/article/deletecate/${id}`).then(res => {
                    console.log(res);
                    // 6.4删除失败
                    if (res.status !== 0) {
                        return layer.msg('删除失败!')
                    }

                    //6.5 删除成功提示
                    layer.msg('删除成功！！！');

                    //6.6 删除成功，关闭弹出层 插件自带的关闭弹出层方法  layer.close(); index为全局变量，里面是整个弹出层
                    layer.close(index);

                    //6.7 删除成功，重新渲染一下页面 更新外层的分类表格数据
                    getCateList();

                })
            }
        });



    })








})