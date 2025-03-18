<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Facture #{{ $facture->id }}</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 0; 
            color: #333; 
        }
        .container {
            width: 90%;
            max-width: 800px;
            margin: 20px auto;
            background: #fff;
            padding: 20px;
            box-shadow: 0 0 15px rgba(0,0,0,0.1);
            border-radius: 10px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #28a745;
            padding-bottom: 15px;
        }
        .header img {
            max-width: 100px;
            margin-bottom: 10px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #28a745;
            text-transform: uppercase;
        }
        .description {
            font-style: italic;
            color: #666;
            margin-bottom: 20px;
            font-size: 14px;
        }
        .client-card {
            border: 1px solid #ddd;
            padding: 15px;
            margin-bottom: 20px;
            background: #f8f8f8;
            border-radius: 8px;
        }
        .client-card h2 {
            margin: 0;
            font-size: 18px;
            color: #28a745;
        }
        .client-card p {
            margin: 5px 0;
            font-size: 14px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th {
            background: #28a745;
            color: white;
            font-weight: bold;
            text-transform: uppercase;
            padding: 10px;
        }
        td {
            padding: 8px;
            text-align: center;
        }
        .total {
            font-weight: bold;
            background: #f8f8f8;
        }
        .signature {
            margin-top: 30px;
            text-align: right;
            font-style: italic;
        }
        .signature-line {
            width: 200px;
            height: 1px;
            background: #333;
            margin: 5px auto 0;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #999;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <img src="{{ public_path('logoo.png') }}" alt="Logo">
        <h1>Facture N° {{ $facture->id }}</h1>
        <p class="description">Merci de votre confiance. Ci-dessous le détail de votre facture.</p>
    </div>

    <div class="client-card">
        <h2>Informations Client</h2>
        <p><strong>Nom :</strong> {{ $client->nom }}</p>
        <p><strong>Date :</strong> {{ $facture->date }}</p>
        <p><strong>Adresse :</strong> {{ $client->adresse ?? 'Non renseignée' }}</p>
        <p><strong>Email :</strong> {{ $client->email ?? 'Non renseigné' }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Prix Unitaire</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($produits as $produit)
                <tr>
                    <td>{{ $produit['nom'] ?? 'Produit #' . $produit['id'] }}</td>
                    <td>{{ $produit['quantite'] }}</td>
                    <td>{{ number_format($produit['prixUnitaire'], 2, ',', ' ') }} €</td>
                    <td>{{ number_format($produit['quantite'] * $produit['prixUnitaire'], 2, ',', ' ') }} €</td>
                </tr>
            @endforeach
        </tbody>
        <tfoot>
    <tr class="total">
        <td colspan="3">Total HT</td>
        <td>{{ number_format($facture->total_ht, 2, ',', ' ') }} €</td>
    </tr>
    <tr class="total">
        <td colspan="3">TVA ({{ $facture->tva }}%)</td>
        <td>{{ number_format($facture->total_ttc - $facture->total_ht, 2, ',', ' ') }} €</td>
    </tr>
    <tr class="total">
        <td colspan="3">Total TTC</td>
        <td>{{ number_format($facture->total_ttc, 2, ',', ' ') }} €</td>
    </tr>
</tfoot>

    </table>

    <div class="signature">
        <p>Signature du responsable</p>
        <div class="signature-line"></div>
    </div>

    <div class="footer">
        <p>Ce document est généré automatiquement - {{ date('Y-m-d') }}</p>
    </div>
</div>

</body>
</html>
