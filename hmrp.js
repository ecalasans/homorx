const cv = require('./js/opencv');
require('./js/jquery');
const funcoes = require('./js/funcoes');
const $ = require('jquery-browserify');


$(document).ready(function () {
    let imagem;
//////////////////////////
//  Sliders
    $("#gamma_l").value = 0;
    $("#gamma_l").change(function () {
        var gammaL = this.value;
        var texto = "\\(\\gamma_{L} = " + gammaL +"\\)";
        document.getElementById("gamma_l_label").innerHTML = texto;
        MathJax.typeset();
    });
///////////////////////////////
    //Abre a caixa de diálogo para selecionar imagem
    $("#carregar").click(function () {
        $("#rx_input").trigger('click');
    });

    //Limpa os valores dos controles
    $("#limpar").click(function () {
        document.getElementById("gamma_l").value = "0";
        let texto = "\\(\\gamma_{L} = 0.0 "+"\\)";
        document.getElementById("gamma_l_label").innerHTML = texto;
        MathJax.typeset();
    });


    $("#rx_input").change(function (e) {
        imagem = document.getElementById("img_container");
        imagem.src = URL.createObjectURL(e.target.files[0]);
    });

    //Carrega a imagem via OpenCV
    $("#img_container").load(function () {
        var mat = cv.imread(imagem);
        var dst = new cv.Mat();
        cv.cvtColor(mat, dst, cv.COLOR_RGBA2GRAY, 0);
        let fft_imagem = funcoes.MakeFFT(dst);
        cv.imshow('img_canvas', fft_imagem);
    });

});



