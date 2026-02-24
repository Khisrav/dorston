<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\NomenclatureCategory;
use Illuminate\Support\Facades\DB;

class NomenclatureCategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('nomenclature_categories')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
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
            "Наценка дистрибьюторов",
            'Модульная система',
            'Дополнительный модуль фурнитуры',
        ];

        foreach ($categories as $category) {
            NomenclatureCategory::create([
                'name' => $category,
            ]);
        }
    }
}
