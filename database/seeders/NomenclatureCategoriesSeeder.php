<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\NomenclatureCategory;

class NomenclatureCategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            "Основное (Разное)",
            "Порошковая краска",
            "Фурнитура",
            "Упаковка",
            "Цилиндры",
            "Ручки",
            "Прочее",
            "Накладки",
            "Для расчетов МДФ панелей",
            "Глазки",
            "Вертушки",
            "Модуль дополнений термо",
            "Пленки",
            "Внутренняя наценка Dorston",
            "ФЗП",
            "Покраска в 2 цвета Termo",
            "Электронные замки",
            "Вертушки на шток",
            "ФЗП Termo",
            "Наценка дистрибьюторов"
        ];

        foreach ($categories as $category) {
            NomenclatureCategory::create([
                'name' => $category,
            ]);
        }
    }
}
