# Конфигурация 11ty для insales

## Установка и запуск

```
npm install
npm start
```

В консоли будет написан адрес сервера разработки, например `http://localhost:8080/`.

Внимание: по этому адресу отображается файл `src/index.html`, который не используестя 
в данной конфигурации. Для доступа к индивидуальным шаблонам используйте адреса вида 
`http://localhost:8080/templates/` или `http://localhost:8080/templates/co-checkout/`. 
По данным адресам отобразятся шаблоны из файлов `src/templates/index.liquid` и 
`src/templates/co-checkout.liquid` соответственно.

## Что это?

11ty - сборщик статических сайтов, поддерживающий шаблонизатор liquid. 
В данном репозитории представлен пример конфигурации 11ty, которую можно 
использовать на этапе верстки сайта для insales. Использование 11ty 
позволяет с одной стороны работь локально (без аплода в insales), а с другой - 
даёт возможность использовать liquid уже на этапе верстки.

Такой подход хорошо работает если вы верстаете магазин с нуля, а не
модифицируте существующую стандартную тему. При верстке с нуля,
создание магазина на insales можно разделить на следующие этапы:

1. Создание дизайн-макетов (figma, xd, sketch, etc.). 
2. Верстка дизайна в HTML.
3. Привязка к insales:
3.1. Создание шаблонов и лейаутов.
3.2. Содание виджетов.
3.3. Создание примитивов insales: меню, страницы, блоги, блоки и т.д.
3.4. Настройка insales и привязка внешних сервисов.

Использование 11ty занчительно упрощает (а иногда полностью упраздняет) шаги 3.1, 3.2, 3.3. 

## Возможности конфигурации

Одно из перимуществ использования 11ty, что уже на этапе верстки можно использовать файловую структуру темы, близкую к финальной: можно создавать шаблоны, использовать сниппеты и виджеты.

При верстке виджетов автоматически добавляется обертка `<div class="layout"><div class="layout__content"></div></div>` и уникальный класс виджета, как в insales. Это позволяет использовать в CSS те же селекторы, что в insales. Также можно использовать
snippet.scss внутри директории виджета. 

В 11ty реализована функция подстановки данных (переменных) в шаблон. Данные 
задаются в json файле, а затем становятся видны в liquid в виде переменных.
Это позволяет имитировать данные insales, например, глобальные переменные
insales: меню, блоки, товары, данные клиента и т.д. Подробнее о том, как работать
с данными в 11ty: https://www.11ty.dev/docs/data/ (обязательно к прочтению).

## Использование конфигурации

### Шаблоны, лейауты, сниппеты

Шаблоны располагаются в папке `/src/templates`. В отличие от insales, лейауты располагаются
в отдельной папке `/src/layouts`. Лейауты, лежащие в папке `layouts` почти полностью повторяют 
стандартные лейауты insales, их можно использовать в insales без изменений.

Сниппеты располагаются в папке `/src/snippets`. Вставлять сниппеты можно при помощи того 
же тега, что и в insales: `{% include "head" %}`. В папке `snippets` есть ряд "системных"
сниппетов, при привязке темы к insales их копировать не нужно. Они нужны только локально, 
потому что лейаутах присутствуют вызовы системных сниппетов.

### Тег widget

Виджеты располагаются в папке `src/widget_types`. Для вставки виджета используется тег widget.
Тег widget в insales имеет другой синтаксис, по сравнению с тегом, раелизованным в данной
конфигурации 11ty.

В insales все параментры виджета переются в видео объекта widgetDrop:
```
{% widget widgetDrop %}
```

Работа в liquid с объектами типа widgetDrop затруднительна, поэтому, был реализован
другой синтаксис для widget:
```
{% widget "demo_poster", image: "../uploads/home1.jpg", title: "SW 24 / Новое поступление" %}
```
Первый параметр - тип виджета, далее передаются переменные, которые могут быть использованы
в liquid коде виджета. 

### Тег wrapwidget

Иногда при верстке (особенно на начальных этапах) удобнее работать с HTML кодом виджета
прямо внутри кода шалона, а не выделять виджет в отдельную папку внутри `widget_types`. 
В таких случаях можно оспользовать тег widget_wrap.

Тег добавляет обертку `<div class="layout"><div class="layout__content"></div></div>`
вокруг HTML кода виджета и добавляет правильный CSS класс виджета. При этом код виджета 
остаётся на той же странице.

Такой liquid код:
```liquid
{% wrapwidget 'demo_b_image' %}
<div class="b-image">
    <img src="/uploads/brand1.jpg" alt="">
</div>
{% endwrapwidget %}
```

будет преобразован в HTML:
```html
<div class="layout widget_type_demo_b_image">
    <div class="layout__content">
        <div class="b-image">
            <img src="/uploads/brand1.jpg" alt="">
        </div>
    </div>
</div>
```

Использование этого тега не обязательно, можно сразу выделять виджеты в отдельные файлы.

### Фиктивная среда insales

В конфигурации создан ряд объектов и файлов, которые частично повторяют среду 
insales, чтобы приблизить среду, в которой верстается тема к среде, в которой
она будет работать на серверах insales.

1. Фиктивные данные insales содержаться в папке `/src/_data`, а также в json файлах в папке `/src/templates`.
2. "Системные" сниппеты в папке `/src/snippets`.
3. Стандартные стили insales в папке `/src/insales`. Это полная копия соотвествующих файлов в insales, они подключаются автоматически. Эти файлы не нужно редактировать. Они полезны, если вы переопределяете стили личного кабинета.

### Стилизация личного кабинета

В папке `/src/templates/client_account` для примера помещен файл `orders.liquid`. Содержимое этого файла скопировано с сайта insales (HTML код страницы "Личный кабинет - Заказы"). Далее можно использовать этот шаблон локально для стилизации страницы заказов в личном кабинете. Аналогичном образом можно добавить другие страницы личного кабинета и стилизовать их локально.