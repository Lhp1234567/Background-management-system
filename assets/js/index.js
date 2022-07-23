$(function(){
    getUserInfo()
    var layer=layui.layer;
  $('#logout').on('click',function(){
    layer.confirm('是否确认退出?', {icon: 3, title:'提示'}, 
    function(index){
      //do something
      // 清除本地存储的token
      localStorage.removeItem('token');
      // 页面重新跳转到登录页面
      location.href='/login.html'
      layer.close(index);
    });

  })
})
function getUserInfo(){
    $.ajax({
      method:'GET',
      url:'/my/userinfo',
      success: function(res) {
       if(res.status!== 0){
        console.log('ok')
        return layui.layer.msg('获取用户信息失败')
       }
       readerAvatr(res.data)
    
    },
    
    })
}
// 渲染用户头像
function readerAvatr(user){
var name=user.nickname||user. username
$('.welcome').html('欢迎&nbsp;&nbsp;'+ name)
// 按需渲染用户头像
if(user.user_pic!==null){
$('.layui-nav-img').attr('src',user.user_pic).show()
$('.text-avatr').hide()
}else{
  // 渲染文本头像
$('.layui-nav-img').hide()
var first=name[0].toUpperCase()
$('.text-avatr').html(first).show()
}
}
