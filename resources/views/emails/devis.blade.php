<!DOCTYPE html>
<html>
<head>
    <title>Votre Devis</title>
</head>
<body>
    <h1>Bonjour,</h1>
    <p>Voici votre devis :</p>
    <ul>
        <li><strong>Client :</strong> {{ $devis->client }}</li>
        <li><strong>Date :</strong> {{ $devis->date }}</li>
        <li><strong>Total TTC :</strong> {{ $devis->totalTTC }} €</li>
        <li><strong>Statut :</strong> {{ $devis->statut }}</li>
    </ul>
    <p>Merci de nous faire confiance.</p>
</body>
</html>
