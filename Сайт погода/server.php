<?php
// Подключение к БД
$pdo = new PDO('mysql:host=localhost;dbname=mydb', 'user', 'password');

// Получение данных из формы
$username = $_POST['username'];
$email = $_POST['email'];
$password = $_POST['password'];

// Хеширование пароля
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

// Проверка уникальности
$stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
$stmt->execute([$username, $email]);
if ($stmt->fetch()) {
    die("Пользователь с таким именем или email уже существует");
}

// Вставка в БД
$stmt = $pdo->prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
$stmt->execute([$username, $email, $passwordHash]);

echo "Регистрация успешна!";

?>