document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('calcularBtn').addEventListener('click', function () {
        calcularEstatisticas();
    });
});

function calcularEstatisticas() {
    var dadosInput = document.getElementById('dados');
    var resultadosDiv = document.getElementById('resultados');
    var histogramaDiv = document.getElementById('histograma');

    // Obter os dados e convertê-los para uma array de números
    var dados = dadosInput.value.split(',').map(function (item) {
        return parseFloat(item.trim());
    });

    // Calcular estatísticas
    var media = calcularMedia(dados);
    var mediana = calcularMediana(dados);
    var moda = calcularModa(dados);
    var variancia = calcularVariancia(dados);
    var desvioPadrao = calcularDesvioPadrao(dados);
    var coefVariacao = calcularCoefVariacao(media, desvioPadrao);

    // Exibir os resultados
    resultadosDiv.innerHTML = `
        <p>Média: ${media.toFixed(2)}</p>
        <p>Mediana: ${mediana.toFixed(2)}</p>
        <p>Moda: ${moda}</p>
        <p>Variância: ${variancia.toFixed(2)}</p>
        <p>Desvio Padrão: ${desvioPadrao.toFixed(2)}</p>
        <p>Coeficiente de Variação: ${coefVariacao.toFixed(2)}%</p>
    `;

    // Gerar histograma
    gerarHistograma(dados, histogramaDiv);
}

function calcularMedia(dados) {
    return dados.reduce((acc, curr) => acc + curr, 0) / dados.length;
}

function calcularMediana(dados) {
    var sorted = dados.slice().sort((a, b) => a - b);
    var meio = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[meio - 1] + sorted[meio]) / 2;
    } else {
        return sorted[meio];
    }
}

function calcularModa(dados) {
    var contagem = {};
    dados.forEach(function (numero) {
        contagem[numero] = (contagem[numero] || 0) + 1;
    });

    var moda = [];
    var maxContagem = 0;
    for (var numero in contagem) {
        if (contagem.hasOwnProperty(numero)) {
            if (contagem[numero] > maxContagem) {
                moda = [numero];
                maxContagem = contagem[numero];
            } else if (contagem[numero] === maxContagem) {
                moda.push(numero);
            }
        }
    }

    return moda.join(', ');
}

function calcularVariancia(dados) {
    var media = calcularMedia(dados);
    var somaDiferencasQuadradas = dados.reduce((acc, curr) => acc + Math.pow(curr - media, 2), 0);
    return somaDiferencasQuadradas / dados.length;
}

function calcularDesvioPadrao(dados) {
    return Math.sqrt(calcularVariancia(dados));
}

function calcularCoefVariacao(media, desvioPadrao) {
    return (desvioPadrao / media) * 100;
}

function gerarHistograma(dados, histogramaDiv) {
    histogramaDiv.innerHTML = ''; // Limpar o conteúdo anterior

    var trace = {
        x: dados,
        type: 'histogram',
        marker: {
            color: 'rgba(100, 149, 237, 0.6)',
        },
        opacity: 0.7,
        nbinsx: 20,  // Número de barras
        histnorm: 'probability', // 'probability' para normalizar as barras
    };

    var layout = {
        title: 'Histograma de Frequência',
        xaxis: { title: 'Valor' },
        yaxis: { title: 'Frequência Relativa' },
        barmode: 'overlay',  // Barras sobrepostas
    };

    Plotly.newPlot(histogramaDiv, [trace], layout);
}