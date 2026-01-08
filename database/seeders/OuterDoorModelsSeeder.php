<?php

namespace Database\Seeders;

use App\Models\DoorModel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OuterDoorModelsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $doorModels = [
            [
                'name' => 'Kombi',
                'image' => '',
                'type' => 'exterior',
                'is_thermally_resistant' => false,
            ],
            [
                'name' => 'Verso',
                'image' => '',
                'type' => 'exterior',
                'is_thermally_resistant' => false,
            ],
            [
                'name' => 'Forta',
                'image' => '',
                'type' => 'exterior',
                'is_thermally_resistant' => false,
            ],
            [
                'name' => 'Stark',
                'image' => '',
                'type' => 'exterior',
                'is_thermally_resistant' => false,
            ],
            [
                'name' => 'BC-6',
                'image' => '',
                'type' => 'exterior',
                'is_thermally_resistant' => false,
            ],
            [
                'name' => 'BC-45',
                'image' => '',
                'type' => 'exterior',
                'is_thermally_resistant' => false,
            ],
            [
                'name' => 'BC-22',
                'image' => '',
                'type' => 'exterior',
                'is_thermally_resistant' => false,
            ],
            [
                'name' => 'BC-24',
                'image' => '',
                'type' => 'exterior',
                'is_thermally_resistant' => false,
            ],
            [
                'name' => 'BC-13',
                'image' => '',
                'type' => 'exterior',
                'is_thermally_resistant' => false,
            ],
            [
                'name' => 'BC-41',
                'image' => '',
                'type' => 'exterior',
                'is_thermally_resistant' => false,
            ],
            [
                'name' => 'BC-46',
                'image' => '',
                'type' => 'exterior',
                'is_thermally_resistant' => false,
            ],
            [
                'name' => 'BC-47',
                'image' => '',
                'type' => 'exterior',
                'is_thermally_resistant' => false,
            ],
            [
                'name' => 'BC-32',
                'image' => '',
                'type' => 'exterior',
                'is_thermally_resistant' => false,
            ],
            [
                'name' => 'BC-48',
                'image' => '',
                'type' => 'exterior',
                'is_thermally_resistant' => false,
            ],
            [
                'name' => 'BC-42',
                'image' => '',
                'type' => 'exterior',
                'is_thermally_resistant' => false,
            ],
            [
                'name' => 'BC-49',
                'image' => '',
                'type' => 'exterior',
                'is_thermally_resistant' => false,
            ],
            [
                'name' => 'BC-50',
                'image' => '',
                'type' => 'exterior',
                'is_thermally_resistant' => false,
            ],
            [
                'name' => 'BC-43',
                'image' => '',
                'type' => 'exterior',
                'is_thermally_resistant' => false,
            ],
            [
                'name' => 'BC-51',
                'image' => '',
                'type' => 'exterior',
                'is_thermally_resistant' => false,
            ],
            [
                'name' => 'НФ-6',
                'image' => '',
                'type' => 'exterior',
                'is_thermally_resistant' => false,
            ],
            [
                'name' => 'BC-52',
                'image' => '',
                'type' => 'exterior',
                'is_thermally_resistant' => false,
            ],
            [
                'name' => 'BC-34',
                'image' => '',
                'type' => 'exterior',
                'is_thermally_resistant' => false,
            ],
            [
                'name' => 'BC-30',
                'image' => '',
                'type' => 'exterior',
                'is_thermally_resistant' => false,
            ],
            [
                'name' => 'BC-44',
                'image' => '',
                'type' => 'exterior',
                'is_thermally_resistant' => false,
            ],
            [
                'name' => 'BC-19',
                'image' => '',
                'type' => 'exterior',
                'is_thermally_resistant' => false,
            ],
            [
                'name' => 'BC-38',
                'image' => '',
                'type' => 'exterior',
                'is_thermally_resistant' => false,
            ],
            [
                'name' => 'ВС-17',
                'image' => '',
                'type' => 'exterior',
                'is_thermally_resistant' => false,
            ],
        ];

        foreach ($doorModels as $doorModel) {
            DoorModel::create($doorModel);
        }
    }
}
