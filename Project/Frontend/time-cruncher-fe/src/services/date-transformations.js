class DateController {
    constructor() {
        this.monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec']
    }

    toInputFormat(date) {
        const year = date.getFullYear()
        let month = this.monthNames[date.getMonth()]
        let day = date.getDate()
        day = day < 10 ? `0${day}` : day
        return `${day}-${month}-${year}`
    }

    toString(date) {
        const year = date.getFullYear()
        let month = date.getMonth() + 1
        month = month < 10 ? `0${month}` : month
        let day = date.getDate()
        day = day < 10 ? `0${day}` : day
        return `${year}-${month}-${day}`
    }
}

export const dateController = new DateController()