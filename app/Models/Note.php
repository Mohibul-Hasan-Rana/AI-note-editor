<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    protected $fillable = ['title', 'content', 'user_id', 'tags'];

    protected $casts = [
        'tags' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
