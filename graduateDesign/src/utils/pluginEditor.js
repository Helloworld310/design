// 编辑器区域 table toolbar
(function () {
  // 获取 wangEditor 构造函数和 jquery
  var E = require('wangeditor')
  var $ = require('jquery')

  E.plugin(function () {
      var editor = this;
      var txt = editor.txt;
      var $txt = txt.$txt;
      var $currentTable;

      // 用到的dom节点
      var isRendered = false;
      var $toolbar = $('<div class="txt-toolbar"></div>');
      var $triangle = $('<div class="tip-triangle"></div>');
      var $delete = $('<a href="#"><i class="wangeditor-menu-img-trash-o"></i></a>');
      var $zoomSmall = $('<a href="#"><i class="wangeditor-menu-img-search-minus"></i></a>');
      var $zoomBig = $('<a href="#"><i class="wangeditor-menu-img-search-plus"></i></a>');

      // 渲染到页面
      function render() {
          if (isRendered) {
              return;
          }
          
          // 绑定事件
          bindEvent();

          // 拼接 渲染到页面上
          $toolbar.append($triangle)
                  .append($delete)
                  .append($zoomSmall)
                  .append($zoomBig);
          editor.$editorContainer.append($toolbar);
          isRendered = true;
      }

      // 绑定事件
      function bindEvent() {
          // 统一执行命令的方法
          var commandFn;
          function command(e, callback) {
              if (commandFn) {
                  editor.customCommand(e, commandFn, callback);
              }
          }

          // 删除
          $delete.click(function (e) {
              commandFn = function () {
                  $currentTable.remove();
              };
              command(e, function () {
                  setTimeout(hide, 100);
              });
          });

          // 放大
          $zoomBig.click(function (e) {
              commandFn = function () {
                  $currentTable.css({
                      width: '100%'
                  });
              };
              command(e, function () {
                  setTimeout(show);
              });
          });

          // 缩小
          $zoomSmall.click(function (e) {
              commandFn = function () {
                  $currentTable.css({
                      width: 'auto'
                  });
              };
              command(e, function () {
                  setTimeout(show);
              });
          });
      }

      // 显示 toolbar
      function show() {
          if ($currentTable == null) {
              return;
          }
          $currentTable.addClass('clicked');
          var tablePosition = $currentTable.position();
          var tableTop = tablePosition.top;
          var tableLeft = tablePosition.left;
          var tableHeight = $currentTable.outerHeight();
          var tableWidth = $currentTable.outerWidth();

          // --- 定位 toolbar ---

          // 计算初步结果
          var top = tableTop + tableHeight;
          var left = tableLeft;
          var marginLeft = 0;

          var txtTop = $txt.position().top;
          var txtHeight = $txt.outerHeight();
          if (top > (txtTop + txtHeight)) {
              // top 不得超出编辑范围
              top = txtTop + txtHeight;
          }

          // 显示（方便计算 margin）
          $toolbar.show();

          // 计算 margin
          var width = $toolbar.outerWidth();
          marginLeft = tableWidth / 2 - width / 2;

          // 定位
          $toolbar.css({
              top: top + 5,
              left: left,
              'margin-left': marginLeft
          });
      }
      
      // 隐藏 toolbar
      function hide() {
          if ($currentTable == null) {
              return;
          }
          $currentTable.removeClass('clicked');
          $currentTable = null;
          $toolbar.hide();
      }

      // click table 事件
      $txt.on('click', 'table', function (e) {
          var $table = $(e.currentTarget);

          // 渲染
          render();

          if ($currentTable && ($currentTable.get(0) === $table.get(0))) {
              setTimeout(hide, 100);
              return;
          }

          // 显示 toolbar
          $currentTable = $table;
          show();

          // 阻止冒泡
          e.preventDefault();
          e.stopPropagation();
          
      }).on('click keypress scroll', function (e) {
          setTimeout(hide, 100);
      });
      E.$body.on('click keypress scroll', function (e) {
          setTimeout(hide, 100);
      });
  });

})();