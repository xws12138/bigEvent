// 为全局的 axios 请求设置根路径
axios.defaults.baseURL = 'http://ajax.frontend.itheima.net'


// 添加全局的请求拦截器
axios.interceptors.request.use(function(config) {
    console.log('请求前');
    // 在发送请求之前做些什么
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});


// 添加全局的响应拦截器
axios.interceptors.response.use(function(response) {
    console.log('响应前');
    // 对响应数据做点什么 response  是返回的所有数据，
    return response.data;
    // return response.data; 意思是只 return response 里面的 data，其他的都拦截下来，
    // 那么现在，res里面就只有 data 其他数据都收不到了，被拦截住了
    // 以后获取数据到的真实数据，只需要写一个 res 不需要 res.data，因为现在 res 里面只有 data， res 就是 data

}, function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});