<?php

namespace Database\Seeders;

use App\Models\DoorModel;
use DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TermoDoorModelsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $termoModels = [
            'Darkwood SP Дуб чарлстон',
            'Darkwood SP Вудлайн тёмный',
            'Soros Дуб чарлстон',
            'Soros Вудлайн тёмный',
            'Drevos SP Пино+чёрный',
            'Veles Вяз шоколад',
            'Veles Вудлайн тёмный',
            'Veles Дуб чарлстон',
            'Veles Пино',
            'Darkwood SP Вяз шоколад',
            'Darkwood SP Пино',
            'Soros Вяз шоколад',
            'Soros Пино',
            'Drevos SP Дуб чарлстон',
            'Drevos SP Вяз шоколад',
            'Drevos SP Вудлайн тёмный',

            'Optima',
            'Credo',
            'Credo SP',
            'Senator SP',
            'Senator Max SP',
            'Nova',
            'Imperato',
            'Imperato SP',
            'Imperato Max SP',
            'Imperato Max SP',
        ];

        foreach ($termoModels as $model) {
            DoorModel::create([
                'name' => $model,
                'type' => 'exterior',
                'is_thermally_resistant' => true
            ]);
        }
    }
}
