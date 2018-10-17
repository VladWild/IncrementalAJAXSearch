function View(model) {
    this.model = model;

    this.search = document.getElementById('search-field');
    this.variants = document.getElementById('variants');

    this.init = function () {
        let that = this;

        /*отправки наблюдателям подписанных элементов*/
        function subscription(){
            that.model.onSearcher.subscribe(function (variants) {
                that.showVariantsText(variants);
            })
        }

        /*добавление событий элементам*/
        function event(){
            that.search.onkeyup = function () {
                that.model.search(new Message(this.value));
            }
        }

        subscription();
        event();
    }
}

/*отображение данных*/
View.prototype = {
    showVariantsText: function(variants){
        this.variants.innerHTML = variants.reduce(function (all, current) {
            return all + '<li>' + current + '<li>';
        }, '');
    }
};

