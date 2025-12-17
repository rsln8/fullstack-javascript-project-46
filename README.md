### Hexlet tests and linter status:
[![Actions Status](https://github.com/Anyakin666/frontend-project-46/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Anyakin666/frontend-project-46/actions)

[![CI](https://github.com/Anyakin666/frontend-project-46/actions/workflows/ci.yml/badge.svg)](https://github.com/Anyakin666/frontend-project-46/actions/workflows/ci.yml)

![Coverage](https://img.shields.io/badge/coverage-88.88%25-green)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Anyakin666_frontend-project-46&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Anyakin666_frontend-project-46)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Anyakin666_frontend-project-46&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Anyakin666_frontend-project-46)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Anyakin666_frontend-project-46&metric=bugs)](https://sonarcloud.io/summary/new_code?id=Anyakin666_frontend-project-46)
Gendiff - Difference Calculator
https://github.com/anyakin666/frontend-project-46/actions/workflows/ci.yml/badge.svg
https://img.shields.io/badge/coverage-88.88%2525-green

Утилита командной строки для сравнения двух конфигурационных файлов и показа различий.
Установка
Глобальная установка (CLI утилита)
bash
npm install -g @hexlet/code
Как библиотека в вашем проекте
bash
npm install @hexlet/code
Использование
Командная строка
bash
gendiff [options] <filepath1> <filepath2>
Примеры
bash
# Сравнить два JSON файла
gendiff file1.json file2.json

# Показать справку
gendiff -h

# Показать версию
gendiff -V
Как библиотека
javascript
import genDiff from '@hexlet/code';

const diff = genDiff('file1.json', 'file2.json');
console.log(diff);
Разработка
Настройка
bash
git clone https://github.com/anyakin666/frontend-project-46.git
cd frontend-project-46
make install
Доступные команды
bash
make install       # Установить зависимости
make test          # Запустить тесты
make lint          # Запустить линтер
make test-coverage # Запустить тесты с отчетом о покрытии
make check         # Запустить линтер и тесты
Пример вывода
text
{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}
