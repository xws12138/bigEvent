$(function() {
    // 1.获取用户的个人信息
    function getUserInfo() {
        // 从layui中提取模块
        const { layer } = layui

        // 发送ajax请求
        axios.get('/my/userinfo', ).then(res => {
            console.log(res);
            // 校验请求失败 
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败！')
            }

            // 没有失败则渲染用户信息
            // 从返回的data中取出 res 
            const { data } = res
            // 获取 昵称 nickname，    用户名  username
            const name = data.nickname || data.username

            // 渲染昵称
            $('.nickname').text(`欢迎: ${name}`).show()

            // 渲染头像
            // 判断，如果有头像数据
            if (data.user_pic) {
                // 就显示头像
                $('.avatar').prop('src', data.user_pic).show()
                    // 并且隐藏字体头像
                $('.text-avatar').hide()

            } else {
                // 没有就提取 name (用户名)的的首个字符 [0] 转大写(防止首个是字母) toUpperCase()  显示出来
                $('.text-avatar').text(name[0].toUpperCase()).show()
                    // 并且隐藏图片头像
                $('.avatar').hide()
            }
        });
    }
    getUserInfo()

    // 2.点击退出
    $('#logout').click(function() {
        console.log(2);
        // 请求接口(模拟)
        // 1.清除 token 令牌
        localStorage.removeItem('token')

        // 2.跳转到登录页
        location.href = './login.html'
    })




})