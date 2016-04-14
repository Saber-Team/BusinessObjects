/**
 * @file datepicker
 * @author jinwei01
 */
;(function (UI) {

    var idCounter = 0

    // class conf
    var selectedClass = 'selected'
    var disabledClass = 'disabled'
    var hiddenClass   = 'hidden'

    // conf
    var defaultConf = {
        field       : null,
        triggerEvent: 'click',
        autohide    : true,

        yearRange: [2000, 2020],
        minDate  : undefined,

        // custom class
        theme: undefined,

        // date range
        startRange: undefined,
        endRange  : undefined,

        // events
        onShow  : loop,
        onSelect: loop,
        onClose : loop,
        onDraw  : loop,

        format: 'yyyy/mm/dd',
        i18n  : {
            yearUnit: '年',
            months  : ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            days    : ['日', '一', '二', '三', '四', '五', '六'],
        }
    }

    // datepicker structure
    var pickerTpl = [
        '<div class="zdh-datepicker" style="display: none">',
            '<div class="datepicker-header">',
                '<i class="datepicker-prev"></i>', // prev
                '<div class="datepicker-select datepicker-year">', // year select
                    '<label></label>',
                    '<select></select>',
                '</div>',
                '<div class="datepicker-select datepicker-month">', // month select
                    '<label></label>',
                    '<select></select>',
                '</div>',
                '<i class="datepicker-next"></i>', // next
            '</div>',
            '<table class="datepicker-calendar">',
                '<thead>',
                    '<tr class="datepicker-dayofweek"></tr>', // week
                '</thead>',
                '<tbody class="datepicker-days"></body>', // grid
            '</table>',
        '</div>'
    ].join('')

    function loop () {}

    function getSizeOfMonth (month, year) {
        var isLeapYear = year % 4 === 0 && year % 100 !== 0 || year % 400 === 0
        return [31, (isLeapYear ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
    }

    function zeroPad (str, len) {
        len = len || 2
        return ('0' + str).slice(-len)
    }

    function getNow () {
        return new Date()
    }

    function toDate (dateString) {
        if (!dateString) {
            return null
        }
        if (dateString instanceof Date) {
            return dateString
        }
        return new Date(dateString)
    }

    function toDateString (date, format) {
        var map = {
            'm': date.getMonth() + 1,
            'd': date.getDate()
        }

        format = format || defaultConf.format

        return format.toLowerCase().replace(/([ymd])+/g, function(match, p){
            var v   = map[p]
            var ret = match
            if (v) {
                ret = zeroPad(v, match.length)
            } else {
                if (p === 'y') {
                    ret = (date.getFullYear() + '').substr(4 - match.length)
                }
            }
            return ret
        })
    }

    function Datepicker (opt) {
        if (!(this instanceof Datepicker)) {
            return new Datepicker(opt)
        }
        opt = opt || {}
        $.extend(this, defaultConf, opt)
        this.uniqueId = idCounter++
        this.init()
    }

    Datepicker.prototype = {
        constructor: Datepicker,

        // create picker
        init: function () {
            if (!this.inited) {
                this.picker      = $(pickerTpl)
                this.header      = $('.datepicker-header', this.picker)
                this.calendar    = $('.datepicker-calendar', this.picker)
                this.prevNav     = $('.datepicker-prev', this.header)
                this.nextNav     = $('.datepicker-next', this.header)
                this.yearLabel   = $('.datepicker-year label', this.header)
                this.yearSelect  = $('.datepicker-year select', this.header)
                this.monthLabel  = $('.datepicker-month label', this.header)
                this.monthSelect = $('.datepicker-month select', this.header)
                this.weekRow     = $('.datepicker-dayofweek', this.calendar)
                this.dateGrid    = $('.datepicker-days', this.picker)

                // add picker to page
                $('body').append(this.picker)

                //custom
                this.theme && this.picker.addClass(this.theme)

                // flag for first time show
                this.firstShown = true

                // fill
                this.fillYear()
                this.fillMonth()
                this.fillWeekday()

                // bind events
                this.bind()

                this.inited = true
            }
        },

        show: function () {
            this.actived = true
            // set Date
            this.setDate(this.field && this.field.val() ? new Date(this.field.val()) : undefined)
            // show
            this.picker.css('display', 'block')
            // position
            this.setPosition()
            // call show callback
            this.onShow();
        },

        close: function () {
            this.actived = false
            this.picker.css('display', 'none')
            // call close callback
            this.onClose()
        },

        setDate: function (date) {
            var d = date

            if (this.firstShown) { // first time show
                date = date || getNow()
                this.firstShown = false
            }

            if (!date) {
                return
            }

            if (this.minDate) {
                date = toDate(Math.max(date, this.minDate))
            }

            this.pickYear(date.getFullYear())
            this.pickMonth(date.getMonth())

            // fill grid
            this.fillDate()

            // auto pick the date (if has)
            d && this.pickDate(date.getDate())
        },

        getDate: function () {
            return toDate([this.year, zeroPad(this.month + 1), zeroPad(this.date)].join('/'))
        },

        getDateString: function () {
            return toDateString(this.getDate(), this.format)
        },

        setMinDate: function (date) {
            this.minDate = date
            this.fillDate()
        },

        setMaxDate: function () {

        },

        setRange: function (start, end) {
            this.startRange = start
            this.endRange   = end
            this.fillDate()
        },

        clearRange: function () {
            this.startRange = null
            this.endRange   = null
            this.fillDate()
        },

        pickYear: function (year) {
            var range = this.yearRange

            this.yearSelect.val(this.year = year)
            this.yearLabel.html($('option[value="' + year + '"]', this.yearSelect).text())

            this.toggleNav()
        },

        pickMonth: function (month) {
            var newYear
            if (month < 0) {
                month = 11
                newYear = this.year - 1
            } else if (month > 11) {
                month = 0
                newYear = this.year + 1
            }

            this.monthSelect.val(this.month = month)
            this.monthLabel.html($('option[value="' + month + '"]', this.monthSelect).text())

            // do not repeat call toggleNav
            newYear ? this.pickYear(newYear) : this.toggleNav()
        },

        pickDate: function (date) { // 1-31
            var cell = $('td[date=' + date +']', this.dateGrid)

            this.date = date

            if (this.selectedCell) {
                this.selectedCell.removeClass(selectedClass)
            }

            this.selectedCell = cell

            cell.addClass(selectedClass)

            this.select()
        },

        // render year select
        fillYear: function () {
            var yearRange = this.yearRange
            var start     = yearRange[0]
            var end       = yearRange[1]
            var unit      = this.i18n.yearUnit
            var html      = []

            while (start <= end) {
                html.push('<option value="' + start + '">' + start + unit + '</option>')
                start++
            }
            this.yearSelect.html(html.join(''))
        },

        // render month select
        fillMonth: function () {
            var months = this.i18n.months

            months = months.map(function (month, index) {
                return '<option value="' + index + '">' + month + '</option>'
            })

            this.monthSelect.html(months.join(''))
        },

        // render weekdays
        fillWeekday: function () {
            var weekdays = this.i18n.days

            this.weekRow.html(
                weekdays.map(function (item) {
                    return '<th>' + item + '</th>'
                }).join('')
            )
        },

        // render dates
        fillDate: function () {
            var dateSize  = getSizeOfMonth(this.month, this.year)
            var start     = toDate([this.year, this.month + 1, '1'].join('/')).getDay()
            var dateIndex = 1
            var index     = 0
            var row       = 0
            var date

            var html     = ''
            var rowHtml  = []

            var ranged   = this.startRange && this.endRange
            var disabled = false
            var inrange  = false
            var clz      = []

            while (index <= 6 * 7) {
                clz = []
                if (index >= start && dateIndex <= dateSize) {
                    date = toDate([this.year, this.month + 1, dateIndex].join('/'))

                    disabled = date < this.minDate

                    if (ranged) {
                        inrange  = date >= this.startRange && date <= this.endRange
                    }

                    disabled && clz.push('disabled')
                    inrange && clz.push('inrange')

                    rowHtml.push(
                        '<td date="' + dateIndex + (clz.length ? ('" class="' + clz.join(' ') + '"'): '"') + '>' + dateIndex + '</td>'
                    )
                    dateIndex++
                } else {
                    rowHtml.push('<td></td>')
                }
                index++
                if (index % 7 === 0) {
                    row++
                    html += '<tr>' + rowHtml.join('') + '</tr>'
                    rowHtml = []
                }
            }

            this.dateGrid.html(html)

            delete this.selectedCell

            // call draw callback
            this.onDraw();
        },

        // enable/disable prev & next nav
        toggleNav: function () {
            var range = this.yearRange
            var year  = this.year
            var month = this.month

            this.nextNav.toggleClass(disabledClass, year >= range[1] && month === 11)
            this.prevNav.toggleClass(disabledClass, year <= range[0] && month === 0)
        },

        setPosition: function () {
            var field  = this.field
            var offset = field.offset()
            var width  = field.outerWidth()
            var height = field.outerHeight()

            this.picker.css({
                left: offset.left + 'px',
                top : (offset.top + height - 1) + 'px'
            })
        },

        select: function () {
            this.field.val(this.getDateString())
            this.onSelect && this.onSelect.call(this, this.getDate())
            this.autohide && this.close()
        },

        // bind events
        bind: function () {
            var me              = this
            var eventFromFiled  = false
            var eventFromPicker = false

            // show
            this.field.on(this.triggerEvent, function (e) {
                eventFromFiled = true
                setTimeout(function () {
                    eventFromFiled = false
                    !me.actived && me.show()
                }, 0)
            })

            // select year
            this.yearSelect.change(function () {
                me.pickYear(this.value * 1)
                me.fillDate()
            })

            // select month
            this.monthSelect.change(function () {
                me.pickMonth(this.value * 1)
                me.fillDate()
            })

            // prev month
            this.picker.on('click.datepicker.prev', '.datepicker-prev:not(.disabled)', function () {
                me.pickMonth(--me.month)
                me.monthSelect.trigger('change')
            })

            // next month
            this.picker.on('click.datepicker.next', '.datepicker-next:not(.disabled)', function () {
                me.pickMonth(++me.month)
                me.monthSelect.trigger('change')
            })

            // select
            this.picker.on('click.datepicker.select', 'td[date]:not(.selected):not(.disabled)', function (e) {
                me.pickDate($(e.target).attr('date') * 1)
            })

            // close
            this.picker.on('click', function (e) {
                eventFromPicker = true
                setTimeout(function () {
                    eventFromPicker = false
                }, 0)
            })
            $(document).on('click.datepicker.close.' + this.uniqueId, function () {
                me.actived && !eventFromFiled && !eventFromPicker && me.close()
            })
        },

        destroy: function () {
            this.picker.off('click')
            this.field.off(this.triggerEvent)
            this.yearSelect.off('change')
            this.monthSelect.off('change')
            this.picker.remove()

            $('document').off('click.datepicker.close.' + this.uniqueId)

            for (var k in this) {
                delete this[k]
            }
        }
    }

    UI.Datepicker = Datepicker
})(this.businessUI || (this.businessUI = {}))
