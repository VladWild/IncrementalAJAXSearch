function Message(text) {
    this.text = text;

    let date = new Date();
    this.getDate = function () {
        return date.getTime();
    };
}


