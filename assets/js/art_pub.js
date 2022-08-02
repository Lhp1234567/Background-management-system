$(function(){
    var layer=layui.layer
    var form=layui.form
    initCate()
    initEditor()
    function initCate(){
        $.ajax({
        method:'GET',
        url:'/my/article/cates',
        success:function(res){
            if(res.status!==0){
                return layer.msg('获取数据失败')
            }

            console.log(res)
           var htmlstr=template('tpl-cate',res)
           $('[name=cate_id]').html(htmlstr)
           form.render()
        }
        })
    }
     // 1. 初始化图片裁剪器
  var $image = $('#image')
  
  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  
  // 3. 初始化裁剪区域
  $image.cropper(options)
  $('.btnchangcover').on('click',function(){
    $('#coverFile').click()
  })
//   更改封面
  $('#coverFile').on('change',function(e){
    var file = e.target.files[0]
    if(file.length===0){
        return
    }
    // 根据选择的文件，创建一个对应的 URL 地址：
    var newImgURL = URL.createObjectURL(file)
    // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
    $image
   .cropper('destroy')      // 销毁旧的裁剪区域
   .attr('src', newImgURL)  // 重新设置图片路径
   .cropper(options)        // 重新初始化裁剪区域
  })
  var art_stat='已发布'
  $('btn-save2').on('click',function(){
    var art_stat='草稿'  
  })
  $('#form-pub').on('submit',function(e){
 e.preventDefault()
  var fd=new FormData($(this)[0])
  fd.append('state',art_stat)
  fd.forEach(function(v,k){
      console.log(v,k)
      // 将画布上内容转化为文件内容
      $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function(blob) {
        fd.append('cover_img',blob)
        publishArticle(fd)
      })
  })
  // function publishArticle(fd){
  //   $.ajax({
  //     method: 'POST',
  //     url: '/my/article/add',
  //     data:fd,
  //     // 注意：如果想服务器传输FormData格式的文件时，
  //     // 必须要有一下2个配置
  //     contentType:false,
  //     processData:false,
  //     success:function(res){
  //       if(res.status!==0){
  //         return layer.msg('发布文章失败')
  //       }
  //       layer.msg('发布文章成功')
  //       location.href='/article/art_list.html'
  //     }

  //   })
  // }
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      // 注意：如果向服务器提交的是 FormData 格式的数据，
      // 必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('发布文章失败！')
        }
        layer.msg('发布文章成功！')
        // 发布文章成功后，跳转到文章列表页面
        location.href = '/article/art_list.html'
      }
    })
}
  })
})

