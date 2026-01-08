<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DoorModel extends Model
{
    protected $fillable = ['name', 'image', 'type', 'is_thermally_resistant'];
}
