# Руководство по JWT Аутентификации

## 🔐 Что такое JWT аутентификация?

JWT (JSON Web Token) - это стандарт для безопасной передачи информации между сторонами в виде JSON объекта. В нашей системе мы используем JWT для аутентификации пользователей.

### Основные понятия:

1. **Access Token** - короткоживущий токен (15 минут) для авторизации API запросов
2. **Refresh Token** - долгоживущий токен (7 дней) для обновления пары токенов
3. **Хэширование** - процесс превращения пароля в нечитаемую строку для безопасности
4. **Валидация** - проверка правильности данных

## 🏗️ Архитектура системы

```
Клиент                  Сервер                    База данных
  |                       |                           |
  |-- POST /auth/login -->|                           |
  |                       |-- findByEmail() -------->|
  |                       |<-- UserEntity -----------|
  |                       |-- validatePassword() --->|
  |                       |-- generateTokens() ----->|
  |                       |-- updateRefreshToken() ->|
  |<-- accessToken + ------|                           |
      refreshToken        |                           |
```

## 📁 Структура файлов

```
src/auth/
├── auth.module.ts           # Главный модуль аутентификации
├── auth.service.ts          # Бизнес-логика аутентификации
├── auth.controller.ts       # HTTP эндпоинты
├── dto/
│   ├── login.dto.ts        # Структура данных для логина
│   ├── refresh-token.dto.ts # Структура для обновления токенов
│   └── auth-response.dto.ts # Структура ответа сервера
├── strategies/
│   ├── jwt.strategy.ts     # Валидация access токенов
│   └── jwt-refresh.strategy.ts # Валидация refresh токенов
├── guards/
│   ├── jwt-auth.guard.ts   # Защита маршрутов access токеном
│   └── jwt-refresh.guard.ts # Защита эндпоинта обновления
└── decorators/
    └── current-user.decorator.ts # Декоратор для получения пользователя
```

## 🔄 Процесс аутентификации

### 1. Регистрация пользователя
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### 2. Логин пользователя
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Ответ:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### 3. Использование access токена
```http
GET /auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Обновление токенов (когда access токен истек)
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 5. Выход из системы
```http
POST /auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🛠️ Как использовать в коде

### Защита маршрута
```typescript
@Get('protected')
@UseGuards(JwtAuthGuard) // Требует валидный access токен
async getProtectedData(@CurrentUser() user: any) {
  return `Hello ${user.firstName}!`;
}
```

### Получение данных пользователя
```typescript
@Get('me')
@UseGuards(JwtAuthGuard)
async getCurrentUser(@CurrentUser() user: any) {
  return {
    id: user.id,
    email: user.email,
    name: `${user.firstName} ${user.lastName}`
  };
}
```

## 🔒 Меры безопасности

### 1. Хэширование паролей
- Используем bcrypt с 10 раундами
- Пароли НИКОГДА не хранятся в открытом виде
- Соль генерируется автоматически

### 2. Двойные токены
- **Access Token**: короткий срок жизни (15 мин)
- **Refresh Token**: длинный срок жизни (7 дней)
- Разные секретные ключи для каждого типа

### 3. Ротация refresh токенов
- При каждом обновлении генерируется новый refresh токен
- Старый токен становится недействительным
- Защищает от replay атак

### 4. Хранение refresh токенов
- Refresh токены хранятся в БД в хэшированном виде
- Можно отозвать токен при компрометации
- Logout удаляет токен из базы

## 📋 Checklist для продакшена

- [ ] Переместить секретные ключи в .env файлы
- [ ] Использовать HTTPS для всех запросов
- [ ] Настроить CORS правильно
- [ ] Добавить rate limiting для эндпоинтов аутентификации
- [ ] Логировать попытки входа
- [ ] Добавить капчу для защиты от ботов
- [ ] Реализовать восстановление пароля
- [ ] Добавить двухфакторную аутентификацию (2FA)

## 🐛 Возможные ошибки

### 401 Unauthorized
- Неверный пароль или email
- Истекший access токен
- Недействительный refresh токен
- Пользователь не найден

### 400 Bad Request
- Неверный формат email
- Пустые поля
- Неверная структура JSON

### 409 Conflict
- Пользователь с таким email уже существует

## 🔧 Настройка окружения

### 1. Установка зависимостей
```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt passport-local
npm install --save-dev @types/passport-jwt @types/passport-local
```

### 2. Переменные окружения (.env)
```env
JWT_SECRET=your-very-long-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=todo_db
DATABASE_USER=postgres
DATABASE_PASSWORD=password
```

### 3. Запуск базы данных (Docker)
```bash
docker run --name postgres-todo \
  -e POSTGRES_DB=todo_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:13
```

## 📚 Полезные материалы

- [JWT.io](https://jwt.io/) - декодер и документация по JWT
- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Passport.js](http://www.passportjs.org/docs/)
- [bcrypt documentation](https://github.com/kelektiv/node.bcrypt.js)

## 🎯 Следующие шаги

1. Запустите PostgreSQL базу данных
2. Создайте .env файл с секретными ключами
3. Запустите приложение: `npm run start:dev`
4. Откройте Swagger документацию: `http://localhost:3000/api`
5. Протестируйте эндпоинты через Swagger или Postman 