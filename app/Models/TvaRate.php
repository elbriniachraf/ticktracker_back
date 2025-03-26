<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class TvaRate extends Model
{
    use HasFactory;

    protected $fillable = ['country_code', 'label', 'rate', 'category', 'is_active', 'valid_from', 'valid_to'];

    // Relation avec les produits/services
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    // Scope pour filtres courants
    public function scopeActive(Builder $query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCountry(Builder $query, $countryCode)
    {
        return $query->where('country_code', $countryCode);
    }

    // Validation rules
    public static function validationRules($id = null)
    {
        $rules = [
            'country_code' => 'required|string|max:255',
            'rate' => 'required|numeric',
            'valid_from' => 'required|date',
            'valid_to' => 'required|date|after_or_equal:valid_from',
        ];
    
        // Si c'est une création, on ajoute la règle d'unicité
        if (!$id) {
            $rules['valid_from'] = ['required', 'date', 'unique:tva_rates,valid_from,NULL,id,country_code,' . request()->country_code];
            $rules['valid_to'] = ['required', 'date', 'unique:tva_rates,valid_until,NULL,id,country_code,' . request()->country_code];
        }
    
        return $rules;
    }
    

}