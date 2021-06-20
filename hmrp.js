const cv = require('./opencv');
require('./js/jquery');
const funcoes = require('./js/funcoes');
const $ = require('jquery-browserify');


$(document).ready(function () {
//  Variáveis e constantes iniciais
    let mat;
    let imagem;
    let dst;
    let huv;
    let fft_imagem;
    let imagem_filtrada;
    let im_input;

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

        let temp_huv = huv.clone();

        temp_huv = funcoes.GaussModif(
            parseFloat(gl_slider.value),
            parseFloat(gh_slider.value),
            parseFloat(c_slider.value),
            parseFloat(d0_slider.value),
            dst
        );

        fft_imagem = funcoes.ApplyHomomorphic(temp_huv, dst);

        //funcoes.CrossQuads(huv);
        // cv.imshow('huv_canvas', huv);
        cv.imshow('img_canvas', fft_imagem);

        // Atualiza valores das variáveis
        gamma_l = gl_slider.value;
        gamma_h = gh_slider.value;
        c = c_slider.value;
        d0 = d0_slider.value;

        // Limpa variáveis temporárias
        temp_huv.delete();

    });

    $("#gamma_h").change(function () {
        let texto = "\\(\\gamma_{H} = " + this.value +"\\)";
        document.getElementById("gamma_h_label").innerHTML = texto;
        MathJax.typeset();

        let temp_huv = huv.clone();

        temp_huv = funcoes.GaussModif(
            parseFloat(gl_slider.value),
            parseFloat(gh_slider.value),
            parseFloat(c_slider.value),
            parseFloat(d0_slider.value),
            dst
        );

        fft_imagem = funcoes.ApplyHomomorphic(temp_huv, dst);

        //funcoes.CrossQuads(huv);
        // cv.imshow('huv_canvas', huv);
        cv.imshow('img_canvas', fft_imagem);

        // Atualiza valores das variáveis
        gamma_l = gl_slider.value;
        gamma_h = gh_slider.value;
        c = c_slider.value;
        d0 = d0_slider.value;

        // Limpa variáveis temporárias
        temp_huv.delete();
    });

    $("#c_slider").change(function () {
        let texto = "\\(c = " + this.value +"\\)";
        document.getElementById("c_label").innerHTML = texto;
        MathJax.typeset();

        let temp_huv = huv.clone();

        temp_huv = funcoes.GaussModif(
            parseFloat(gl_slider.value),
            parseFloat(gh_slider.value),
            parseFloat(c_slider.value),
            parseFloat(d0_slider.value),
            dst
        );

        fft_imagem = funcoes.ApplyHomomorphic(temp_huv, dst);

        //funcoes.CrossQuads(huv);
        // cv.imshow('huv_canvas', huv);
        cv.imshow('img_canvas', fft_imagem);

        // Atualiza valores das variáveis
        gamma_l = gl_slider.value;
        gamma_h = gh_slider.value;
        c = c_slider.value;
        d0 = d0_slider.value;

        // Limpa variáveis temporárias
        temp_huv.delete();
    });

    $("#d0_slider").change(function () {
        let d0 = this.value;
        let texto = "\\(D_{0} = " + d0 +"\\)";
        document.getElementById("d0_label").innerHTML = texto;
        MathJax.typeset();

        let temp_huv = huv.clone();

        temp_huv = funcoes.GaussModif(
            parseFloat(gl_slider.value),
            parseFloat(gh_slider.value),
            parseFloat(c_slider.value),
            parseFloat(d0_slider.value),
            dst
        );

        fft_imagem = funcoes.ApplyHomomorphic(temp_huv, dst);

        //funcoes.CrossQuads(huv);
        // cv.imshow('huv_canvas', huv);
        cv.imshow('img_canvas', fft_imagem);

        // Atualiza valores das variáveis
        gamma_l = gl_slider.value;
        gamma_h = gh_slider.value;
        c = c_slider.value;
        d0 = d0_slider.value;

        // Limpa variáveis temporárias
        temp_huv.delete();
    });
///////////////////////////////
    $("#rx_input").change(function (e) {
        imagem = document.getElementById("img_container");
        imagem.src = URL.createObjectURL(e.target.files[0]);
    });

    // Carrega a imagem ampliada
    $("#img_container").click(function (e) {
        e.preventDefault();
        let imagem = document.getElementById("img_container")
        let im_ampliada = document.getElementById("imagem_ampliada");
        im_ampliada.src = imagem.src;
        $("#modal_imagem_original").modal('show');
    });

    // Carrega a imagem filtrada ampliada
    $("#img_canvas").click(function (e) {
        e.preventDefault();
        huv = funcoes.GaussModif(
            parseFloat(gl_slider.value),
            parseFloat(gh_slider.value),
            parseFloat(c_slider.value),
            parseFloat(d0_slider.value),
            dst
        );

        fft_imagem = funcoes.ApplyHomomorphic(huv, dst);

        $("#modal_imagem_filtrada").modal('show');
        cv.imshow('filt_ampliada', fft_imagem);
    })

    //Carrega a imagem via OpenCV
    $("#img_container").load(function () {
        mat = cv.imread(imagem);
        console.log("Dimensões da imagem original:  " + mat.rows, mat.cols);
        dst = new cv.Mat();
        cv.cvtColor(mat, dst, cv.COLOR_RGBA2GRAY, 0);
        huv = funcoes.GaussModif(
            0.85,
            8.9,
            2.0,
            1724, dst);

        fft_imagem = funcoes.MakeFFT(dst);
        imagem_filtrada = funcoes.ApplyHomomorphic(huv, dst);

        // cv.imshow('huv_canvas', huv);
        cv.imshow('img_canvas', imagem_filtrada);
    });
/////////////////////////
// BOTÕES
    //Abre a caixa de diálogo para selecionar imagem
    $("#carregar").click(function () {
        $("#rx_input").trigger('click');
    });

    //Limpa os valores dos controles
    $("#limpar").click(function () {
        // Reinicia variáveis
        gamma_l = 0.01;
        gamma_h = 1.0;
        c = 0.0;
        d0 = 30;

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

        fft_imagem = funcoes.ApplyHomomorphic(huv, dst);

        // cv.imshow('img_canvas', huv);
        cv.imshow('img_canvas', fft_imagem);
    });

    // Calcula o histograma e envia para o banco de dados juntamente com os valores selecionados
    $("#salvar").click(function (e) {
        e.preventDefault();

        // Calcula o histograma
        let channels = [0];
        let hist_size = [256];
        let ranges = [0, 255];
        let acumulado = false;
        let histograma = new cv.Mat();
        let mask = new cv.Mat();
        let vetor_imagem = new cv.MatVector();
        vetor_imagem.push_back(dst);

        cv.calcHist(vetor_imagem, channels, mask, histograma, hist_size, ranges, acumulado);

        // Escreve o JSON para enviar ao banco de dados
        let string_data = JSON.stringify(histograma.data32F);
        let controles = JSON.stringify(
            {'gamma_l' : gamma_l, 'gamma_h' : gamma_h, 'c' : c, 'D0' : d0}
        );

        let dados = {
            'histograma' : string_data,
            'ajustes' : controles
        }

        console.log(dados);
    });

///////////////////////////

});



