<?php

namespace Database\Seeders;

use App\Models\Nomenclature;
use App\Models\NomenclatureProperty;
use Illuminate\Database\Seeder;

class LocksSeeder extends Seeder
{
    private array $primaryLocks = [
        [
            'name' => 'Galeon 816',
            'props' => ['Страна' => 'Китай', 'Механизм' => 'Цилиндровый', 'Безопасность' => '4'],
        ],
        [
            'name' => 'Гардиан 32.11',
            'props' => ['Страна' => 'Россия', 'Механизм' => 'Цилиндровый', 'Безопасность' => '4'],
        ],
        [
            'name' => 'Гардиан 71.14',
            'props' => ['Страна' => 'Россия', 'Механизм' => 'Сувальдный', 'Безопасность' => '4'],
        ],
        [
            'name' => 'Galeon 818',
            'props' => ['Страна' => 'Китай', 'Механизм' => 'Сувальдный', 'Безопасность' => '4'],
        ],
        [
            'name' => 'Гардиан 30.11',
            'props' => ['Страна' => 'Россия', 'Механизм' => 'Сувальдный', 'Безопасность' => '3'],
        ],
        [
            'name' => 'Гардиан 72.16 (Редукторный)',
            'props' => ['Страна' => 'Россия', 'Механизм' => 'Цилиндровый', 'Безопасность' => '4'],
        ],
        [
            'name' => 'Гардиан 32.21',
            'props' => ['Страна' => 'Россия', 'Механизм' => 'Цилиндровый', 'Безопасность' => '4'],
        ],
        [
            'name' => 'Securemme 1653 (Редукторный)',
            'props' => ['Страна' => 'Италия', 'Механизм' => 'Цилиндровый', 'Безопасность' => '4'],
        ],
        [
            'name' => 'Securemme 1403',
            'props' => ['Страна' => 'Италия', 'Механизм' => 'Сувальдный', 'Безопасность' => '4'],
        ],
    ];

    private array $secondaryLocks = [
        [
            'name' => 'Galeon 817',
            'props' => ['Страна' => 'Китай', 'Механизм' => 'Сувальдный', 'Безопасность' => '4'],
        ],
        [
            'name' => 'Гардиан 30.01',
            'props' => ['Страна' => 'Россия', 'Механизм' => 'Сувальдный', 'Безопасность' => '3'],
        ],
        [
            'name' => 'Securemme 1663 (Редукторный)',
            'props' => ['Страна' => 'Италия', 'Механизм' => 'Цилиндровый', 'Безопасность' => '4'],
        ],
        [
            'name' => 'Double force 32.01',
            'props' => ['Страна' => 'Китай', 'Механизм' => 'Цилиндровый', 'Безопасность' => '4'],
        ],
        [
            'name' => 'Гардиан 32.01',
            'props' => ['Страна' => 'Россия', 'Механизм' => 'Цилиндровый', 'Безопасность' => '4'],
        ],
        [
            'name' => 'Гардиан 72.06 (Редукторный)',
            'props' => ['Страна' => 'Россия', 'Механизм' => 'Цилиндровый', 'Безопасность' => '4'],
        ],
        [
            'name' => 'Securemme 1413',
            'props' => ['Страна' => 'Италия', 'Механизм' => 'Сувальдный', 'Безопасность' => '4'],
        ],
        [
            'name' => 'Гардиан 100.01',
            'props' => ['Страна' => 'Россия', 'Механизм' => 'Сувальдный', 'Безопасность' => '4'],
        ],
    ];

    public function run(): void
    {
        $lockIds = Nomenclature::where('nomenclature_category_id', 3)->pluck('id');
        NomenclatureProperty::whereIn('nomenclature_id', $lockIds)->delete();
        Nomenclature::where('nomenclature_category_id', 3)->delete();

        foreach ($this->primaryLocks as $lock) {
            $nomenclature = Nomenclature::create([
                'name'                    => $lock['name'],
                'nomenclature_category_id' => 3,
                'base_price'              => 0,
                'unit'                    => null,
                'tag'                     => 'primary-lock',
            ]);

            foreach ($lock['props'] as $propName => $propValue) {
                NomenclatureProperty::create([
                    'nomenclature_id' => $nomenclature->id,
                    'property_name'   => $propName,
                    'property_value'  => $propValue,
                ]);
            }
        }

        foreach ($this->secondaryLocks as $lock) {
            $nomenclature = Nomenclature::create([
                'name'                    => $lock['name'],
                'nomenclature_category_id' => 3,
                'base_price'              => 0,
                'unit'                    => null,
                'tag'                     => 'secondary-lock',
            ]);

            foreach ($lock['props'] as $propName => $propValue) {
                NomenclatureProperty::create([
                    'nomenclature_id' => $nomenclature->id,
                    'property_name'   => $propName,
                    'property_value'  => $propValue,
                ]);
            }
        }
    }
}
