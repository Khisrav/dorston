<?php

namespace App\Filament\Resources\Furniture\Schemas;

use App\Models\Nomenclature;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class FurnitureForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([

                // ── Основная информация ──────────────────────────────────
                Section::make('Основная информация')
                    ->schema([
                        TextInput::make('title')
                            ->label('Название набора')
                            ->placeholder('Например: Прямоугольная, матовый чёрный')
                            ->maxLength(255)
                            ->columnSpanFull(),

                        Select::make('type')
                            ->label('Тип ручки')
                            ->options([
                                'push' => 'Нажимная',
                                'pull' => 'Бугельная',
                                'electronic' => 'Электронная',
                            ])
                            ->required()
                            ->native(false),

                        Select::make('shape')
                            ->label('Форма')
                            ->options([
                                'rectangular' => 'Прямоугольная',
                                'oval' => 'Овальная',
                                'other' => 'Другая',
                            ])
                            ->required()
                            ->native(false),

                        Select::make('color')
                            ->label('Цвет')
                            ->options([
                                'black' => 'Матовый чёрный',
                                'chrome' => 'Хром',
                                'matte-chrome' => 'Матовый хром',
                                'gold' => 'Золотой',
                                'bronze' => 'Бронзовый',
                            ])
                            ->required()
                            ->native(false),

                        FileUpload::make('preview')
                            ->label('Превью набора')
                            ->image()
                            ->imageEditor()
                            ->imageEditorAspectRatios(['4:3', '1:1'])
                            ->maxSize(2048)
                            ->disk('public')
                            ->directory('furniture/previews'),

                        FileUpload::make('peephole_preview')
                            ->label('Превью глазка')
                            ->image()
                            ->imageEditor()
                            ->imageEditorAspectRatios(['4:3', '1:1'])
                            ->maxSize(2048)
                            ->disk('public')
                            ->directory('furniture/peephole-previews'),

                        FileUpload::make('night_latch_preview')
                            ->label('Превью ночной задвижки')
                            ->image()
                            ->imageEditor()
                            ->imageEditorAspectRatios(['4:3', '1:1'])
                            ->maxSize(2048)
                            ->disk('public')
                            ->directory('furniture/night-latch-previews'),
                    ])
                    ->columns(3)
                    ->columnSpanFull(),

                // ── Основные замки ───────────────────────────────────────
                Section::make('Основные замки')
                    ->description('Первичный цилиндрический и сувальдный замок')
                    ->schema([
                        Select::make('primary_cylindrical_lock_id')
                            ->label('Цилиндрический замок (осн.)')
                            ->options(fn () => Nomenclature::where('nomenclature_category_id', 8)
                                ->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->nullable()
                            ->columnSpan(2),

                        FileUpload::make('primary_exterior_cylindrical_lock_image')
                            ->label('Накладка цил. замка - снаружи')
                            ->image()
                            ->imageEditor()
                            ->maxSize(2048)
                            ->disk('public')
                            ->directory('furniture/cylindrical-lock-covers/exterior')
                            ->columnSpan(1),

                        FileUpload::make('primary_interior_cylindrical_lock_image')
                            ->label('Накладка цил. замка - изнутри')
                            ->image()
                            ->imageEditor()
                            ->maxSize(2048)
                            ->disk('public')
                            ->directory('furniture/cylindrical-lock-covers/interior')
                            ->columnSpan(1),

                        Select::make('primary_lever_lock_id')
                            ->label('Сувальдный замок (осн.)')
                            ->options(fn () => Nomenclature::where('nomenclature_category_id', 8)
                                ->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->nullable()
                            ->columnSpan(2),

                        FileUpload::make('primary_exterior_lever_lock_image')
                            ->label('Накладка сув. замка — снаружи')
                            ->image()
                            ->imageEditor()
                            ->maxSize(2048)
                            ->disk('public')
                            ->directory('furniture/lever-lock-covers/exterior')
                            ->columnSpan(1),

                        FileUpload::make('primary_interior_lever_lock_image')
                            ->label('Накладка сув. замка — изнутри')
                            ->image()
                            ->imageEditor()
                            ->maxSize(2048)
                            ->disk('public')
                            ->directory('furniture/lever-lock-covers/interior')
                            ->columnSpan(1),
                    ])
                    ->columns(4)
                    ->columnSpanFull()
                    ->collapsible(),

                // ── Дополнительные замки ─────────────────────────────────
                Section::make('Дополнительные замки')
                    ->description('Вторичный цилиндрический и сувальдный замок')
                    ->schema([
                        Select::make('secondary_cylindrical_lock_id')
                            ->label('Цилиндрический замок (доп.)')
                            ->options(fn () => Nomenclature::where('nomenclature_category_id', 8)
                                ->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->nullable()
                            ->columnSpan(2),

                        FileUpload::make('secondary_exterior_cylindrical_lock_image')
                            ->label('Накладка цил. замка (доп.) - снаружи')
                            ->image()
                            ->imageEditor()
                            ->maxSize(2048)
                            ->disk('public')
                            ->directory('furniture/cylindrical-lock-covers/secondary/exterior')
                            ->columnSpan(1),

                        FileUpload::make('secondary_interior_cylindrical_lock_image')
                            ->label('Накладка цил. замка (доп.) - изнутри')
                            ->image()
                            ->imageEditor()
                            ->maxSize(2048)
                            ->disk('public')
                            ->directory('furniture/cylindrical-lock-covers/secondary/interior')
                            ->columnSpan(1),

                        Select::make('secondary_lever_lock_id')
                            ->label('Сувальдный замок (доп.)')
                            ->options(fn () => Nomenclature::where('nomenclature_category_id', 8)
                                ->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->nullable()
                            ->columnSpan(2),

                        FileUpload::make('secondary_exterior_lever_lock_image')
                            ->label('Накладка сув. замка (доп.) - снаружи')
                            ->image()
                            ->imageEditor()
                            ->maxSize(2048)
                            ->disk('public')
                            ->directory('furniture/lever-lock-covers/secondary/exterior')
                            ->columnSpan(1),

                        FileUpload::make('secondary_interior_lever_lock_image')
                            ->label('Накладка сув. замка (доп.) - изнутри')
                            ->image()
                            ->imageEditor()
                            ->maxSize(2048)
                            ->disk('public')
                            ->directory('furniture/lever-lock-covers/secondary/interior')
                            ->columnSpan(1),
                    ])
                    ->columns(4)
                    ->columnSpanFull()
                    ->collapsible()
                    ->collapsed(),

                // ── Прочие элементы ──────────────────────────────────────
                Section::make('Прочие элементы')
                    ->description('Глазок, ночная задвижка, вертушка на шток, ручка')
                    ->schema([
                        Select::make('peephole_id')
                            ->label('Глазок')
                            ->options(fn () => Nomenclature::where('nomenclature_category_id', 10)
                                ->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->nullable()
                            ->columnSpan(2),

                        FileUpload::make('peephole_exterior_side_image')
                            ->label('Глазок - снаружи, боковая позиция')
                            ->image()
                            ->imageEditor()
                            ->maxSize(2048)
                            ->disk('public')
                            ->directory('furniture/peephole-covers/exterior/side')
                            ->columnSpan(1),

                        FileUpload::make('peephole_exterior_center_image')
                            ->label('Глазок - снаружи, центральная позиция')
                            ->image()
                            ->imageEditor()
                            ->maxSize(2048)
                            ->disk('public')
                            ->directory('furniture/peephole-covers/exterior/center')
                            ->columnSpan(1),

                        FileUpload::make('peephole_interior_side_image')
                            ->label('Глазок - изнутри, боковая позиция')
                            ->image()
                            ->imageEditor()
                            ->maxSize(2048)
                            ->disk('public')
                            ->directory('furniture/peephole-covers/interior/side')
                            ->columnSpan(1),

                        FileUpload::make('peephole_interior_center_image')
                            ->label('Глазок - изнутри, центральная позиция')
                            ->image()
                            ->imageEditor()
                            ->maxSize(2048)
                            ->disk('public')
                            ->directory('furniture/peephole-covers/interior/center')
                            ->columnSpan(1),

                        Select::make('night_latch_turner_id')
                            ->label('Ночная задвижка + вертушок')
                            ->options(fn () => Nomenclature::where('nomenclature_category_id', 11)
                                ->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->nullable()
                            ->columnSpan(2),

                        FileUpload::make('night_latch_turner_image')
                            ->label('Накладка ночной задвижки')
                            ->image()
                            ->imageEditor()
                            ->maxSize(2048)
                            ->disk('public')
                            ->directory('furniture/night-latch-covers')
                            ->columnSpan(2),

                        Select::make('cylinder_rod_id')
                            ->label('Вертушка на шток цилиндра')
                            ->options(fn () => Nomenclature::where('nomenclature_category_id', 18)
                                ->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->nullable()
                            ->columnSpan(2),

                        FileUpload::make('cylinder_rod_cover_image')
                            ->label('Накладка вертушки на шток')
                            ->image()
                            ->imageEditor()
                            ->maxSize(2048)
                            ->disk('public')
                            ->directory('furniture/cylinder-rod-covers')
                            ->columnSpan(2),

                        Select::make('handle_id')
                            ->label('Ручка')
                            ->options(fn () => Nomenclature::where('nomenclature_category_id', 6)
                                ->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->nullable()
                            ->columnSpan(2),

                        FileUpload::make('handle_exterior_image')
                            ->label('Накладка ручки - снаружи')
                            ->image()
                            ->imageEditor()
                            ->maxSize(2048)
                            ->disk('public')
                            ->directory('furniture/handle-covers')
                            ->columnSpan(2),

                        FileUpload::make('handle_interior_image')
                            ->label('Накладка ручки - изнутри')
                            ->image()
                            ->imageEditor()
                            ->maxSize(2048)
                            ->disk('public')
                            ->directory('furniture/handle-covers')
                            ->columnSpan(2),
                    ])
                    ->columns(4)
                    ->columnSpanFull()
                    ->collapsible()
                    ->collapsed(),

            ]);
    }
}
