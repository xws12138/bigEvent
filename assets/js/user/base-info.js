// 基本资料功能
$(function() {
    // 1.页面一加载就获取用户信息
    const { layer, form } = layui

    function initUserInfo() {
        axios.get('/my/userinfo').then(res => {
            // 校验失败
            if (res.status !== 0) {
                return layer.msg('获取失败！')
            }
            const { data } = res
            // 如果没有失败则渲染信息

            // 给表单赋值
            // 注意 edit-userinfo 是表单 lay-filter 属性的值
            // data对象中的属性名和表单 name 的值一一对应
            form.val('edit-userinfo', data)
        })
    }

    initUserInfo()

    // 2.验证表单 内置方法 verify 
    form.verify({
        // 验证昵称，注意要在用户昵称的lay-verify="required"的后面加上| nick 修改后lay-verify="required|nick"
        // 邮箱验证系统内置了，所以不需要我们来设置 他自己会验证，我们只需要在用户邮箱后面加上 |email 即可
        nick: [
            /^\S{1,6}$/,
            '昵称长度必须要在1~6个字符之间'
        ]
    })

    // 3.提交修改
    $('.base-info-form').submit(function(e) {
        // 阻止默认行为
        e.preventDefault()
            // 发送ajax请求 不用url根地址 直接拼接上表单的所有值 serialize()
        axios.post('/my/userinfo', $(this).serialize())
            .then(res => {
                // console.log(res);
                //校验失败
                if (res.status !== 0) {
                    return layer.msg('修改信息失败！')
                }
                layer.msg('修改信息成功！');
                // 如果成功 更新用户信息
                // window.parent 可以获取到外层的dom元素对象 传入渲染头像函数 getUserInfo()
                window.parent.getUserInfo()

            })
    })

    // 4.重置功能
    $('#reset-btn').click(function(e) {
        e.preventDefault()
            // 重新渲染用户信息
        initUserInfo()
    })


})