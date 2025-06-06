# Простая настройка JWT аутентификации

## 🎯 Что реализовано

Добавлены **2 эндпоинта** для JWT аутентификации:

### 1. **POST /auth/login** - Вход в систему
```json
// Запрос:
{
  "email": "user@example.com", 
  "password": "password123"
}

// Ответ:
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### 2. **POST /auth/refresh** - Обновление токенов
```json
// Запрос:
{
  "refreshToken": "eyJhbGci..."
}

// Ответ:
{
  "accessToken": "new_eyJhbGci...",
  "refreshToken": "new_eyJhbGci..."
}
```

## 🛠️ Установка PostgreSQL (без Docker)

### macOS (через Homebrew):
```bash
# Установка PostgreSQL
brew install postgresql@15

# Запуск сервиса
brew services start postgresql@15

# Создание базы данных
createdb todo_db

# Создание пользователя (опционально)
psql todo_db
CREATE USER todo WITH PASSWORD 'todo_pass';
GRANT ALL PRIVILEGES ON DATABASE todo_db TO todo;
\q
```

### Windows:
1. Скачать PostgreSQL с https://www.postgresql.org/download/windows/
2. Установить с настройками:
   - Port: 5432
   - Username: postgres
   - Password: todo_pass
3. Создать базу данных `todo_db` через pgAdmin

### Linux (Ubuntu/Debian):
```bash
# Установка
sudo apt update
sudo apt install postgresql postgresql-contrib

# Настройка
sudo -u postgres psql
CREATE DATABASE todo_db;
CREATE USER todo WITH PASSWORD 'todo_pass';
GRANT ALL PRIVILEGES ON DATABASE todo_db TO todo;
\q
```

## 🚀 Запуск приложения

```bash
# Установка зависимостей (если еще не установлены)
npm install

# Запуск в режиме разработки
npm run start:dev
```

## 🧪 Тестирование

1. Откройте Swagger: http://localhost:3000/api
2. Сначала зарегистрируйте пользователя через `/auth/register`
3. Затем войдите через `/auth/login`
4. Используйте полученный `refreshToken` в `/auth/refresh`

## ⚙️ Переменные окружения

Файл `.env` уже создан с настройками:
```env
# База данных
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=todo
POSTGRES_PASSWORD=todo_pass
POSTGRES_DB=todo_db

# JWT
JWT_SECRET=jwt-super-secret-key-for-access-tokens-development-32-chars-minimum
JWT_REFRESH_SECRET=jwt-refresh-secret-key-for-refresh-tokens-development-different-key
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
```

## 📁 Что было добавлено в код

### Новые файлы:
- `src/auth/auth.service.ts` - логика логина и refresh
- `src/auth/dto/login.dto.ts` - структура запроса логина
- `src/auth/dto/auth-response.dto.ts` - структура ответа

### Изменения:
- `src/user/user.entity.ts` - добавлено поле `refreshToken`
- `src/user/users.service.ts` - добавлены методы для JWT
- `src/auth/auth.controller.ts` - добавлены эндпоинты `/login` и `/refresh`
- `src/auth/auth.module.ts` - настроен JwtModule

## 🔒 Безопасность

- Пароли хэшируются с bcrypt
- Access токены живут 15 минут
- Refresh токены живут 7 дней  
- Refresh токены хранятся в БД в хэшированном виде
- При каждом refresh генерируется новая пара токенов

## ❗ Проблемы и решения

**Ошибка подключения к БД:**
- Убедитесь что PostgreSQL запущен
- Проверьте настройки в `.env` файле
- Проверьте что база данных `todo_db` создана

**Ошибки JWT:**
- Проверьте что в `.env` есть JWT_SECRET и JWT_REFRESH_SECRET
- Убедитесь что секретные ключи достаточно длинные (32+ символа) 