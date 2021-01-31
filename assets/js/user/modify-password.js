// 修改密码
$(function() {

    const { form, layer } = layui


    // 1.对表单进行校验
    // form.verify() 这个方法是表单默认的校验规则
    form.verify({
        // 把这个 pass 添加到要校验的那个输入框的lay-verify="required"属性上 ==> lay-verify="required|pass"
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

    // 2.表单提交事件submit
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
                    // 修改密码成功的时候 清空所有输入框
                    // 通过 jq 的方式 拿到表单，在通过 [0]的方法把jq对象转成原生dom对象
                    // 然后再使用原生的 reset() 方法 重置表单
                $('.layui-form')[0].reset()

            })
    })








})