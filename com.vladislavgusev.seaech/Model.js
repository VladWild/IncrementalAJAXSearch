function Model() {
   this.view = new View(this);

   this.onSearcher = new EventEmitter();

    this.start = function () {
        this.view.init();
    }
}

Model.prototype = {
    search: function(text){
        /*тут AJAX-запрос к серверу и получение
        всех наиболее вероятных вариантов поиска*/

        let that = this;

        JSONServerConnection().then(function (response){
            return JSON.parse(response);        //парсим полученные данные из JSON-файла
        }).then(function(obj) {
            return obj.search;                  //получаем объект search из JSON-файла
        }).then(function(search) {
            //получаем все возможные варианты поиска текста
            return search.map(function (obj) {
                return obj.text;
            });
        }).then(function (allVariants) {
            return that.filters.search(allVariants, text);      //фильтруем все варианты на нужные нам
        }).then(function (allVariants) {
            return that.filters.emptyText(allVariants, text);   //проверяем текст на не пустоту
        }).then(function (findVariants) {
            that.onSearcher.notify(findVariants);               //посылаем все отфильтрованные варианты в listener
        }).catch(function(error){
            console.log(error);
        });
    }
};

Model.prototype.filters = {
    search: function (arr, text) {
        return arr.filter(variant => variant.indexOf(text) === 0)
    },
    emptyText: function (arr, text) {
        return text !== '' ? arr : [];
    }
};

