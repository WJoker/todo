var timeString = function(timestamp) {
    t = new Date(timestamp * 1000)
    t = t.toLocaleTimeString()
    return t
}

var commentsTemplate = function(comments) {
    var html = ''
    for(var i = 0; i < comments.length; i++) {
        var c = comments[i]
        var t = `
            <div>
                ${c.content}
            </div>
        `
        html += t
    }
    return html
}

var WeiboTemplate = function(Weibo) {
    var content = Weibo.content
    var id = Weibo.id
    var comments = commentsTemplate(Weibo.comments)
    var t = `
        <div class='weibo-cell' data-id=${id}>
            <div>
                [WEIBO]: ${content}
            </div>
            <div class="comment-list">
                ${comments}
            </div>
            <div class="comment-form">
                <input type="hidden" name="weibo_id" value="">
                <input name="content">
                <br>
                <button class="comment-add">添加评论</button>
                <button class="weibo-delete">删除 weibo</button>
                <button class="weibo-edit">编辑 weibo</button>
            </div>
        </div>
    `
    return t
}

var insertWeibo = function(Weibo) {
    var WeiboCell = WeiboTemplate(Weibo)
    // 插入 Weibo-list
    var WeiboList = e('.weibo-list')
    WeiboList.insertAdjacentHTML('beforeend', WeiboCell)
}

var insertEditForm = function(cell) {
    var form = `
        <div class='weibo-edit-form'>
            <input class="weibo-edit-input">
            <button class='weibo-update'>更新</button>
        </div>
    `
    cell.insertAdjacentHTML('beforeend', form)
}

var loadWeibos = function() {
    // 调用 ajax api 来载入数据
    apiWeiboAll(function(r) {
        // console.log('load all', r)
        // 解析为 数组
        var Weibos = JSON.parse(r)
        // 循环添加到页面中
        for(var i = 0; i < Weibos.length; i++) {
            var Weibo = Weibos[i]
            insertWeibo(Weibo)
        }
    })
}

var bindEventWeiboAdd = function() {
    var b = e('#id-button-add-weibo')
    // 第二个参数可以直接给出定义函数
    b.addEventListener('click', function(){
        var input = e('#id-input-weibo')
        var title = input.value
        log('click add', title)
        var form = {
            'title': title,
        }
        apiWeiboAdd(form, function(r) {
            // 收到返回的数据, 插入到页面中
            var Weibo = JSON.parse(r)
            insertWeibo(Weibo)
        })
    })
}

var bindEventWeiboDelete = function() {
    var WeiboList = e('.weibo-list')
    log('WeiboList', WeiboList)
    // 第二个参数可以直接给出定义函数
    WeiboList.addEventListener('click', function(event){
        var self = event.target
        log('self', self)
        if(self.classList.contains('weibo-delete')){
            // 删除这个 Weibo
            var WeiboCell = self.parentElement.parentElement
            log('WeiboCell', WeiboCell)
            var Weibo_id = WeiboCell.dataset.id
            log('click add', Weibo_id)
            apiWeiboDelete(Weibo_id, function(r){
                log('删除成功', Weibo_id)
                WeiboCell.remove()
            })
        }
    })
}

var bindEventWeiboEdit = function() {
    var WeiboList = e('.weibo-list')
    // 第二个参数可以直接给出定义函数
    WeiboList.addEventListener('click', function(event){
        var self = event.target
        log('edit self', self)
        if(self.classList.contains('weibo-edit')){
            // 编辑这个 Weibo
            var WeiboCell = self.parentElement.parentElement
            log('edit weibocell', WeiboCell)
            insertEditForm(WeiboCell)
        }
    })
}

var bindEventWeiboUpdate = function() {
    var WeiboList = e('.weibo-list')
    // 第二个参数可以直接给出定义函数
    WeiboList.addEventListener('click', function(event){
        var self = event.target
        if(self.classList.contains('weibo-update')){
            log('点击了 update ', self)
            //
            var editForm = self.parentElement
            log('editFrom', editForm)
            // querySelector 是 DOM 元素的方法
            // document.querySelector 中的 document 是所有元素的祖先元素
            var input = editForm.querySelector('.weibo-edit-input')
            log('edit input', input)
            var title = input.value
            log('edit title', title)
            // 用 closest 方法可以找到最近的直系父节点
            var WeiboCell = self.closest('.weibo-cell')
            log('WeiboCell', WeiboCell)
            var Weibo_id = WeiboCell.dataset.id
            log('Weibo_id', Weibo_id)
            var form = {
                'id': Weibo_id,
                'title': title,
            }
            log('edit form', form)
            apiWeiboUpdate(form, function(r){
                log('更新成功', Weibo_id)
                var Weibo = JSON.parse(r)
                var selector = '#weibo-' + Weibo.id
                var WeiboCell = e(selector)
                var titleSpan = WeiboCell.querySelector('.weibo-title')
                titleSpan.innerHTML = Weibo.title
//                WeiboCell.remove()
            })
        }
    })
}

var bindEvents = function() {
    bindEventWeiboAdd()
    bindEventWeiboDelete()
    bindEventWeiboEdit()
    bindEventWeiboUpdate()
}

var __main = function() {
    bindEvents()
    loadWeibos()
}

__main()