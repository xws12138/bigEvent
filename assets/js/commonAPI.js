// 为全局的 axios 请求设置根路径
// 以后git post 都不需要拼接根路径了，只需要写类似 api/reguser 这样的网址具体路径即可
axios.defaults.baseURL = 'http://ajax.frontend.itheima.net'


// 添加全局的请求拦截器
axios.interceptors.request.use(function(config) {
    console.log('请求前');

    // 获取本地存储的令牌  token
    const token = localStorage.getItem('token') || ''

    // 在发送请求之前判断是否有 /my开头的请求路径
    // 三种判断方法
    // 1 startsWith('/my')
    // 2 indexOf('/my')==0
    // 3 正则表达式 /^\/my/.test()
    // config 系统是封装好的对象，里面有很多数据包括 url
    if (config.url.startsWith('/my')) { //用startsWith方法判断 config对象里面的url有没有以/my开头
        // 如果有，手动添加 headers 请求头
        config.headers.Authorization = token
    }

    return config;

}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});


// 添加全局的响应拦截器
axios.interceptors.response.use(function(response) {
    console.log('响应前');
    // 从response.data中解构赋值出 message status 属性
    const { message, status } = response.data
        // 判断身份验证是否成功 如果失败，说明tolen是伪造的
    if (message == '身份认证失败！' && status == 1) {
        // 跳转之前，清除本地的 token 令牌
        localStorage.removeItem('token');
        //如果失败，跳转到登录页面
        location.href = './login.html'
    }


    // 对响应数据做点什么 response  是返回的所有数据，
    return response.data;
    // return response.data; 意思是只 return response 里面的 data，其他的都拦截下来，
    // 那么现在，res里面就只有 data 其他数据都收不到了，被拦截住了
    // 以后获取数据到的真实数据，只需要写一个 res 不需要 res.data，因为现在 res 里面只有 data， res 就是 data

}, function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});