# Chirper — Micro-Blogging Application

Chirper is a simple micro-blogging platform inspired by Twitter/X, developed as part of the **Laravel Bootcamp**.  
This project demonstrates real-world Laravel development practices, including authentication, CRUD functionality, Blade components, and Tailwind CSS.

It serves as a showcase of modern Laravel full-stack development fundamentals.




---

## 🚀 Start it in your browser !

[![Open in Codeflow](https://developer.stackblitz.com/img/open_in_codeflow.svg)](https://pr.new/davy39/chirper-laravel-bootcamp)


---

## ✨ Features

- User authentication (register/login/logout)
- Post short messages called *Chirps*
- Edit / delete your own chirps
- Blade components for clean UI structure
- Tailwind CSS responsive UI
- Form validation & error handling
- Database migrations & Eloquent ORM

---

## 🛠️ Tech Stack

| Category   | Technology |
|------------|------------|
| Backend    | Laravel 10+ (PHP 8+) |
| Frontend   | Blade, Tailwind CSS |
| Auth       | Laravel Breeze |
| Assets     | Vite |
| Database   | SQLite |

---

## 📸 Preview

> ![Dashboard Screenshot](assets/chirper.png)

---

## 🚀 Local Setup

Clone the repository:

```bash
git clone https://github.com/klee3/chirper.git
cd chirper
```

Install dependencies:
```bash
composer install
npm install
```
Environment setup:
```bash
cp .env.example .env
php artisan key:generate
```
Configure .env database settings, then run:
```bash
php artisan migrate
```
Seed the Sample Data
```bash
php artisan db:seed --class=ChirpSeeder
```

Start development servers:
```bash
composer run dev
```
---
## 🎯 Learning Goals

- Through this project I practiced:
- Laravel MVC architecture
- Routing, controllers, and Blade templating
- Eloquent models, migrations, and relationships
- Authentication & middleware
- Asset handling with Vite
- Styling with Tailwind CSS
- CRUD operations in Laravel

---

## 📌 Project Purpose

This project is built for educational and portfolio purposes to demonstrate:

- Backend fundamentals with Laravel
- Clean and maintainable code structure
- Full-stack workflow & modern PHP practices

---

## 📄 License

Open-source — MIT License.
