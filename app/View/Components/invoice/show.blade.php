<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture #{{ $invoice->id }}</title>
</head>
<body>
    <h1>Facture #{{ $invoice->id }}</h1>
    <p><strong>Montant Hors Taxes (HT) :</strong> {{ $invoice->amount_ht }} €</p>
    <p><strong>Montant TVA :</strong> {{ $tva }} €</p>
    <p><strong>Montant TTC :</strong> {{ $ttc }} €</p>
</body>
</html>
