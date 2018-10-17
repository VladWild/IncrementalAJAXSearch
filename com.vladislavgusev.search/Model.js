function Model() {
   this.lastTimeMsg = new Date().getTime();

   this.onSearcher = new EventEmitter();
}

Model.prototype = {
    search: function(message){
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
            return that.filters.search(allVariants, message.text);      //фильтруем все варианты на нужные нам
        }).then(function (allVariants) {
            return that.filters.emptyText(allVariants, message.text);   //проверяем текст на не пустоту
        }).then(function (allVariants) {
            let currentTimeMsg = message.getDate();             //берем время из присланного сообщения
            if (currentTimeMsg > that.lastTimeMsg) {
                that.lastTimeMsg = currentTimeMsg;              //сохраняем время последнего запроса
                return allVariants;
            } else {
                throw new Error("Request is not relevant");     //запрос не актуален
            }
        }).then(function (findVariants) {
            that.onSearcher.notify(findVariants);               //посылаем все отфильтрованные варианты в listener
        }).catch(function(error){
            that.onSearcher.notify([]);
            console.error(error);
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

