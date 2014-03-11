/**
 * jQuery Messi Plugin 1.3
 * https://github.com/marcosesperon/jquery-messi
 *
 * Copyright 2012, Marcos Esperón
 * http://marcosesperon.es
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

// Main class
(function($) {
function Messi(data, options) {

  var _this = this;
  _this.options = jQuery.extend({}, Messi.prototype.options, options || {});

  // Prepare the item
  _this.messi = jQuery(_this.template);
  _this.setContent(data);

  // Adjust the title
  if(_this.options.title == null) {

    jQuery('.messi-titlebox', _this.messi).remove();

  } else {

    jQuery('.messi-title', _this.messi).append(_this.options.title);

    if(_this.options.buttons.length === 0 && !_this.options.autoclose) {

      if(_this.options.closeButton) {
        var close = jQuery('<span class="messi-closebtn"></span>');
        close.bind('click', function() {
          _this.hide();
        });

        jQuery('.messi-titlebox', this.messi).prepend(close);

      };

    };

    if(_this.options.titleClass != null) jQuery('.messi-titlebox', this.messi).addClass(_this.options.titleClass);

  };

  // Adjust the width
  if(_this.options.width != null) jQuery('.messi-box', _this.messi).css('width', _this.options.width);

  // Prepare the buttons
  if(_this.options.buttons.length > 0) {

    for (var i = 0; i < _this.options.buttons.length; i++) {

      var cls = (_this.options.buttons[i]["class"]) ? _this.options.buttons[i]["class"] : '';
      var btn = jQuery('<div class="btnbox"><button data-value="'+ _this.options.buttons[i].val +'" class="btn ' + cls + '" href="#">' + _this.options.buttons[i].label + '</button></div>');
      btn.on('click', 'button', function() {
        var value = jQuery(this).data('value');
        var after = (_this.options.callback != null) ? function() { return _this.options.callback.call(this, value); } : null;
        _this.hide(after);
      });

      jQuery('.messi-actions', this.messi).append(btn);

    };

  } else {

    jQuery('.messi-footbox', this.messi).remove();

  };

  // Prepare the close button automatically
  if(_this.options.buttons.length === 0 && _this.options.title == null && !_this.options.autoclose) {

    if(_this.options.closeButton) {
      var close = jQuery('<span class="messi-closebtn"></span>');
      close.bind('click', function() {
        _this.hide();
      });

      jQuery('.messi-content', this.messi).prepend(close);

    };

  };

  // Activate the modal screen
  _this.modal = (_this.options.modal) ? jQuery('<div class="messi-modal"></div>').css({opacity: _this.options.modalOpacity, width: jQuery(document).width(), height: jQuery(document).height(), 'z-index': _this.options.zIndex + jQuery('.messi').length}).appendTo(document.body) : null;

  // Show the message
  if(_this.options.show) _this.show();

  // Control the resizing of the display
  jQuery(window).bind('resize', function(){ _this.resize(); });

  // Configure the automatic closing
  if(_this.options.autoclose != null) {
    setTimeout(function(_this) {
      _this.hide();
    }, _this.options.autoclose, this);
  };

  return _this;

};

Messi.prototype = {

  options: {
    autoclose: null,                         // autoclose message after 'x' miliseconds, i.e: 5000
    buttons: [],                             // array of buttons, i.e: [{id: 'ok', label: 'OK', val: 'OK'}]
    callback: null,                          // callback function after close message
    center: true,                            // center message on screen
    closeButton: true,                       // show close button in header title (or content if buttons array is empty).
    height: 'auto',                          // content height
    title: null,                             // message title
    titleClass: null,                        // title style: info, warning, success, error
    modal: false,                            // shows message in modal (loads background)
    modalOpacity: .2,                        // modal background opacity
    padding: '10px',                         // content padding
    show: true,                              // show message after load
    unload: true,                            // unload message after hide
    viewport: {top: '0px', left: '0px'},     // if not center message, sets X and Y position
    width: '500px',                          // message width
    zIndex: 99999                            // message z-index
  },
  template: '<div class="messi"><div class="messi-box"><div class="messi-wrapper"><div class="messi-titlebox"><span class="messi-title"></span></div><div class="messi-content"></div><div class="messi-footbox"><div class="messi-actions"></div></div></div></div></div>',
  content: '<div></div>',
  visible: false,

  setContent: function(data) {
    jQuery('.messi-content', this.messi).css({padding: this.options.padding, height: this.options.height}).empty().append(data);
  },

  viewport: function() {

    return {
      top: ((jQuery(window).height() - this.messi.height()) / 2) +  jQuery(window).scrollTop() + "px",
      left: ((jQuery(window).width() - this.messi.width()) / 2) + jQuery(window).scrollLeft() + "px"
    };

  },

  show: function() {

    if(this.visible) return;

    if(this.options.modal && this.modal != null) this.modal.show();
    this.messi.appendTo(document.body);

    // Get the center of the screen if the center option is on
    if(this.options.center) this.options.viewport = this.viewport(jQuery('.messi-box', this.messi));

    this.messi.css({top: this.options.viewport.top, left: this.options.viewport.left, 'z-index': this.options.zIndex + jQuery('.messi').length}).show().animate({opacity: 1}, 300);

    // Cancel the scroll
    //document.documentElement.style.overflow = "hidden";

    this.visible = true;

  },

  hide: function(after) {
    if (!this.visible) return;
    var _this = this;

    if (typeof after === 'function') {
      if (after.call(this) == false) {
        return this;
      }
    }

    this.messi.animate({opacity: 0}, 300, function() {
      if(_this.options.modal && _this.modal != null) _this.modal.remove();
      _this.messi.css({display: 'none'}).remove();
      // Reactivate the scroll
      //document.documentElement.style.overflow = "visible";
      _this.visible = false;
      if(_this.options.unload) _this.unload();
    });

    return this;

  },

  resize: function() {
    if(this.options.modal) {
      jQuery('.messi-modal').css({width: jQuery(document).width(), height: jQuery(document).height()});
    };
    if(this.options.center) {
      this.options.viewport = this.viewport(jQuery('.messi-box', this.messi));
      this.messi.css({top: this.options.viewport.top, left: this.options.viewport.left});
    };
  },

  toggle: function() {
    this[this.visible ? 'hide' : 'show']();
    return this;
  },

  unload: function() {
    if (this.visible) this.hide();
    jQuery(window).unbind('resize', function () { this.resize(); });
    this.messi.remove();
  },

};

// Special Call
jQuery.extend(Messi, {

  alert: function(data, callback, options) {

      var buttons = [{id: 'ok', label: 'OK', val: 'OK'}];

      options = jQuery.extend({closeButton: false, buttons: buttons, callback:function() {}}, options || {}, {show: true, unload: true, callback: callback});

      return new Messi(data, options);

  },

  ask: function(data, callback, options) {

    var buttons = [
      {id: 'yes', label: 'Yes', val: 'Y', "class": 'btn-success'},
      {id: 'no', label: 'No', val: 'N', "class": 'btn-danger'},
    ];

    options = jQuery.extend({closeButton: false, modal: true, buttons: buttons, callback:function() {}}, options || {}, {show: true, unload: true, callback: callback});

    return new Messi(data, options);

  },

  img: function(src, options) {

    var img = new Image();

    jQuery(img).load(function() {

      var vp = {width: jQuery(window).width() - 50, height: jQuery(window).height() - 50};
      var ratio = (this.width > vp.width || this.height > vp.height) ? Math.min(vp.width / this.width, vp.height / this.height) : 1;

      jQuery(img).css({width: this.width * ratio, height: this.height * ratio});

      options = jQuery.extend(options || {}, {show: true, unload: true, closeButton: true, width: this.width * ratio, height: this.height * ratio, padding: 0});
      new Messi(img, options);

    }).error(function() {

      // Be IE friendly
      if (typeof window.console === 'object') console.log('Error loading ' + src);

    }).attr('src', src);

  },

  load: function(url, options) {

    options = jQuery.extend(options || {}, {show: true, unload: true, params: {}});

    var request = {
      url: url,
      data: options.params,
      dataType: 'html',
      cache: false,
      error: function (request, status, error) {
        // Be IE friendly
        if (typeof window.console === 'object') console.log(request.responseText);
      },
      success: function(html) {
        //html = jQuery(html);
        new Messi(html, options);
      }
    };

    jQuery.ajax(request);

  }

});

$.Messi = Messi;
})(jQuery);
// vim: expandtab shiftwidth=2 tabstop=2 softtabstop=2:
