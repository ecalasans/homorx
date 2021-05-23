const cv = require('./js/opencv');
require('./js/jquery');
const funcoes = require('./js/funcoes');
const $ = require('jquery-browserify');


$(document).ready(function () {
    let imagem;
    let dst;
//////////////////////////
//  Sliders
    document.getElementById("gamma_l").value = 0;
    document.getElementById("gamma_h").value = 0;
    document.getElementById("c_slider").value = 0;
    document.getElementById("d0_slider").value = 0;

    // Funcionamento dos sliders

    $("#gamma_l").change(function () {
        let gammaL = this.value;
        let texto = "\\(\\gamma_{L} = " + gammaL +"\\)";
        document.getElementById("gamma_l_label").innerHTML = texto;
        MathJax.typeset();
    });

    $("#gamma_h").change(function () {
        let gammaH = this.value;
        let texto = "\\(\\gamma_{L} = " + gammaH +"\\)";
        document.getElementById("gamma_h_label").innerHTML = texto;
        MathJax.typeset();
    });

    $("#c_slider").change(function () {
        let c = this.value;
        let texto = "\\(\\gamma_{L} = " + c +"\\)";
        document.getElementById("c_label").innerHTML = texto;
        MathJax.typeset();
    });

    $("#d0_slider").change(function () {
        let d0 = this.value;
        let texto = "\\(\\gamma_{L} = " + d0 +"\\)";
        document.getElementById("d0_label").innerHTML = texto;
        MathJax.typeset();
    });
///////////////////////////////
    //Abre a caixa de diálogo para selecionar imagem
    $("#carregar").click(function () {
        $("#rx_input").trigger('click');
    });

    //Limpa os valores dos controles
    $("#limpar").click(function () {
        document.getElementById("gamma_l").value = 0;
        document.getElementById("gamma_h").value = 0;
        document.getElementById("c_slider").value = 0;
        document.getElementById("d0_slider").value = 0;

        let texto = "\\(\\gamma_{L} = 0.0 "+"\\)";
        document.getElementById("gamma_l_label").innerHTML = texto;
        MathJax.typeset();

        texto = "\\(\\gamma_{H} = 0.0 "+"\\)";
        document.getElementById("gamma_h_label").innerHTML = texto;
        MathJax.typeset();

        texto = "\\(c = 0.0 "+"\\)";
        document.getElementById("c_label").innerHTML = texto;
        MathJax.typeset();

        texto = "\\(D_{0} = 0.0 "+"\\)";
        document.getElementById("d0_label").innerHTML = texto;
        MathJax.typeset();
    });

    $("#salvar").click(function () {
        let huv = funcoes.GaussModif(0.85,3.5,3,2000,dst);
        console.log(huv.shape);
    })


    $("#rx_input").change(function (e) {
        imagem = document.getElementById("img_container");
        imagem.src = URL.createObjectURL(e.target.files[0]);
    });

    //Carrega a imagem via OpenCV
    $("#img_container").load(function () {
        var mat = cv.imread(imagem);
        console.log("Dimensões da imagem original:  " + mat.rows, mat.cols);
        dst = new cv.Mat();
        cv.cvtColor(mat, dst, cv.COLOR_RGBA2GRAY, 0);
        let fft_imagem = funcoes.MakeFFT(dst);
        cv.imshow('img_canvas', fft_imagem);
    });

});



