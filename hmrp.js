const cv = require('./opencv');
require('./js/jquery');
const funcoes = require('./js/funcoes');
const $ = require('jquery-browserify');


$(document).ready(function () {
//  Variáveis e constantes iniciais
    let imagem;
    let dst;
    let huv;
    let fft_imagem;
    let imagem_filtrada;

    let gamma_l = 0.01;
    let gamma_h = 1.0;
    let c = 0.0;
    let d0 = 30;
//////////////////////////
//  Sliders
    let gl_slider = document.getElementById("gamma_l");
    let gh_slider = document.getElementById("gamma_h");
    let c_slider = document.getElementById("c_slider");
    let d0_slider = document.getElementById("d0_slider");

    //  Inicialização dos sliders
    gl_slider.value = gamma_l;
    gh_slider.value = gamma_h;
    c_slider.value = c;
    d0_slider.value = d0;

    // Funcionamento dos sliders

    $("#gamma_l").change(function () {
        let texto = "\\(\\gamma_{L} = " + this.value +"\\)";
        document.getElementById("gamma_l_label").innerHTML = texto;
        MathJax.typeset();

        huv = funcoes.GaussModif(
            parseFloat(gl_slider.value),
            parseFloat(gh_slider.value),
            parseFloat(c_slider.value),
            parseFloat(d0_slider.value),
            dst
        );

        //fft_imagem = funcoes.ApplyHomomorphic(huv, dst);

        //funcoes.CrossQuads(huv);
        cv.imshow('huv_canvas', huv);
        //cv.imshow('img_canvas', fft_imagem);

    });

    $("#gamma_h").change(function () {
        let texto = "\\(\\gamma_{H} = " + this.value +"\\)";
        document.getElementById("gamma_h_label").innerHTML = texto;
        MathJax.typeset();

        huv = funcoes.GaussModif(
            parseFloat(gl_slider.value),
            parseFloat(gh_slider.value),
            parseFloat(c_slider.value),
            parseFloat(d0_slider.value),
            dst
        );

       // fft_imagem = funcoes.ApplyHomomorphic(huv, dst);

        //funcoes.CrossQuads(huv);
        cv.imshow('huv_canvas', huv);
        //cv.imshow('img_canvas', fft_imagem);
    });

    $("#c_slider").change(function () {
        let texto = "\\(c = " + this.value +"\\)";
        document.getElementById("c_label").innerHTML = texto;
        MathJax.typeset();

        huv = funcoes.GaussModif(
            parseFloat(gl_slider.value),
            parseFloat(gh_slider.value),
            parseFloat(c_slider.value),
            parseFloat(d0_slider.value),
            dst
        );

        //fft_imagem = funcoes.ApplyHomomorphic(huv, dst);

        //funcoes.CrossQuads(huv);
        cv.imshow('huv_canvas', huv);
        //cv.imshow('img_canvas', fft_imagem);
    });

    $("#d0_slider").change(function () {
        let d0 = this.value;
        let texto = "\\(D_{0} = " + d0 +"\\)";
        document.getElementById("d0_label").innerHTML = texto;
        MathJax.typeset();

        huv = funcoes.GaussModif(
            parseFloat(gl_slider.value),
            parseFloat(gh_slider.value),
            parseFloat(c_slider.value),
            parseFloat(d0_slider.value),
            dst
        );

        //fft_imagem = funcoes.ApplyHomomorphic(huv, dst);

        //funcoes.CrossQuads(huv);
        cv.imshow('huv_canvas', huv);
        //cv.imshow('img_canvas', fft_imagem);
    });
///////////////////////////////
    //Abre a caixa de diálogo para selecionar imagem
    $("#carregar").click(function () {
        $("#rx_input").trigger('click');
    });

    //Limpa os valores dos controles
    $("#limpar").click(function () {
        //  Restaura o valor dos controles**
        document.getElementById("gamma_l").value = gamma_l;
        document.getElementById("gamma_h").value = gamma_h;
        document.getElementById("c_slider").value = c;
        document.getElementById("d0_slider").value = d0;

        let texto = "\\(\\gamma_{L} = 0.01 "+"\\)";
        document.getElementById("gamma_l_label").innerHTML = texto;
        MathJax.typeset();

        texto = "\\(\\gamma_{H} = 1.0 "+"\\)";
        document.getElementById("gamma_h_label").innerHTML = texto;
        MathJax.typeset();

        texto = "\\(c = 0.0 "+"\\)";
        document.getElementById("c_label").innerHTML = texto;
        MathJax.typeset();

        texto = "\\(D_{0} = 30 "+"\\)";
        document.getElementById("d0_label").innerHTML = texto;
        MathJax.typeset();

        // Restaura a imagem
        huv = funcoes.GaussModif(
            parseFloat(gl_slider.value),
            parseFloat(gh_slider.value),
            parseFloat(c_slider.value),
            parseFloat(d0_slider.value),
            dst
        );

        cv.imshow('img_canvas', huv);
        huv.delete();
    });

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
        let huv = funcoes.GaussModif(
            0.87,
            9.2,
            0.5,
            1523, dst);

        fft_imagem = funcoes.MakeFFT(dst);
        imagem_filtrada = funcoes.ApplyHomomorphic(huv, dst);

        cv.imshow('huv_canvas', huv);
        //cv.imshow('img_canvas', imagem_filtrada);

    });

});



