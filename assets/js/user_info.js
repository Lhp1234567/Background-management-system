$(function(){
    var form=layui.form
    var layer=layui.layer
    form.verify({
        nickname:function(value){
            if(value.length>6){
                return '昵称的长度只能1-6字符之间'
            }
        }
    })
    initUserinfo()
    function initUserinfo(){
        $.ajax({
            method:'GET',
            url:'/my/userinfo',
            success:function(res){
                if(res.status !==0){
                    return layer.msg('获取用户信息失败')
                }
                console.log(res)
                form.val('formUserinfo',res.data)
            }
        })
    }
    $('layui-btn').on('click',function(e){
        e.preventDefault()
        initUserinfo()
    })
    // 监听表单的提交行为
    $('.layui-form').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    console.log('失败')
                    return layer.msg('更新用户信息失败')

                }
                layer.msg('更新用户信息成功')
                // 调用父页面中的方法，重新渲染头像和用户信息
               window.parent.getUserInfo()

            }
        })
    })
})
