$(function() {
    var layer = layui.layer
    var form = layui.form
  
    initArtCateList()
  
    // 获取文章分类的列表
    function initArtCateList() {
      $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function(res) {
          var htmlStr = template('tpl-table', res)
          $('tbody').html(htmlStr)
        }
      })
    }
  
    // 为添加类别按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
      indexAdd = layer.open({
        type: 1,
        area: ['500px', '250px'],
        title: '添加文章分类',
        content: $('#dialog-add').html()
      })
    })
  
    // 通过代理的形式，为 form-add 表单绑定 submit 事件
    $('body').on('submit','#form-add', function(e) {
      e.preventDefault()
      $.ajax({
        method: 'POST',
        url: '/my/article/addcates',
        data: $(this).serialize(),
        success: function(res) {
          console.log(res)
          if (res.status !== 0) {
            return layer.msg('新增分类失败！')
          }
          initArtCateList()
          layer.msg('新增分类成功！')
          // 根据索引，关闭对应的弹出层
          layer.close(indexAdd)
        }
      })
    })
    var indexedit = null
    $('tbody').on('click','.btn-edit',function(){
        indexedit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '编辑文章分类',
            content: $('#dialog-edit').html()
          })
          var id=$(this).attr('data-id')
          $.ajax({
            method:'GET',
            url:'/my/article/cates/'+id,
            success:function(res){
              console.log(res)
             form.val('form-edit',res.data)
            }
          })
    })
    // 通过代理事件，更新表单数据
    $('body').on('submit', '#form-edit', function(e) {
      e.preventDefault()
      $.ajax({
        method: 'POST',
        url: '/my/article/updatecate',
        data: $(this).serialize(),
        success: function(res) {
          if (res.status !== 0) {
            console.log
            return layer.msg('更新分类数据失败！')
          }
          layer.msg('更新分类数据成功！')
          layer.close(indexEdit)
          initArtCateList()
        }
      })
    })
   $('tbody').on('click','.btn-delete',function(){
   var id=$(this).attr('data-id')
   layer.confirm('是否确认删除?', {icon: 3, title:'提示'}, function(index){
    //do something
    $.ajax({
      method:'GET',
      url:'/my/article/deletecate/'+id,
      success:function(res){
        if(res.status!==0){
        return layer.msg('删除分类成功')
        }
        layer.msg('删除分类失败')
        layer.close(index);
        initArtCateList()

      }
    })
   
  });
   })
 })
