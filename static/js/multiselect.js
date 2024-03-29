/*
This is code used the make to multiselect checkbox menus on the tool page.
It has been modified to fit our needs
Source: https://github.com/mneofit/multiselect/tree/master/scripts

 */


if (!m_helper) var m_helper = {
    removeNode: function (a) {
        var b = document.getElementById(a);
        b && b.parentNode.removeChild(b)
    },
    insertAfter: function (a, b) {
        var c = b.parentNode;
        b.nextElementSibling ? c.insertBefore(a, b.nextElementSibling) : c.appendChild(a)
    },
    hide: function (a) {
        a.style.display = 'none'
    },
    hideAll: function (a) {
        for (var b = 0; b < a.length; b++) this.hide(a[b])
    },
    show: function (a) {
        a.style.display = 'block'
    },
    showAll: function (a) {
        for (var b = 0; b < a.length; b++) this.show(a[b])
    },
    parent: function (a, b) {
        for (var c = a.parentElement; c && 'BODY' != c.tagName;) {
            if (c.id == b) return c;
            c = c.parentElement
        }
        return null
    },
    create: function (a) {
        var b = document.createElement(a.tag);
        if (a.id && (b.id = a.id), a.class && (b.className = a.class), a.attributes)
            for (var c in a.attributes) b.setAttribute(c, a.attributes[c]);
        if (a.data)
            for (var c in a.data) b.dataset[c] = a.data[c];
        return b
    },
    div: function (a) {
        return a || (a = {}), a.tag = 'div', this.create(a)
    },
    label: function (a) {
        return a || (a = {}), a.tag = 'label', this.create(a)
    },
    textField: function (a) {
        return a || (a = {}), a.tag = 'input', a.attributes || (a.attributes = {}), a.attributes.type = 'text', this.create(a)
    },
    checkbox: function (a) {
        return a || (a = {}), a.tag = 'input', a.attributes || (a.attributes = {}), a.attributes.type = 'checkbox', this.create(a)
    },
    each: function (a, b) {
        for (var c = 0; c < a.length; c++) b(a[c])
    },
    setActive: function (a) {
        a.classList.add('active')
    },
    setUnactive: function (a) {
        a.classList.remove('active')
    },
    select: function (a) {
        a.selected = !0, a.setAttribute('selected', 'selected')
    },
    deselect: function (a) {
        a.selected = !1, a.removeAttribute('selected')
    },
    check: function (a) {
        a.checked = !0
    },
    uncheck: function (a) {
        a.checked = !1
    },
    click: function (a) {
        if (a.fireEvent) el.fireEvent('onclick');
        else {
            var b = document.createEvent('Events');
            b.initEvent('click', !0, !1), a.dispatchEvent(b)
        }
    }
};

function Multiselect(a) {
    if ('undefined' != typeof $ && !$(a).is('select') || 'undefined' == typeof $ && 'SELECT' != a.tagName) throw 'Multiselect: passed object must be a select';
    if ('undefined' != typeof $ && !$(a).attr('multiple') || 'undefined' == typeof $ && !a.hasAttribute('multiple')) throw 'Multiselect: passed object should contain \'multiple\' attribute';
    this._item = a, this._createUI(), this._appendEvents(), this._initSelectedFields()
}

Multiselect.prototype = {
    _createUI: function () {
        m_helper.removeNode(this._getIdentifier());
        var a = this._createWrapper();
        m_helper.insertAfter(a, this._item), a.appendChild(this._createInputField()), a.appendChild(this._createItemList()), m_helper.hide(this._item)
    },
    _createWrapper: function () {
        var a = document.createElement('div');
        return a.className = 'multiselect-wrapper', a.id = this._getIdentifier(), a
    },
    _createInputField: function () {
        var a = m_helper.textField({
                id: this._getInputFieldIdentifier(),
                class: 'multiselect-input'
            }),
            b = m_helper.label({
                id: this._getInputBadgeIdentifier(),
                class: 'multiselect-count',
                attributes: {
                    for: this._getInputFieldIdentifier()
                }
            }),
            c = m_helper.label({
                class: 'multiselect-dropdown-arrow',
                attributes: {
                    for: this._getInputFieldIdentifier()
                }
            }),
            d = m_helper.div({
                class: 'multiselect-input-div'
            });
        return b.style.visibility = 'hidden', b.innerHTML = 0, d.appendChild(a), d.appendChild(b), d.appendChild(c), d
    },
    _createItemList: function () {
        var a = m_helper.create({
                tag: 'ul'
            }),
            b = this;
        m_helper.each(this._getItems(this._item), function (f) {
            var g = b._createItem('li', f.id, f.text, f.selected);
            a.appendChild(g);
            var h = g.querySelector('input[type=checkbox]');
            f.multiselectElement = h, h.dataset.multiselectElement = JSON.stringify(f)
        });
        var c = this._createItem('span', -1, 'Select all'),
            d = m_helper.div({
                id: this._getItemListIdentifier(),
                class: 'multiselect-list'
            });
        return d.appendChild(c), d.appendChild(m_helper.create({
            tag: 'hr'
        })), d.appendChild(a), d
    },
    _createItem: function (a, b, c) {
        var f = m_helper.checkbox({
                class: 'multiselect-checkbox',
                data: {
                    val: b
                }
            }),
            g = m_helper.create({
                tag: 'span',
                class: 'multiselect-text'
            }),
            h = m_helper.create({
                tag: a
            }),
            j = m_helper.label();
        return g.className = 'multiselect-text', g.innerHTML = c, j.appendChild(f), j.appendChild(g), h.appendChild(j), h
    },
    _initSelectedFields: function () {
        var a = this._getItems().filter(function (c) {
            return c.selected
        });
        if (0 != a.length) {
            var b = this;
            m_helper.each(a, function (c) {
                b.select(c.id)
            })
        } else this.selectAll();
        this._hideList(this)
    },
    select: function (a) {
        this._toggle(a, !0)
    },
    deselect: function (a) {
        this._toggle(a, !1)
    },
    _toggle: function (a, b) {
        var c = this;
        a && (m_helper.each(document.getElementById(this._getIdentifier()).querySelectorAll('.multiselect-checkbox'), function (d) {
            d.dataset.val == a && (b && !d.checked ? (m_helper.check(d), c._onCheckBoxChange(d, c)) : !b && d.checked && (m_helper.uncheck(d), c._onCheckBoxChange(d, c)))
        }), c._updateText(c))
    },
    selectAll: function () {
        var b = document.querySelector('#' + this._getIdentifier() + ' .multiselect-checkbox');
        m_helper.check(b), this._onCheckBoxChange(b, this), this._updateText(this)
    },
    deselectAll: function () {
        var a = document.querySelector('#' + this._getIdentifier() + ' .multiselect-checkbox');
        m_helper.uncheck(a), this._onCheckBoxChange(a, this), this._updateText(this)
    },
    _appendEvents: function () {
        var a = this;
        document.getElementById(a._getInputFieldIdentifier()).addEventListener('focus', function (c) {
            a._showList(a), document.getElementById(a._getInputFieldIdentifier()).value = '', m_helper.each(window.multiselects, function (d) {
                document.getElementById(d._getItemListIdentifier()).offsetParent && m_helper.parent(c.target, d._getIdentifier()) && d._hideList(a)
            })
        }), document.getElementById(a._getInputFieldIdentifier()).addEventListener('click', function () {
            a._showList(a), document.getElementById(a._getInputFieldIdentifier()).value = ''
        }), document.getElementById(a._getIdentifier()).addEventListener('click', function (c) {
            c = c || window.event;
            var d = c.target || c.srcElement;
            m_helper.parent(d, a._getIdentifier()) && c.stopPropagation()
        }), document.getElementById(a._getItemListIdentifier()).addEventListener('mouseover', function () {
            a._showList(a)
        }), m_helper.each(document.getElementById(a._getIdentifier()).querySelectorAll('.multiselect-checkbox'), function (c) {
            c.addEventListener('change', function (d) {
                a._onCheckBoxChange(c, a, d)
            })
        });
        var b = function () {
            var c = this.value.toLowerCase();
            if (!c || '' == c) m_helper.show(document.querySelector('#' + a._getItemListIdentifier() + ' > span')), m_helper.show(document.querySelector('#' + a._getItemListIdentifier() + ' > hr')), m_helper.showAll(document.querySelectorAll('#' + a._getItemListIdentifier() + ' li'));
            else {
                m_helper.hide(document.querySelector('#' + a._getItemListIdentifier() + ' > span')), m_helper.hide(document.querySelector('#' + a._getItemListIdentifier() + ' > hr'));
                var d = Array.prototype.filter.call(document.querySelectorAll('#' + a._getItemListIdentifier() + ' li span'), function (f) {
                    return -1 < f.innerHTML.toLowerCase().indexOf(c)
                });
                m_helper.hideAll(document.querySelectorAll('#' + a._getItemListIdentifier() + ' li')), m_helper.each(d, function (f) {
                    m_helper.show(f.parentElement.parentElement)
                })
            }
        };
        document.getElementById(a._getInputFieldIdentifier()).addEventListener('propertychange', b), document.getElementById(a._getInputFieldIdentifier()).addEventListener('input', b)
    },
    _onCheckBoxChange: function (a, b) {
        a.dataset.multiselectElement ? (b._performSelectItem(a, b), b._updateSelectAll(b)) : b._performSelectAll(a, b), b._forceUpdate()
    },
    _performSelectItem: function (a, b) {
        var c = JSON.parse(a.dataset.multiselectElement);
        a.checked ? (b._itemCounter++, m_helper.select(this._item.options[c.index]), m_helper.setActive(a.parentElement.parentElement)) : (b._itemCounter--, m_helper.deselect(this._item.options[c.index]), m_helper.setUnactive(a.parentElement.parentElement))
    },
    _performSelectAll: function (a, b) {
        var c = b._getItems();
        a.checked ? (b._itemCounter = c.length, m_helper.each(c, function (d) {
            m_helper.setActive(d.multiselectElement.parentElement.parentElement), m_helper.select(b._item.options[d.index]), m_helper.check(d.multiselectElement)
        })) : (b._itemCounter = 0, m_helper.each(c, function (d) {
            d.multiselectElement.parentElement.parentElement.classList.remove('active'), b._item.options[d.index].removeAttribute('selected'), m_helper.uncheck(d.multiselectElement)
        }))
    },
    _updateSelectAll: function (a) {
        var b = document.getElementById(a._getItemListIdentifier()).querySelector('input[type=checkbox]');
        a._itemCounter == a._getItems().length ? b.checked = !0 : b.checked && (b.checked = !1)
    },
    _hideList: function (a, b) {
        m_helper.setUnactive(document.getElementById(a._getItemListIdentifier())), m_helper.show(document.getElementById(a._getItemListIdentifier()).querySelector('span')), m_helper.show(document.getElementById(a._getItemListIdentifier()).querySelector('hr')), m_helper.showAll(document.getElementById(a._getItemListIdentifier()).querySelectorAll('li')), a._updateText(a), b && b.stopPropagation()
    },
    _updateText: function (a) {
        var b = document.getElementById(a._getItemListIdentifier()).querySelectorAll('ul .active');
        var naam = this._getItemUniqueIdentifier()
        if (0 < b.length) {
            for (var c = '', d = 0; d < (5 > b.length ? b.length : 5); d++) c += b[d].innerText + ', ';
            //c = c.substr(0, c.length - 2), 20 < c.length && (c = c.substr(0, 17) + '...')
            c = naam

        }
        b.length == document.getElementById(a._getItemListIdentifier()).querySelectorAll('ul li').length && (c = naam), document.getElementById(a._getInputFieldIdentifier()).value = c ? c : naam
    },
    _showList: function (a) {
        m_helper.setActive(document.getElementById(a._getItemListIdentifier()))
    },
    _forceUpdate: function () {
        var a = document.getElementById(this._getInputBadgeIdentifier());
        if (a.style.visibility = 'hidden', 0 != this._itemCounter) {
            a.innerHTML = this._itemCounter, a.style.visibility = 'visible';
            var b = a.nextElementSibling;
            10 > this._itemCounter ? (a.style.left = '-45px', b.style.marginLeft = '-42px') : 100 > this._itemCounter ? (a.style.left = '-50px', b.style.marginLeft = '-47px') : 1e3 > this._itemCounter ? (a.style.left = '-55px', b.style.marginLeft = '-52px') : 1e4 > this._itemCounter && (a.style.left = '-60px', b.style.marginLeft = '-57px')
        }
    },
    _items: void 0,
    _itemCounter: 0,
    _getItems: function () {
        if (this._items == void 0) {
            for (var d, a = [], b = this._item.options, c = 0; c < b.length; c++) d = {
                id: b[c].value,
                index: c,
                text: b[c].innerHTML,
                selected: !!b[c].selected,
                selectElement: b[c]
            }, a.push(d);
            this._items = a
        }
        return this._items
    },
    _getItemUniqueIdentifier: function () {
        var a = this._item.getAttribute('id'),
            b = this._item.getAttribute('name');
        if (!(a || b)) throw 'Multiselect: object does not contain any identifier (id or name)';
        return a ? a : b
    },
    _getIdentifier: function () {
        return this._getItemUniqueIdentifier() + '_multiSelect'
    },
    _getInputFieldIdentifier: function () {
        return this._getItemUniqueIdentifier() + '_input'
    },
    _getItemListIdentifier: function () {
        return this._getItemUniqueIdentifier() + '_itemList'
    },
    _getInputBadgeIdentifier: function () {
        return this._getItemUniqueIdentifier() + '_inputCount'
    }
}, window.multiselects = [], 'undefined' == typeof $ ? (document.multiselect = function (a) {
    var b = [];
    return window.multiselects._items || (window.multiselects._items = []), m_helper.each(document.querySelectorAll(a), function (c) {
        var d = window.multiselects._items.indexOf(c);
        if (-1 == d) {
            var f = new Multiselect(c);
            window.multiselects.push(f), window.multiselects._items.push(c), b.push(f)
        } else b.push(window.multiselects[d])
    }), 1 == b.length ? b[0] : b
}, window.onclick = function (a) {
    hideMultiselects(a)
}) : ($.fn.multiselect = function () {
    var a = [];
    return window.multiselects._items || (window.multiselects._items = []), 0 != this.length && $(this).each(function (b, c) {
        var d = window.multiselects._items.indexOf(c);
        if (-1 == d) {
            var f = new Multiselect(c);
            window.multiselects.push(f), window.multiselects._items.push(c), a.push(f)
        } else a.push(window.multiselects[d])
    }), 1 == a.length ? a[0] : $(a)
}, $(document).click(function (a) {
    hideMultiselects(a)
}));

function hideMultiselects(a) {
    m_helper.each(window.multiselects, function (b) {
        document.getElementById(b._getItemListIdentifier()).offsetParent && !m_helper.parent(a.target, b._getIdentifier()) && b._hideList(b, a)
    })
}
