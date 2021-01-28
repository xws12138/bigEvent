$(function() {
    // 从 layui 中提取 form 表单模块(解构赋值)
    const { form, layer } = layui


    // 点击按钮进行表单切换
    $('.link a').click(function() {
        $('.layui-form').toggle()
    })



    // 密码验证
    form.verify({
        pass: [
            /^\w{6,12}$/,
            '密码只能在6到12位之间'
        ],
        samePass: function(value) { //value 表示表单值
            if (value !== $('#pass').val()) { //判断当前输入框(确认密码框)输入的值，与 #pass (也就是输入密码框的值是否一致)
                return '两次输入的密码不一致！！！' //不一致则弹出提示
            }
        }
    });
    // 实现注册功能
    $('.reg-form').submit(function(e) {
        // 阻止默认提交
        e.preventDefault();
        // console.log($(this).serialize()) //$(this).serialize() 是一个键值对字符串
        // 发送ajax  serialize()方法获取表单的全部内容 
        // 这里不需要拼接根路径 只需要写 api/reguser 路径，是因为在commonAPI.js里面进行了设置
        axios.post('api/reguser', $(this).serialize()) //没有传对象，而是传一个键值对字符串
            .then(res => {
                // 每一次获取返回数据的时候，我们需要的只是 data 然而res里面接收了一大堆数据,所以会造成数据不必要的负担(太多没必要的)
                // 所以我们需要一个拦截器，只要 data 其他的都拦截掉
                console.log(res); //res.data才是返回的真实数据 这里不写res.data是因为commonAPI.js里面设置了拦截器，拦截了响应前的数据，进行了处理
                // 所以现在res里面只有data
                // 先判断获取数据是否失败
                if (res.status !== 0) {
                    return layer.msg('用户名被占用，请更换其他用户名')
                }
                // 如果没有失败,则
                layer.msg('注册成功');
                // 自动触发点击事件,跳转到登录
                $('.login-form a').click()


            })

    })


    // 实现登录功能
    $('.login-form').submit(function(e) {
        e.preventDefault()

        // 发送ajax
        axios.post('api/login', $(this).serialize())
            .then(res => {
                // 判断是否登录失败
                if (res.status !== 0) {
                    return layer.msg('登录失败！！！')
                }
                // 登录成功后，首先把 token (个人身份凭证，令牌)保存到本地存储
                localStorage.setItem('token', res.token) //localStorage 永久存储到本地
                layer.msg('登录成功！');
                // 跳转到首页
                location.href = './index测试.html'
            })
    })







})