<?php

namespace App\Models\API\V1;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use App\Models\API\V1\SurveyQuestion;
use App\Models\API\V1\SurveyAnswer;

class Survey extends Model
{
    use HasFactory, HasSlug;

    protected $fillable = ['title','slug','description','expire_date','status','user_id'];

    public function getSlugOptions():SlugOptions{
        return SlugOptions::create()->generateSlugsFrom('title')->saveSlugsTo('slug');
    }

    public function questions()
    {
        return $this->hasMany(SurveyQuestion::class);
    }

    public function answers()
    {
        return $this->hasMany(SurveyAnswer::class);
    }


}
