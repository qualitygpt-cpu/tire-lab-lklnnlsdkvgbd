# TireLab

TireLab — статический web-проект (HTML/CSS/JS) для расчета и визуализации **reduced-модели деформации автомобильной шины**.

Ниже — подробная карта проекта: из каких файлов он состоит, как модули связаны друг с другом, какие функции вызывают другие функции и за что отвечают.

---

## 1) Быстрый обзор архитектуры

Проект разделен на две страницы:

- **Корневая страница (`index.html`)** — информационный лендинг о проекте.
- **Dev-приложение (`app/index.html`)** — рабочий расчетный интерфейс с параметрами, solver-ядром и графиками.

Логика dev-приложения организована по слоям:

1. **UI-слой** (`app/src/ui/*`) — ввод параметров, пресеты, вывод подсказок.
2. **Слой состояния/инициализации** (`app/src/state.js`, `app/src/model/params.js`, `app/src/model/units.js`).
3. **Расчетное ядро** (`app/src/model/geometry.js`, `contact.js`, `brush.js`, `solver.js`, `results.js`).
4. **Слой визуализации** (`app/src/render/*`) — канвас-рендеринг шины, пятна контакта и графиков.
5. **Оркестратор приложения** (`app/src/app.js`) — связывает все шаги «ввод → расчет → метрики → отрисовка».

Модули подключаются в `app/index.html` как обычные `<script>` и экспортируют API в `window.*` (например `window.TireLabSolver`, `window.TireLabWheelView`).

---

## 2) Структура репозитория

```text
.
├─ README.md
├─ index.html                  # лендинг проекта
├─ styles.css                  # стили лендинга
├─ src/
│  └─ app.js                   # timestamp на лендинге
│
├─ app/
│  ├─ index.html               # основное dev-приложение
│  ├─ app.css                  # стили dev-приложения
│  └─ src/
│     ├─ app.js                # главный orchestrator
│     ├─ state.js              # создание initial state
│     ├─ model/
│     │  ├─ params.js          # определения параметров + defaults
│     │  ├─ units.js           # нормализация и перевод единиц
│     │  ├─ geometry.js        # геометрия колеса и контакт по penetration
│     │  ├─ contact.js         # деформации/кривизна/вспомогательные поля
│     │  ├─ brush.js           # brush-модель касательных напряжений
│     │  ├─ solver.js          # итерационный решатель
│     │  └─ results.js         # агрегирование итоговых метрик
│     ├─ render/
│     │  ├─ colors.js          # палитра и функции смешивания цветов
│     │  ├─ wheelView.js       # вид сбоку деформированной шины
│     │  ├─ contactPatchView.js# вид сверху пятна контакта
│     │  └─ plotView.js        # графики epsilon, p(x), tau_x/tau_y
│     └─ ui/
│        ├─ controls.js        # рендер/чтение/обновление контролов
│        ├─ presets.js         # сценарии расчета + checklist
│        └─ report.js          # legacy helper форматирования отчета
│
├─ legacy/
│  ├─ tire_reduced_fem_model_original.html
│  ├─ tire_reduced_fem_model.html
│  └─ README.md
│
├─ docs/
│  ├─ model-architecture.md
│  ├─ model-assumptions.md
│  ├─ verification-plan.md
│  ├─ legacy-migration-plan.md
│  └─ roadmap.md
│
└─ tests/
   ├─ manual-test-cases.md
   └─ reference-cases.md
```

---

## 3) Связи между файлами (кто кого вызывает)

## 3.1 Точка входа dev-приложения

`app/index.html` подключает скрипты в строгом порядке:

1. Модель параметров и единиц (`params.js`, `units.js`)
2. Состояние (`state.js`)
3. Математические модули (`geometry.js`, `contact.js`, `brush.js`, `solver.js`, `results.js`)
4. Рендер (`colors.js`, `wheelView.js`, `contactPatchView.js`, `plotView.js`)
5. UI-модули (`controls.js`, `presets.js`, `report.js`)
6. Главный модуль `app/src/app.js`

Это важно: `app/src/app.js` ожидает, что глобальные объекты `window.TireLab*` уже существуют.

---

## 3.2 Главный поток выполнения

После `DOMContentLoaded` в `app/src/app.js`:

- запрашиваются определения параметров:
  - `TireLabParams.getDefaultParameterDefinitions()`
- берутся дефолты/пресеты:
  - `TireLabPresets.getDefaults()`
  - `TireLabPresets.getAll()`
- строятся контролы:
  - `TireLabControls.render()`
  - `TireLabControls.write()`
  - `TireLabControls.updateLabels()`

При запуске расчета (`runAndRender`):

1. `TireLabControls.read(defs)` → сырые значения `raw`.
2. `TireLabSolver.run(raw, {})` → полный расчет `state`.
3. `TireLabResults.computeResults(state)` → агрегированные KPI.
4. `renderVisuals(state)` вызывает:
   - `TireLabWheelView.render(...)`
   - `TireLabContactPatchView.render(...)`
   - `TireLabPlotView.renderStrain(...)`
   - `TireLabPlotView.renderPressure(...)`
   - `TireLabPlotView.renderShear(...)`

Именно этот файл связывает **UI ↔ solver ↔ визуализацию**.

---

## 4) Расчетное ядро: назначение файлов и функции

## 4.1 `app/src/model/params.js`

Назначение:

- хранит список параметров для UI (ключ, подпись, диапазон, шаг, единица измерения, default).

API:

- `getDefaultParameterDefinitions()` — возвращает массив описаний параметров для отрисовки controls.
- `createRawDefaults()` — формирует объект «сырых» дефолтов (`raw`), включая `nodes`.

---

## 4.2 `app/src/model/units.js`

Назначение:

- преобразует входные параметры пользователя в вычислительный набор `p` в СИ.

Ключевая функция:

- `normalizeParams(raw)`:
  - приводит значения к Number;
  - считает производные величины: `W`, `Ntarget`, `R0`, `b`, `EA`, `kr`, `ky`, `kb`, `kc`, `dphi`, `ds`, `Tp`, углы в радианах и т.д.

Связи:

- вызывается из `TireLabSolver.initialize()`.

---

## 4.3 `app/src/state.js`

Назначение:

- создает начальное состояние расчетной задачи.

Ключевая функция:

- `createInitialState(params)`:
  - создает массивы `phi`, `w`, `u`, `y` длины `N`;
  - инициализирует положение центра колеса `Cz`;
  - возвращает state: `{ p, phi, w, u, y, Cz, iteration, residual }`.

Связи:

- вызывается из `TireLabSolver.initialize()`.

---

## 4.4 `app/src/model/geometry.js`

Назначение:

- рассчитывает текущую геометрию узлов колеса и параметры контакта с дорогой.

Ключевая функция:

- `computeGeometry(state)`:
  - формирует координаты `x`, `z`;
  - рассчитывает penetration `pen` и контактное давление `pc = kc * pen`;
  - интегрирует нормальную силу `Fn`;
  - определяет границы пятна `xmin/xmax`, число контактных узлов `c`, `maxPen`.

Связи:

- вызывается в каждой итерации решателя из `solver.js`.
- результат затем используется `contact.js`, `brush.js`, рендером и агрегатором результатов.

---

## 4.5 `app/src/model/contact.js`

Назначение:

- рассчитывает поля деформации и производные по окружности, необходимые решателю.

Ключевая функция:

- `computeContact(state, geometry)`:
  - считает `eps` (окружная деформация), `chi` (кривизна), `duf` (вспомогательная производная);
  - вычисляет `maxE` и текущую длину контакта `L`.

Связи:

- вызывается из `solver.iterate()` сразу после `computeGeometry()`.
- `eps/maxE` используются рендером `wheelView.js` для цветовой индикации.

---

## 4.6 `app/src/model/brush.js`

Назначение:

- реализует brush-приближение касательных напряжений в пятне контакта.

Ключевая функция:

- `computeBrushForces(state, geometry, contact)`:
  - считает локальные сдвиги `qx`, `qy`;
  - считает напряжения `tx`, `ty`;
  - ограничивает их трением (`mu * p`), помечает режим `slip` (stick/transition/slide);
  - интегрирует глобальные силы `Fx`, `Fy`, момент `Mz`, коэффициент насыщения `maxR`.

Связи:

- вызывается из `solver.iterate()`.
- `tx/ty/slip` далее читают `contactPatchView.js` и `plotView.js`.

---

## 4.7 `app/src/model/solver.js`

Назначение:

- итерационно решает связанную задачу деформации/контакта/сдвига.

Основные функции:

- `initialize(rawParams)`:
  - `normalizeParams(rawParams)`
  - `createInitialState(normalized)`
- `iterate(state)`:
  1. `computeGeometry(state)`
  2. `computeContact(state, geometry)`
  3. `computeBrushForces(state, geometry, contact)`
  4. обновляет `w/u/y` через дискретные уравнения и демпфирование
  5. корректирует `Cz` по ошибке нормальной силы
  6. обновляет `iteration` и `residual`
- `run(rawParams, options)`:
  - создает initial state,
  - выполняет `iterate` заданное число шагов,
  - сохраняет последний snapshot в `state.last`.

Это центральный модуль всей вычислительной цепочки.

---

## 4.8 `app/src/model/results.js`

Назначение:

- собирает удобный для UI набор итоговых метрик.

Ключевая функция:

- `computeResults(state)` возвращает:
  - баланс сил: `targetNormalForce`, `calculatedNormalForce`, `normalForceError`;
  - тягово-боковые показатели: `Fx`, `Fy`, `Mz`;
  - геометрию: `minimumW`, `maximumYAbs`, `contactPatchLength`, `contactPatchArea`;
  - контакт: `maxContactPressure`, `tauMuPRatio`;
  - численные показатели: `solverIterations`, `residual`.

Связи:

- вызывается из `app/src/app.js` для заполнения карточек результатов.

---

## 5) Визуализация: назначение файлов и связи

- `render/colors.js`:
  - содержит палитру и функции `mix`, `epsColor`, `clamp`.
  - используется в `wheelView.js`, `contactPatchView.js`, `plotView.js`.

- `render/wheelView.js`:
  - `render(canvas, state)` рисует вид сбоку:
    - исходный/деформированный контур,
    - диск,
    - контактную зону,
    - цветовую карту деформации по `contact.eps`.

- `render/contactPatchView.js`:
  - `render(canvas, state)` рисует вид сверху пятна;
  - использует `brush.slip`, чтобы показать зоны сцепления/перехода/скольжения.

- `render/plotView.js`:
  - `renderStrain(canvas, state)` — график `epsilon`;
  - `renderPressure(canvas, state)` — `p(x)`;
  - `renderShear(canvas, state)` — `tau_x` и `tau_y`.

Все эти функции вызываются только из `renderVisuals()` в `app/src/app.js`.

---

## 6) UI-слой

- `ui/controls.js`:
  - `render()` строит HTML-слайдеры;
  - `read()` собирает ввод пользователя в `raw`;
  - `write()` программно устанавливает значения;
  - `updateLabels()` обновляет подписи рядом со слайдерами.

- `ui/presets.js`:
  - хранит список сценариев и текст «Что проверить»;
  - `getAll()`, `getById()`, `applyToRaw()` применяют выбранный сценарий.

- `ui/report.js`:
  - вспомогательный форматтер `ReportUI.formatResults(...)`;
  - в текущем `app/src/app.js` не является критичным звеном основного вывода.

---

## 7) Корневая страница и legacy-часть

- `index.html` + `styles.css` + `src/app.js`:
  - отдельная информационная страница,
  - `src/app.js` только проставляет timestamp загрузки.

- `legacy/*`:
  - сохраненные historical-версии однофайлового прототипа;
  - нужны как baseline для сравнения поведения модели.

---

## 8) Поток данных «от параметров к графикам»

1. Пользователь меняет controls/preset.
2. `controls.read()` формирует `raw`.
3. `solver.initialize()` → `units.normalizeParams()` + `state.createInitialState()`.
4. `solver.run()` много раз вызывает `solver.iterate()`.
5. `iterate()` на каждом шаге пересчитывает `geometry → contact → brush` и обновляет поля состояния.
6. После завершения `results.computeResults()` формирует метрики для карточек.
7. Рендер-модули читают `state.last` и строят канвас-графику.

---

## 9) Запуск и ручная проверка

- Быстрый запуск: открыть `app/index.html` в браузере.
- Для регрессии использовать сценарии в UI и сверяться с:
  - `tests/reference-cases.md`
  - `tests/manual-test-cases.md`

---

## 10) Важные ограничения модели

Текущая модель — **упрощенная reduced-постановка**, а не полноразмерный 3D FEM.
Ее нужно использовать для качественного анализа трендов и инженерных гипотез, но не для сертификационных расчетов без отдельной валидации.
