$(function(){

    $('#login-box').on('click',function(){
        $('.login').hide();
        $('.reg').show()
    })
    $('#reg-box').on('click',function(){
        $('.login').show();
        $('.reg').hide()
    })
    var form=layui.form
    form.verify({
        // 自定义paw校验规则，密码必须6-12位
        pwd:[
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ] ,
        // 校验二次密码是否一致
        repwd:function(value){
          var pwd= $('#pwdd').val()
          if(pwd !== value){
            return '二次密码不一致'
          }
        }
    })
   
    // 监听表单提交事件
    $('#form-reg').on('submit',function(e){
        // 阻止默认提交行为
        e.preventDefault()
        //发起ajax中的post请求
        $.post('/api/reguser',
        {username:$('#username').val(),password:$('#pwdd').val()}
        ,function(res){
            if(res.status!==0){
                return layer.msg(res.message);
            }
           layer.msg('注册成功，请登录')
           $('#reg-box').click()     
                  })
    })
    $('#form-login').submit(function(e) {
        // 阻止默认提交行为
        e.preventDefault()
        $.ajax({
          url: '/api/login',
          method: 'POST',
          // 快速获取表单中的数据
          data: $(this).serialize(),
          success: function(res) {
            if (res.status !== 0) {
              return layer.msg('登录失败！')
            }
            layer.msg('登录成功！')
            // 将登录成功得到的 token 字符串，保存到 localStorage 中
            localStorage.setItem('token', res.token)
            // 跳转到后台主页
            location.href = '/index.html'
          }
        })
      })
    })
