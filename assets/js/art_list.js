$(function(){
    var layer = layui.layer
    var form=layui.form
    var laypage = layui.laypage
     // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function(date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' +ss
  }

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
      }
    initTable()
    initCate()
    // 获取文章列表数据
   // 获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method:'GET',
      url:'/my/article/list',
    // url:'/my/article/cates',
      data: q,
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
        }
        console.log(res)
        // 使用模板引擎渲染页面的数据
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        // 调用渲染分页的方法
        renderPage(res.total)

      }
    })
  }
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败！')
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 通过 layui 重新渲染表单区域的UI结构
        form.render()
      }
    })
  }
  $('#form-search').on('submit', function(e) {
    e.preventDefault()
    // 获取表单中选中项的值
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    // 为查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    // 根据最新的筛选条件，重新渲染表格的数据
    initTable()
  })

  function renderPage(total){
    laypage.render({
      elem:'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
      count:total, //数据总数，从服务端得到
      limit:q.pagesize,
      curr:q.pagenum,
      layout:['count','prev', 'page', 'next','limit','skip'],
      limits:[2,3,5,10],
      jump: function(obj, first){
        //obj包含了当前分页的所有参数，比如：
        // console.log(obj.curr,first); //得到当前页，以便向服务端请求对应页的数据。
        q.pagenum=obj.curr
        q.pagesize=obj.limit
        if(!first){
          initTable()
        }
      }

    })

  }
  $('tbody').on('click','.btn-delete',function(){
    console.log('po')
    var len=$('btn-delete').length
    var id=$(this).attr('data-id')
    layer.confirm('是否要删除?', {icon: 3, title:'提示'}, function(index){
      $.ajax({
        method:'GET',
        url:'/my/article/delete/'+id,
        success: function(res) {
          if (res.status !== 0) {
            return layer.msg('删除数据失败！')
          }
          layer.msg('删除数据成功！')
          console.log(res)
          if(len===1){
            q.pagenum=q.pagenum===1?1:q.pagenum-1
          }
          initTable()
        }
      
      })
      layer.close(index);
    })
  })
  $('tbody').on('click','.btn-edit',function(){
    location.href = '/article/art_pub.html'
   
  })
})
