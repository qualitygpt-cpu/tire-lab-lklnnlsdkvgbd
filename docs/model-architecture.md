# Model Architecture (dev-version)

## Input layer
`app/src/ui/controls.js` собирает сырые пользовательские значения из формы.

## Units layer
`app/src/model/units.js` содержит конвертеры единиц и нормализацию размерностей.

## Geometry layer
`app/src/model/geometry.js` отвечает за начальное состояние и геометрию деформации.

## Contact layer
`app/src/model/contact.js` отвечает за построение геометрии пятна контакта.

## Brush/friction layer
`app/src/model/brush.js` предназначен для касательных сил и щеточной модели.

## Solver layer
`app/src/model/solver.js` содержит итерационный алгоритм расчета.

## Rendering layer
`app/src/render/` содержит слои визуализации: колесо, пятно контакта, графики.

## Report/export layer
`app/src/ui/report.js` формирует текстовый отчет по результатам для UI и будущего экспорта.
