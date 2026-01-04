# Лабораторно-практична робота №5-6
Розширення бекенд-додатку власними сутностями та реалізація REST API<br>

## Реалізовано три таблиці

### 1. Fields<br>
Зберігає поля для вирощування<br><br>
Поля: field_name - назва поля, area_hectares - площа поля в гектарах, soil_type - тир грунту на полі, field_location - місцезнаходження поля<br>
Усього 4 поля в таблиці.<br><br>

### 2. Crops<br>
Зберігає інформацію про посіви, які були чи є на полях зараз<br><br>
Поля: crop_id - айді посіву, field_name - назва поля, на якому цей посів (зовнішній ключ на таблицю Fields), cultivated_plant_name - культура на полі, crop_start_date - початок посіву,
crop_harvest_date - дата збирання посіву, actual_harvest_tons - фактичний врожай, crop_status - статус посіву<br><br>

Зв'язки: ManyToOne до таблиці Field. У одного поля може бути багато посівів за довгі роки, але у одного посіву роботи може бути лише одне поле.<br><br>

Усього 7 полів в таблиці<br><br>

### 3. Field works<br>
Зберігає інформацію про роботи, які виконуються над посівами (сівба, кошення і т. д.)<br><br>
Поля: work_id - айді роботи, crop_id - айді посіву для якого ця робота зроблена (зовнішній ключ на таблицю Crops), employee_id - айді робітника, machinery_id - айді техніки,
work_type - тип роботи, work_start_date - дата початку роботи, work_end_date - дата кінця роботи<br><br>

Зв'язки: ManyToOne до таблиці Crop. У одного посіву може бути багато робіт над полем, але у однієї роботи може бути лише один посів.<br><br>

Усього 7 полів в таблиці


## Реалізовані ендпоінти

### Fields (Поля для вирощування)
1. POST /auth/login<br>
Метод: POST<br>
URL: http://localhost:4000/v1/auth/login<br>
HEADERS:<br>
•	Content-Type: application/json <br>
PARAMS: немає параметрів<br>
BODY (raw JSON):<br>
{<br>
  "email": "ваш_email@example.com",    - обов'язково, строка<br>
  "password": "ваш_пароль"             - обов'язково, строка<br>
}<br>

<img width="974" height="483" alt="image" src="https://github.com/user-attachments/assets/27573c6e-e9fb-4789-b85a-cc57d1eca664" /><br><br>

2. POST /auth/register<br>
Метод: POST<br>
URL: http://localhost:4000/v1/auth/register<br>
HEADERS:<br>
•	Content-Type: application/json <br>
PARAMS: немає параметрів<br>
BODY (raw JSON):<br>

{<br>
  "email": "новий_email@example.com",   - обов'язково, строка, уникальный<br>
  "password": "новий_пароль",           - обов'язково, строка<br>
  "passwordConfirm": "новий_пароль",    - обов'язково, строка (должен совпадать с password)<br>
  "username": "Ім'я користувача",       - не обов'язково, строка, уникальный<br>
  "name": "Ваше Ім'я"                    - не обов'язково, строка<br>
}<br>
 
<img width="974" height="781" alt="image" src="https://github.com/user-attachments/assets/9e79daee-7eac-4081-a82e-004041480ba8" /><br><br>


3. GET /fields<br>
Метод: GET<br>
URL: http://localhost:4000/v1/fields<br>
HEADERS:<br>
•	Authorization: Bearer jwt_токен <br>
•	Content-Type: application/json <br>
PARAMS (Query Parameters):<br>
•	withCrops - не обов'язково. Якщо true - повертає поля разом з посівами (crops). Якщо false не вказан - повертає тільки поля без їх посівів<br>
BODY: нет тела<br><br>

Результат без посівів<br>
 
<img width="795" height="906" alt="image" src="https://github.com/user-attachments/assets/8c6716b5-ea92-4869-ad0c-bb0c9ba15c5a" /><br><br>

З посівами<br>

<img width="858" height="895" alt="image" src="https://github.com/user-attachments/assets/ba2da430-4a79-4cf3-b128-d4b369334e9a" />
<img width="817" height="639" alt="image" src="https://github.com/user-attachments/assets/ab3ffb7c-fdce-4e6a-80c6-f2e081b82397" /><br><br>


4. GET /fields/:field_name<br>
Метод: GET<br>
URL: http://localhost:4000/v1/fields/НАЗВА_ПОЛЯ<br>
headers:<br>
Authorization: Bearer ваш_jwt_токен<br>
Content-Type: application/json<br>
params (Path Parameters):<br>
• :field_name - обов'язково. Назва конкретного поля, яке потрібно отримати.<br>
params (Query Parameters):<br>
• withCrops - не обов'язково. Якщо true - повертає поле разом з його посівами. Якщо false - повертає тільки поле без посівів.<br>
• forUpdate - не обов'язково. Якщо true - повертає дані у форматі, зручному для оновлення (зазвичай без зв'язаних даних).<br>
body: немає тіла<br>

<img width="684" height="564" alt="image" src="https://github.com/user-attachments/assets/f26706bb-523d-46fe-96b5-2b35a01e8526" /><br><br>

5. POST /fields <br>
Метод: POST<br>
URL: http://localhost:4000/v1/fields<br>
headers:<br>
• Authorization: Bearer ваш_jwt_токен - обов'язково<br>
• Content-Type: application/json - обов'язково<br>
params: немає параметрів<br>
body (raw JSON):<br>

{<br>
  "field_name": "Назва поля",       - обов'язково, рядок, унікальне<br>
  "area_hectares": 10.5,               - обов'язково, число в гектарах<br>
  "soil_type": "чорнозем",             - обов'язково, одне з: "чорнозем", "супіщаний", "суглинковий", "піщаний", "торф'яний", "глинистий", "кам'янистий", "солончаковий", "болотистий"<br>
  "field_location": "Локація поля"     - обов'язково, рядок, унікальне<br>
}<br>

<img width="841" height="844" alt="image" src="https://github.com/user-attachments/assets/dfaed1e3-8446-4968-9ef5-96036fd0f499" /><br><br>

6. PUT /fields/:field_name - Оновити поле<br>
Метод: PUT<br>
URL: http://localhost:4000/v1/fields/НАЗВА_ПОЛЯ<br>
headers:<br>
• Authorization: Bearer ваш_jwt_токен - обов'язково<br>
• Content-Type: application/json - обов'язково<br>
params (Path Parameters):<br>
• У URL замість НАЗВА_ПОЛЯ пишіть назву поля яке оновлюєте<br>
params (Query Parameters): немає<br>
body (raw JSON): (мінімум одне поле має бути)<br>

{<br>
  "area_hectares": 12.5,                    - не обов'язково, нове значення площі<br>
  "soil_type": "CLAY",                      - не обов'язково, новий тип грунту<br>
  "field_location": "нова_локація"          - не обов'язково, нова локація<br>
}<br>
Примітка: Поле field_name в body НЕ МОЖНА змінювати<br>

<img width="748" height="870" alt="image" src="https://github.com/user-attachments/assets/610a8449-0226-41b3-8ea1-12ee3bed4e98" /><br><br>

7. DELETE /fields/:field_name - Видалити поле<br>
Метод: DELETE<br>
URL: http://localhost:4000/v1/fields/НАЗВА_ПОЛЯ<br>
headers:<br>
• Authorization: Bearer ваш_jwt_токен - обов'язково<br>
• Content-Type: application/json - обов'язково<br>
params (Path Parameters):<br>
• У URL замість НАЗВА_ПОЛЯ пишіть назву поля яке видаляєте<br>
params (Query Parameters): немає<br>
body: немає тіла<br>
Примітка: Не можна видалити поле, якщо є пов'язані посіви<br>

<img width="748" height="662" alt="image" src="https://github.com/user-attachments/assets/d141246b-0c55-4786-91a2-203b909de913" /><br><br>

### Crops (Посіви)
8. GET /crops - Отримати всі посіви<br>
Метод: GET<br>
URL: http://localhost:4000/v1/crops<br>
headers:<br>
• Authorization: Bearer ваш_jwt_токен - обов'язково<br>
• Content-Type: application/json - обов'язково<br>
params (Query Parameters):<br>
• withRelations - не обов'язково, значення: true або false<br>
Якщо true: повертає посіви з інформацією про поле та роботи<br>
Якщо false: повертає тільки посіви<br>
body: немає тіла<br><br>

Вивід без робіт над посівом<br>
<img width="748" height="867" alt="image" src="https://github.com/user-attachments/assets/b7142999-0965-4e63-b30e-a47b2664dc62" /><br><br>

Вивід з роботами над посівом<br>
<img width="812" height="898" alt="image" src="https://github.com/user-attachments/assets/b1cc17ca-948a-4577-8e20-ac8f0b0d1c38" /><br><br>


9. GET /crops/:id - Отримати один посів<br>
Метод: GET<br>
URL: http://localhost:4000/v1/crops/1<br>
headers:<br>
• Authorization: Bearer ваш_jwt_токен - обов'язково<br>
• Content-Type: application/json - обов'язково<br>
params (Path Parameters):<br>
• :id - обов'язково, вставляється в URL замість 1 (число ID посіву)<br>
params (Query Parameters):<br>
• withRelations - не обов'язково, значення: true або false<br>
Якщо true: повертає посів з інформацією про поле та роботи<br>
Якщо false: повертає тільки посів<br>
body: немає тіла<br><br>

<img width="708" height="787" alt="image" src="https://github.com/user-attachments/assets/0b61197a-87ef-4798-bcdd-70a32d43605c" /><br><br>

10. POST /crops - Створити посів<br>
Метод: POST<br>
URL: http://localhost:4000/v1/crops<br>
headers:<br>
• Authorization: Bearer ваш_jwt_токен - обов'язково<br>
• Content-Type: application/json - обов'язково<br>
params: немає параметрів<br>
body (raw JSON):<br>

{<br>
  "field_name": "Назва поля",           - обов'язково, рядок (має існувати в таблиці fields)<br>
  "cultivated_plant_name": "Назва рослини", - обов'язково, рядок<br>
  "crop_start_date": "2024-01-15",      - обов'язково, дата у форматі YYYY-MM-DD<br>
  "crop_harvest_date": "2024-08-20",    - обов'язково, дата у форматі YYYY-MM-DD<br>
  "actual_harvest_tons": 25,            - обов'язково, число<br>
  "crop_status": "активний"             - обов'язково, одне з: "готується до посіву", "засівається", "активний", "готується до збору", "збирається", "завершений"<br>
}<br><br>

<img width="845" height="902" alt="image" src="https://github.com/user-attachments/assets/85531824-fd70-48d4-96eb-f82c765e0e48" /><br><br>

11. PUT /crops/:id - Оновити посів<br>
Метод: PUT<br>
URL: http://localhost:4000/v1/crops/1<br>
headers:<br>
• Authorization: Bearer ваш_jwt_токен - обов'язково<br>
• Content-Type: application/json - обов'язково<br>
params (Path Parameters):<br>
• :id - обов'язково, ID посіву який оновлюєте<br>
body (raw JSON): (мінімум одне поле має бути)<br>

{<br>
  "field_name": "Нова назва поля",      - не обов'язково, рядок<br>
  "cultivated_plant_name": "Нова культура", - не обов'язково, рядок<br>
  "crop_start_date": "2024-02-01",      - не обов'язково, дата<br>
  "crop_harvest_date": "2024-09-01",    - не обов'язково, дата<br>
  "actual_harvest_tons": 30,            - не обов'язково, число<br>
  "crop_status": "завершений"           - не обов'язково, рядок<br>
}<br>

<img width="884" height="825" alt="image" src="https://github.com/user-attachments/assets/8fc0bc68-43ab-4eca-a88e-5dcf1101ae0c" /><br><br>

12. DELETE /crops/:id - Видалити посів<br>
Метод: DELETE<br>
URL: http://localhost:4000/v1/crops/1<br>
headers:<br>
• Authorization: Bearer ваш_jwt_токен - обов'язково<br>
• Content-Type: application/json - обов'язково<br>
params (Path Parameters):<br>
• :id - обов'язково, ID посіву який видаляєте<br>
body: немає тіла<br>
Примітка: Не можна видалити посів, якщо є пов'язані роботи (field-works)<br><br>

<img width="784" height="408" alt="image" src="https://github.com/user-attachments/assets/feedee28-8131-4d57-8628-7a3f9a030553" /><br><br>

### Field works (Роботи на полі)
13. GET /field-works - Отримати всі роботи<br>
Метод: GET<br>
URL: http://localhost:4000/v1/field-works<br>
headers:<br>
• Authorization: Bearer ваш_jwt_токен - обов'язково<br>
• Content-Type: application/json - обов'язково<br>
params (Query Parameters):<br>
• withRelations - не обов'язково, значення: true або false<br>
Якщо true: повертає роботи з інформацією про посів та поле<br>
Якщо false: повертає тільки роботи<br>
body: немає тіла<br>

<img width="720" height="867" alt="image" src="https://github.com/user-attachments/assets/d4549f7a-ec0e-4de7-ac21-8d9b81284e85" /><br><br>

14. GET /field-works/:id - Отримати одну роботу<br>
Метод: GET<br>
URL: http://localhost:4000/v1/field-works/1<br>
headers:<br>
• Authorization: Bearer ваш_jwt_токен - обов'язково<br>
• Content-Type: application/json - обов'язково<br>
params (Path Parameters):<br>
• :id - обов'язково, вставляється в URL замість 1 (число ID роботи)<br>
params (Query Parameters):<br>
• withRelations - не обов'язково, значення: true або false<br>
Якщо true: повертає роботу з інформацією про посів та поле<br>
Якщо false: повертає тільки роботу<br>
body: немає тіла<br><br>

<img width="711" height="612" alt="image" src="https://github.com/user-attachments/assets/205095f9-450b-426a-b071-8400245d819e" /><br><br>

15. POST /field-works - Створити роботу<br>
Метод: POST<br>
URL: http://localhost:4000/v1/field-works<br>
headers:<br>
• Authorization: Bearer ваш_jwt_токен - обов'язково<br>
• Content-Type: application/json - обов'язково<br>
params: немає параметрів<br>
body (raw JSON):<br>

{<br>
  "crop_id": 1,                          - обов'язково, число (має існувати в таблиці crops)<br>
  "employee_id": 101,                    - обов'язково, число<br>
  "machinery_id": 5,                     - обов'язково, число<br>
  "work_type": "орка",                   - обов'язково, одне з: "орка", "сівба", "обробіток міжрядь", "полив", "внесення добрив", "захист від шкідників", "збирання врожаю", "зяблева оранка", "лушення", "боронування", "прибирання пожнивних залишків", "мульчування", "підживлення", "обприскування", "просаджування", "кошення", "валкування", "тюкування" <br>
  "work_start_date": "2024-05-10",       - обов'язково, дата у форматі YYYY-MM-DD<br>
  "work_end_date": "2024-05-12"          - обов'язково, дата у форматі YYYY-MM-DD<br>
}<br><br>

<img width="855" height="892" alt="image" src="https://github.com/user-attachments/assets/745ea7e4-5461-4b94-b87a-22f127249d2b" /><br><br>

16. PUT /field-works/:id - Оновити роботу<br>
Метод: PUT<br>
URL: http://localhost:4000/v1/field-works/1<br>
headers:<br>
• Authorization: Bearer ваш_jwt_токен - обов'язково<br>
• Content-Type: application/json - обов'язково<br>
params (Path Parameters):<br>
• :id - обов'язково, ID роботи яку оновлюєте<br>
body (raw JSON): (мінімум одне поле має бути)<br>

{<br>
  "crop_id": 2,                          - не обов'язково, число<br>
  "employee_id": 102,                    - не обов'язково, число<br>
  "machinery_id": 6,                     - не обов'язково, число<br>
  "work_type": "сівба",                  - не обов'язково, рядок<br>
  "work_start_date": "2024-06-01",       - не обов'язково, дата<br>
  "work_end_date": "2024-06-02"          - не обов'язково, дата<br>
}<br><br>

<img width="783" height="842" alt="image" src="https://github.com/user-attachments/assets/740dd107-ffab-497d-bc1b-49206d793e26" /><br><br>

17. DELETE /field-works/:id - Видалити роботу<br>
Метод: DELETE<br>
URL: http://localhost:4000/v1/field-works/1<br>
headers:<br>
• Authorization: Bearer ваш_jwt_токен - обов'язково<br>
• Content-Type: application/json - обов'язково<br>
params (Path Parameters):<br>
• :id - обов'язково, ID роботи яку видаляєте<br>
body: немає тіла<br><br>

 <img width="839" height="430" alt="image" src="https://github.com/user-attachments/assets/a5c8c162-80ba-4337-afd4-a88d35faee65" />

## Пояснення ролі кожного шару 
1. Middleware (валідація)<br>
Перевіряє вхідні дані до обробки: формат, обов’язкові поля, типи, діапазони. Якщо дані невалідні, повертає помилку до клієнта і не передає запит далі. Захищає від некоректних даних.<br>
2. Controller (оркестрація)<br>
Оркеструє запит: отримує дані з req, викликає сервіс, формує відповідь через DTO, надсилає результат клієнту. Не містить бізнес-логіки — координує потік.<br>
3. Service (бізнес-логіка)<br>
Реалізує бізнес-правила, валідує взаємозв’язки, виконує операції з кількома сутностями, обробляє помилки бізнес-рівня. Не працює напряму з HTTP, що дозволяє перевикористовувати логіку.<br>
4. Repository (доступ до даних)<br>
Абстракція доступу до БД. Виконує CRUD через TypeORM, керує запитами, зв’язками та транзакціями. Ізолює бізнес-логіку від деталей БД.<br><br>

## Приклад Middleware-функції
Файл: src/middleware/validation/auth/validatorLogin.ts<br><br>

<img width="789" height="517" alt="image" src="https://github.com/user-attachments/assets/db45c9ba-208b-4653-af6c-47355d3ddf6b" /><br><br>


## Приклад ResponseDTO
Файл: src/dto/crop/CropResponseDTO.ts<br><br>

<img width="524" height="527" alt="image" src="https://github.com/user-attachments/assets/5e6950a7-2056-4dac-90a9-589fd18ae2dc" /><br>
<img width="380" height="161" alt="image" src="https://github.com/user-attachments/assets/dbea7405-5611-44a4-9359-acc4ddef6c8d" /><br><br>

Призначення: Формує структуровану відповідь, прибирає внутрішні деталі сутності та форматує дані для клієнта.


## Приклад Service-класу
Файл: src/services/crop.service.ts<br><br>

<img width="580" height="525" alt="image" src="https://github.com/user-attachments/assets/6b73662f-1f77-4169-a25e-0534d2575979" /><br>
<img width="631" height="510" alt="image" src="https://github.com/user-attachments/assets/2c8c7813-0fad-4e09-9de4-16177f4533b8" /><br>
<img width="630" height="528" alt="image" src="https://github.com/user-attachments/assets/a493b899-14d4-4284-ad55-a429b84a8c3f" /><br>
<img width="597" height="418" alt="image" src="https://github.com/user-attachments/assets/9be6154f-c872-4464-9478-432f69d28726" /><br>

## Приклади успішних та неуспішних запитів

Неуспішний запит<br>
<img width="974" height="514" alt="image" src="https://github.com/user-attachments/assets/d97f2c7f-c405-40b2-a4ec-0ac95094a505" /><br><br><br>

Успішний запит<br>
<img width="974" height="582" alt="image" src="https://github.com/user-attachments/assets/f5cdf3bc-aaca-4fde-a1cc-408822245e12" />

