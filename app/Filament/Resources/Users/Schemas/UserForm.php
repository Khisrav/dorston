<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Имя')
                    ->required(),
                TextInput::make('email')
                    ->label('Электронная почта')
                    ->email()
                    ->required(),
                DateTimePicker::make('email_verified_at')
                    ->label('Email подтвержден'),
                TextInput::make('password')
                    ->label('Пароль')
                    ->password()
                    ->required(),
                Textarea::make('two_factor_secret')
                    ->label('Секрет двухфакторной аутентификации')
                    ->columnSpanFull(),
                Textarea::make('two_factor_recovery_codes')
                    ->label('Коды восстановления 2FA')
                    ->columnSpanFull(),
                DateTimePicker::make('two_factor_confirmed_at')
                    ->label('2FA подтверждена'),
            ]);
    }
}
