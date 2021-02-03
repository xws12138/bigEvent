$(function() {
    // 提取组件
    const { form, laypage } = layui

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



    // 2.定义一个查询对象
    const query = {
        pagenum: 1, //表示当前的页码值，第几页
        pagesize: 2, //表示每页显示的数据条数
        cate_id: '', //文章分类的 Id
        pub_date: '', //文章发表的时间  
        state: '' //文章的状态，可选值有：已发布、草稿
    }




    // 3.先调用一次函数
    renderTable();
    // 3.定义一个函数  renderTable 用于发送请求到服务器，获取文章列表数据
    function renderTable() {

        // 3.1 发送请求
        axios.get('/my/article/list', { params: query }).then(res => {
            if (res.status !== 0) {
                return layer.msg('获取失败!')
            }

            // 调用模板函数之前去注册过滤器

            var time = query.pub_date

            // 注册一个过滤器
            // 先去注册过滤器(也就是一个函数方法) 固定写法
            template.defaults.imports.dateFormat = function(date) {
                // 返回插件 对  pub_date  里面的时间的格式进行优化处理，然后返回，在模板里使用 | 调用即可
                return moment(date).format('YYYY/MM/DD HH:mm:ss')
            }

            // 3.2使用模板引擎来渲染
            const htmlStr = template('tpl', res);
            // console.log(htmlStr);
            // 渲染到 tbody 里面
            $('tbody').html(htmlStr)

            //3.4调用 渲染分页器 的函数
            renderPage(res.total)
        })
    }


    // 4.把服务端获取的数据，渲染成分页器
    function renderPage(total) {
        // 调用 layui 文档中的 render 方法 也就是渲染分页器的方法
        laypage.render({
            //注意，这里的 pagination 是分页器容器的 id，不用加 # 号
            elem: 'pagination',
            //实参 total 数据总数，从服务端得到的 也就是调用函数时传入的res.total
            count: total,
            limit: query.pagesize, // limit 每页显示的数量 等于 query 的配置项里的 pagesize 表示每页显示的数据条数
            limits: [2, 3, 4, 5], //每页条数的选择项。如果 layout 参数开启了 limit，则会出现每页条数的select选择框
            curr: query.pagenum, //当前的页码值
            // 自定义排版。可选值有：count（共几条）、prev（上一页区域）、page（分页区域）、next（下一页区域）、
            // limit（分为几页显示）、refresh（页面刷新区域。注意：layui 2.3.0 新增） 、skip（快捷跳页区域）
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //分页器的布局排版
            // 切换分页回调函数 jump
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数

                //4.2 修改查询对象 query 的参数 (也就是当前的页码值与每页显示的数量)
                // 切换分页后，重新更新页面值
                query.pagenum = obj.curr //curr : 当前的页码值

                // 切换分页后，重新更新每页显示的数量
                query.pagesize = obj.limit //limit : 每页显示的数量

                //首次不执行
                if (!first) {
                    //非首次进入页面，需要重新渲染表格数据
                    // 重新调用一下请求数据渲染表格的函数  renderTable 函数 
                    renderTable();
                }
            }

        });
    }


    // 5 筛选功能
    $('.layui-form').submit(function(e) {
        e.preventDefault();
        // 5.1 获取下拉选择框的分类和状态(也就是下拉框里面的值)
        const cate_id = $('#cate-sel').val()
        const state = $('#state').val()

        // 输出看下效果
        // console.log(cate_id, state);

        // 5.2 把获取到的值重新赋值给 query 对象
        query.cate_id = cate_id
        query.state = state

        //优化 在点击筛选按钮发送请求之前去修改页码值为第一页
        query.pagenum = 1

        //5.3重新调用一下请求数据渲染表格的函数  renderTable 函数 
        renderTable();
    })


    // 6.点击删除按钮，删除当前的文章
    $(document).on('click', '.delete-btn', function() {
        //6.1 获取当前点击的删除按钮所对应的 自定义属性
        const id = $(this).data('id')
            // 6.2 弹出一个询问框
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            // 6.3发送请求到服务器，删除这条分类
            axios.get(`/my/article/delete/${id}`).then(res => {
                // console.log(res);
                // 6.4删除失败
                if (res.status !== 0) {
                    return layer.msg('删除失败!')
                }

                //6.5 删除成功提示
                layer.msg('删除成功！！！');

                // 填坑操作：当前页只有一条数据时，那么我们点击删除这条数据之后，应该去手动请求更新上一页的数据
                // 如果当前删除按钮的长度为1，说明当前页面只剩最后一个删除按钮(也就是当前页只剩一条数据了) 并且 当前不处于第一页时(如果处于第一页说明全部数据都只剩一条了，删了就全没了，也就不用更新页码了)
                if ($('.delete-btn').length == 1 || query.pagenum !== 1) {
                    // 当前页面值减一 (也就是手动请求更新上一页的数据)
                    query.pagenum = query.pagenum - 1

                }

                //6.6 重新调用一下请求数据渲染表格的函数  renderTable 函数 
                renderTable();

            })
        });
    })

    // 7. 点击编辑按钮，去跳转到编辑文章页面，编辑文章
    $(document).on('click', '.edit-btn', function() {

        // 获取当前文章 id 
        const id = $(this).data('id');
        // 如何在两个页面之间进行数据传递：使用查询参数 ?name=tom&age=10
        //把当前编辑的文章id以查询参数的方式传入 edit.html页面(编辑页面)的地址后面 (键值对字符串)
        location.href = `./edit.html?id=${id}`


        // 点击编辑按钮的时候
        // 同时左边的高亮绿色导航条要同时进行更新
        // 外部元素的 layui-this(文章列表按钮) 的相邻的后一个元素 prev()(也就是发表文章) 里面的 a 链接自动触发点击事件(利用这个方式使其高亮)
        window.parent.$('.layui-this').next().find('a').click()
    })






















})