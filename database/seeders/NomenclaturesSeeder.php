<?php

namespace Database\Seeders;

use App\Models\Nomenclature;
use DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NomenclaturesSeeder extends Seeder
{
    private $unitMap = [
        'р\шт' => 'шт',      // piece
        'р\п.м' => 'п.м',    // running meter
        'р\л' => 'л',        // liter
        'р\кв.м' => 'м²',  // square meter
        'р\куб.м' => 'м³', // cubic meter
        'р\кг' => 'кг',       // kilogram
        'р\компл.' => 'компл.', // complete set
    ];
    
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //clear all nomenclatures
        DB::table('nomenclatures')->truncate();

        //import csv
        $csvFilesList = [
            'database/data/nomenclatures/2_poroshkovaya_pokraska.csv',
            'database/data/nomenclatures/nomenclatures_1.csv',
        ];

        foreach ($csvFilesList as $csvFile) {
            $firstLine = true;
            $readCsv = fopen(base_path($csvFile), 'r');
            while (($data = fgetcsv($readCsv, 2000, ',')) !== false) {
                if (! $firstLine) {
                    Nomenclature::create([
                        'name' => \strval($data[0]),
                        'base_price' => \floatval(str_replace(',', '.', $data[1])),
                        'unit' => $this->unitMap[\strval($data[2])] ?? \strval($data[2]),
                        'nomenclature_category_id' => \intval($data[3]),
                    ]);
                }
                $firstLine = false;
            }
            fclose($readCsv);
        }
    }
}
