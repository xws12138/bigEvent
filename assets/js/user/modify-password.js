// 修改密码
$(function() {
    // 1.对表单进行校验
    const { form, layer } = layui

    form.verify({
        pass: [
            /^\w{6,12}$/,
            '密码必须6,12位，且不能出现空格'
        ],
        confirmPass: function(val) {

            console.log($('#pass').val());
            //$('#pass').val() 是新密码
            //val 是确认新密码
            if (val !== $('#pass').val()) {
                return '两次密码输入不一致'
            }

        }
    })

    // 2.表单提交
    $('.layui-form').submit(function(e) {
        // 阻止默认跳转
        e.preventDefault();
        // 发送ajax请求
        axios.post('/my/updatepwd', $(this).serialize())
            .then(res => {
                if (res.status !== 0) {
                    return layer.msg('修改密码失败！')
                }

                layer.msg('修改密码成功！')
            })
    })








})