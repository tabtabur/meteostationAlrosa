<?php
// Включаем вывод ошибок для отладки
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Подключение к базе данных
try {
    $pdo = new PDO('mysql:host=localhost;dbname=my_site', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    header("Location: reg.html?error=Ошибка подключения к базе данных");
    exit;
}

// Получение данных из формы
$username = trim($_POST['username']);
$email = trim($_POST['email']);
$password = $_POST['password'];
$confirm_password = $_POST['confirm_password'];

// Валидация данных
if (empty($username) || empty($email) || empty($password)) {
    header("Location: reg.html?error=Все поля обязательны для заполнения");
    exit;
}

if ($password !== $confirm_password) {
    header("Location: reg.html?error=Пароли не совпадают");
    exit;
}

if (strlen($password) < 6) {
    header("Location: reg.html?error=Пароль должен быть не менее 6 символов");
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header("Location: reg.html?error=Некорректный email");
    exit;
}

try {
    // Проверка уникальности username и email
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
    $stmt->execute([$username, $email]);
    
    if ($stmt->fetch()) {
        header("Location: reg.html?error=Пользователь с таким именем или email уже существует");
        exit;
    }

    // Хеширование пароля
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    // Вставка в БД
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
    $stmt->execute([$username, $email, $passwordHash]);

    // Перенаправление на главную страницу с сообщением об успехе
    header("Location: main.html?registration=success");
    exit;

} catch(PDOException $e) {
    header("Location: reg.html?error=Ошибка при регистрации: " . $e->getMessage());
    exit;
}
?>