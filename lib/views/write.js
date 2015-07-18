'use strict';

var inherits = require('inherits');

var h = require('virtual-dom/h');

var View = require('../components/view');

var fs = require('fs');


function WriteView(app) {
    View.call(this, 'Write', app);

    this.text = fs.readFileSync(__dirname + '/gulp.md', { encoding: 'utf8' });

    function broadcastText() {
        app.emit('text.update', this.text);
    }

    this.on('detach', broadcastText.bind(this));

    function scrollUp(view) {
        if (this === view) {
            this.scrollUp();
        }
    }

    app.on('view.activate', scrollUp.bind(this));
}

inherits(WriteView, View);

module.exports = WriteView;


WriteView.prototype.persistText = function(evt) {
    var text = evt.currentTarget.value;

    if (this.text !== text) {
        this.text = text;
    }
};

WriteView.prototype.scrollUp = function() {
    if (!this.text) {
        return;
    }

    function delayedScroll() {
        var ta = this.$el.querySelector('.markdown-textarea');

        ta.scrollTop = 0;
    }

    setTimeout(delayedScroll.bind(this), 50);
};

WriteView.prototype.toNode = function() {
    return this.renderView([
        h('textarea.markdown-textarea', {
            type: 'text',
            spellcheck: false,
            autofocus: true,
            scrollTop: true,
            'ev-keyup': this.persistText.bind(this)
        }, this.text)
    ]);
};
