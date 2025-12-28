<?php

namespace App\Filament\Pages;

use BackedEnum;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Concerns\InteractsWithSchemas;
use Filament\Schemas\Contracts\HasSchemas;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use UnitEnum;

class UserSettings extends Page implements HasSchemas
{
    use InteractsWithSchemas;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-cog-6-tooth';
    
    protected static ?string $navigationLabel = 'Настройки';
    
    protected static ?string $title = 'Настройки';
    
    protected string $view = 'filament.pages.user-settings';
    
    protected static ?int $navigationSort = 100;
    
    protected static string|UnitEnum|null $navigationGroup = null;

    public ?array $profileData = [];
    public ?array $passwordData = [];

    public function mount(): void
    {
        $user = Auth::user();
        
        $this->profileForm->fill([
            'name' => $user->name,
            'email' => $user->email,
        ]);
        
        $this->passwordForm->fill();
    }

    public function profileForm(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Информация профиля')
                    ->description('Обновите свою личную информацию')
                    ->schema([
                        TextInput::make('name')
                            ->label('Имя')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('email')
                            ->label('Email')
                            ->email()
                            ->required()
                            ->unique('users', 'email', ignoreRecord: true)
                            ->maxLength(255),
                    ]),
            ])
            ->statePath('profileData');
    }

    public function passwordForm(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Изменить пароль')
                    ->description('Убедитесь, что ваш пароль надежный и безопасный')
                    ->schema([
                        TextInput::make('current_password')
                            ->label('Текущий пароль')
                            ->password()
                            ->required()
                            ->currentPassword()
                            ->revealable(),
                        TextInput::make('password')
                            ->label('Новый пароль')
                            ->password()
                            ->required()
                            ->rule(Password::default())
                            ->revealable()
                            ->different('current_password')
                            ->same('password_confirmation')
                            ->validationAttribute('новый пароль'),
                        TextInput::make('password_confirmation')
                            ->label('Подтвердите новый пароль')
                            ->password()
                            ->required()
                            ->revealable()
                            ->dehydrated(false),
                    ]),
            ])
            ->statePath('passwordData');
    }

    public function updateProfile(): void
    {
        $data = $this->profileForm->getState();
        
        $user = Auth::user();
        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->save();

        Notification::make()
            ->success()
            ->title('Профиль обновлен')
            ->body('Ваша личная информация успешно обновлена.')
            ->send();
    }

    public function updatePassword(): void
    {
        $data = $this->passwordForm->getState();
        
        $user = Auth::user();
        $user->password = Hash::make($data['password']);
        $user->save();

        $this->passwordForm->fill();

        Notification::make()
            ->success()
            ->title('Пароль обновлен')
            ->body('Ваш пароль успешно изменен.')
            ->send();
    }

    protected function getSchemas(): array
    {
        return [
            'profileForm',
            'passwordForm',
        ];
    }
}
