# Automatic tests

After completing all the steps in the project, automatic tests will become available to you. Tests are run on each commit - once all tasks in the Hexlet interface are completed, make a commit, and the tests will run automatically.

The hexlet-check.yml file is responsible for running these tests - do not delete this file, edit it, or rename the repository.

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


[![CI](https://github.com/Anyakin666/frontend-project-46/actions/workflows/ci.yml/badge.svg)](https://github.com/Anyakin666/frontend-project-46/actions/workflows/ci.yml)

![Coverage](https://img.shields.io/badge/coverage-88.88%25-green)
